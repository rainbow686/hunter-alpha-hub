#!/usr/bin/env node
/**
 * The subscription loop, checked as a loop.
 *
 * The site promises one thing in exchange for an email address: "we will tell
 * you when the next codename appears", and the note under the form adds
 * "unsubscribe in one click". Every check in this repo until now looked at those
 * promises one string at a time, which is exactly how the promise survived a
 * database that did not exist: the form, the copy and the privacy policy all
 * agreed with each other while the endpoint answered 503 to every submit
 * (ADR-0014).
 *
 * So this check walks the chain end to end and fails when a link in it is
 * missing, unsynchronised, or dangerous:
 *
 *   1. the migration issues a `token` column with a unique index
 *   2. both signup routes INSERT that token        (Next + Astro)
 *   3. both unsubscribe routes exist and DELETE by token
 *   4. GET never deletes — link scanners fetch every URL in an email before the
 *      reader does, so a mutating GET unsubscribes people who never asked
 *   5. the two unsubscribe documents are the same document, and its inlined
 *      palette still matches the frozen system in src/styles/system.css
 *
 * Every one of those has been broken on purpose to prove it fires; see the PR.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(here, "../../");
const failures = [];
const read = (rel) => readFileSync(join(ROOT, rel), "utf8");

// ── 1. the schema issues tokens ────────────────────────────────────────────
const migrationDir = join(ROOT, "d1/migrations");
const migrations = readdirSync(migrationDir)
  .filter((name) => name.endsWith(".sql"))
  .sort()
  .map((name) => ({ name, sql: readFileSync(join(migrationDir, name), "utf8") }))
  .filter(({ sql }) => /subscribers/.test(sql));

if (migrations.length === 0) {
  failures.push("no migration mentions the subscribers table");
}
const schema = migrations.map(({ sql }) => sql).join("\n");
if (!/ALTER TABLE subscribers ADD COLUMN token TEXT/i.test(schema)) {
  failures.push("no migration adds the subscribers.token column");
}
if (!/CREATE UNIQUE INDEX IF NOT EXISTS subscribers_token_unique ON subscribers \(token\)/i.test(schema)) {
  failures.push("no unique index on subscribers.token — two subscribers could share an unsubscribe link");
}

// ── 2. both signup routes issue a token ────────────────────────────────────
const SIGNUP_ROUTES = ["astro/src/pages/api/subscribe.ts", "app/api/subscribe/route.ts"];
for (const route of SIGNUP_ROUTES) {
  const source = read(route);
  if (!/INSERT INTO subscribers \(email, source, token\) VALUES \(\?, \?, \?\)/.test(source)) {
    failures.push(`${route} does not INSERT a token — the row would be unsubscribable`);
  }
  if (!/crypto\.randomUUID\(\)\.replace\(\/-\/g, ""\)/.test(source)) {
    failures.push(`${route} does not generate a 128-bit token`);
  }
}

// ── 3 + 4. the unsubscribe routes exist, delete by token, and GET is read-only ─
const UNSUB_ROUTES = ["astro/src/pages/unsubscribe.ts", "app/unsubscribe/route.ts"];
for (const route of UNSUB_ROUTES) {
  const source = read(route);
  if (!/DELETE FROM subscribers WHERE token = \?/.test(source)) {
    failures.push(`${route} has no token-scoped DELETE`);
  }
  /*
   * GET must be a confirmation, not a removal. Cut the file at the handler
   * boundaries rather than scanning the whole file, because the POST handler is
   * *supposed* to contain the delete and a file-wide search would either pass
   * everything or need the delete in POST to be rewritten to hide from it.
   */
  const getStart = source.search(/export (const GET|async function GET)/);
  const postStart = source.search(/export (const POST|async function POST)/);
  if (getStart === -1 || postStart === -1 || postStart < getStart) {
    failures.push(`${route} does not declare GET before POST`);
    continue;
  }
  const getHandler = source.slice(getStart, postStart);
  if (/DELETE FROM|\.delete\(/.test(getHandler)) {
    failures.push(
      `${route} mutates state in GET — a mail-security scanner would unsubscribe the reader before they open the email`,
    );
  }
  if (/SELECT email FROM subscribers WHERE token = \?/.test(getHandler) === false) {
    failures.push(`${route} GET does not look the token up, so it cannot confirm anything`);
  }
}

// ── 3b. the sending half exists, is guarded, and cannot double-send ──────────
/*
 * "We will tell you when the next codename appears" is only true if something can
 * send. Three things are load-bearing and each has its own way of being absent:
 * the binding (capability), the token (nobody else can mail the list), and the
 * unique broadcast key (running it twice cannot mail everyone twice).
 */
const NOTIFY_ROUTE = "astro/src/pages/api/notify.ts";
/*
 * Comments are stripped before matching. Both of the checks below were blind on
 * the first run because the patterns matched the *documentation* of the guard
 * rather than the guard itself: deleting the runtime token read still passed
 * (the interface still said `NOTIFY_TOKEN?`), and pointing the unsubscribe URL
 * at `/opt-out` still passed (the header comment still said `/unsubscribe?t=`).
 * A guard that passes because it matched a comment is worse than no guard.
 */
const notify = stripComments(read(NOTIFY_ROUTE));
for (const [what, pattern] of [
  ["an Authorization check", /authorization[\s\S]{0,120}=== expected|offered !== expected/],
  ["a runtime NOTIFY_TOKEN read", /const expected = env\.NOTIFY_TOKEN/],
  ["a per-recipient unsubscribe link", /unsubscribeUrlFor\(/],
  ["the List-Unsubscribe headers", /headersFor\(/],
  ["a duplicate-broadcast guard", /INSERT INTO broadcasts/],
]) {
  if (!pattern.test(notify)) failures.push(`${NOTIFY_ROUTE} is missing ${what}`);
}

const TEMPLATE = "astro/src/lib/notify-email.ts";
const template = stripComments(read(TEMPLATE));
if (!/List-Unsubscribe":\s*`<\$\{input\.unsubscribeUrl\}>`/.test(template)) {
  failures.push(
    `${TEMPLATE}: List-Unsubscribe must be an angle-bracketed HTTPS URI — Cloudflare rejects any other form with E_HEADER_VALUE_INVALID`,
  );
}
if (!/List-Unsubscribe-Post":\s*"List-Unsubscribe=One-Click"/.test(template)) {
  failures.push(`${TEMPLATE}: List-Unsubscribe-Post must be exactly "List-Unsubscribe=One-Click" (RFC 8058)`);
}
if (!/\/unsubscribe\?t=/.test(template)) {
  failures.push(`${TEMPLATE}: the unsubscribe URL does not point at the /unsubscribe route that exists`);
}

for (const config of ["astro/wrangler.jsonc", "astro/wrangler.production.jsonc"]) {
  const source = read(config).replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
  if (!/"send_email"\s*:\s*\[\s*\{\s*"name"\s*:\s*"EMAIL"\s*\}\s*\]/.test(source)) {
    failures.push(`${config} has no send_email binding named EMAIL — the notify endpoint would answer 503`);
  }
}

const migration = readdirSync(migrationDir)
  .filter((name) => name.endsWith(".sql"))
  .sort()
  .map((name) => readFileSync(join(migrationDir, name), "utf8"))
  .join("\n");
if (!/CREATE UNIQUE INDEX IF NOT EXISTS broadcasts_key_unique ON broadcasts \(broadcast_key\)/.test(migration)) {
  failures.push("no unique index on broadcasts.broadcast_key — a broadcast could be sent twice by accident");
}

// ── 5. the two documents are one document, and the palette is the system ───
/*
 * Astro's CSRF check has to stay off while /unsubscribe accepts a POST from a
 * mailbox provider. It was on, and it cost an afternoon: the button in the email
 * worked (browser sends Origin) and RFC 8058 one-click did not (provider sends
 * none) — 403 "Cross-site POST form submissions are forbidden". A promise has to
 * behave the same for the reader and for the provider, so this is a rule now.
 */
const astroConfig = read("astro/astro.config.mjs").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
if (!/security:\s*\{\s*checkOrigin:\s*false\s*\}/.test(astroConfig)) {
  failures.push(
    "astro.config.mjs does not set security.checkOrigin:false — RFC 8058 one-click POSTs (no Origin header) would be rejected with 403 while the browser form still worked",
  );
}

const TEMPLATES = ["astro/src/lib/unsubscribe-page.ts", "lib/unsubscribe-page.ts"];
const extract = (source, after, until) => {
  const start = source.indexOf(after);
  if (start === -1) return null;
  const end = source.indexOf(until, start + after.length);
  if (end === -1) return null;
  return source.slice(start + after.length, end);
};

/*
 * Same page on both deployments, proved in two directions:
 *
 *   every string / template literal, compared as text — this is what a reader
 *   sees, and an edit to one copy of the page shows up here;
 *
 *   the code that is left once the strings and comments are stripped, compared
 *   as text — this is what the page *does* (the form's method and action, the
 *   escaping call, the hidden input), so a change in behaviour cannot hide
 *   behind identical copy.
 *
 * Comments are stripped before the comparison because the two files carry
 * different explanations on purpose, and requiring identical prose in the
 * comments would make the check something people edit around.
 */
/**
 * Comments are removed by a scanner rather than a regex, because the naive
 * version cuts the two slashes out of `https://…` and turns a real difference
 * into a phantom one. The scanner tracks whether it is inside a quote, so a `//`
 * in a URL survives and a `//` in prose does not.
 */
function stripComments(source) {
  let out = "";
  let quote = null;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];
    if (quote) {
      out += char;
      if (char === "\\") {
        out += next ?? "";
        i += 1;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      out += char;
      continue;
    }
    if (char === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") i += 1;
      out += "\n";
      continue;
    }
    if (char === "/" && next === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 1;
      out += " ";
      continue;
    }
    out += char;
  }
  return out;
}

const BITE = /`(?:[^`\\]|\\.)*`|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g;
const normalise = (text) => text.replace(/\s+/g, " ").trim();
const literalsOf = (source) =>
  [...stripComments(source).matchAll(BITE)].map((match) => normalise(match[0])).sort().join("\u0000");
const skeletonOf = (source) => normalise(stripComments(source).replace(BITE, ""));

const [astroDoc, nextDoc] = TEMPLATES.map((file) => read(file));
for (const [label, a, b] of [
  ["copy", literalsOf(astroDoc), literalsOf(nextDoc)],
  ["behaviour", skeletonOf(astroDoc), skeletonOf(nextDoc)],
]) {
  if (!a || !b) {
    failures.push(`the ${label} comparison produced an empty side — the check would be blind`);
  } else if (a !== b) {
    failures.push(
      `the two unsubscribe documents differ in ${label}: ${TEMPLATES[0]} and ${TEMPLATES[1]} would serve different pages`,
    );
  }
}
// A template that renders nothing is not "identical", it is absent.
if (!/<!doctype html>/.test(literalsOf(astroDoc)) || !/unsubscribeDocument/.test(skeletonOf(astroDoc))) {
  failures.push("the shared unsubscribe document template is missing — the check would be blind");
}

const systemCss = read("astro/src/styles/system.css");
const tokensIn = (css, block) => {
  const out = new Map();
  for (const [, name, value] of block.matchAll(/--([a-z-]+):\s*([^;]+);/g)) out.set(name, value.trim());
  return out;
};
const lightSystem = tokensIn(systemCss, extract(systemCss, ":root {", "}") ?? "");
const darkSystem = tokensIn(
  systemCss,
  extract(systemCss, '@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {', "}") ?? "",
);
if (lightSystem.size < 10 || darkSystem.size < 10) {
  failures.push("could not read the frozen palette out of system.css — fix the extraction before trusting this check");
}

for (const file of TEMPLATES) {
  const style = extract(read(file), "const STYLE = `", "`;") ?? "";
  const light = tokensIn(style, extract(style, ":root {", "}") ?? "");
  const dark = tokensIn(
    style,
    extract(style, "@media (prefers-color-scheme: dark) {\n        :root {", "}") ?? "",
  );
  if (light.size === 0 || dark.size === 0) {
    failures.push(`${file}: could not read the inlined palette — the drift check would be blind`);
    continue;
  }
  for (const [name, value] of light) {
    if (lightSystem.get(name) !== value) {
      failures.push(
        `${file}: --${name} is ${value} but system.css says ${lightSystem.get(name) ?? "nothing"} (daylight)`,
      );
    }
  }
  for (const [name, value] of dark) {
    if (darkSystem.get(name) !== value) {
      failures.push(
        `${file}: --${name} is ${value} but system.css says ${darkSystem.get(name) ?? "nothing"} (night)`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error("check-subscription: FAIL\n");
  for (const failure of failures) console.error(`  ✘ ${failure}`);
  process.exit(1);
}
console.log(
  `check-subscription: ok — token issued by 2 signup routes, deleted by 2 read-only GET + 2 token-scoped DELETE routes, palette matches system.css (${lightSystem.size} day / ${darkSystem.size} night tokens)`,
);
