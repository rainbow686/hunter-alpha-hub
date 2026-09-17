#!/usr/bin/env node
/**
 * Migration parity check: built Astro pages vs the live Next pages.
 *
 * This is the guard for Phase 4. Ranking assets are not "the design looks
 * right" — they are the title, the meta description, the canonical URL, one
 * single <h1>, and the JSON-LD that is already indexed. Any intentional
 * deviation has to be written into ALLOWED_DIFFERENCES, so a silent drift is
 * impossible and a deliberate change is reviewable.
 *
 * Usage: node scripts/verify-pages.mjs [--offline]   (npm run verify:pages)
 *   --offline compares the build against a cached copy in .cache/parity/
 *   --refresh re-fetches the live pages; the cache is otherwise reused for six
 *     hours, which will happily hide a deploy you just made (use this whenever
 *     you are verifying that a merge actually reached production)
 *   PREVIEW_ORIGIN=https://… also checks that every path is served directly
 *   (200, no redirect) on the deployed preview — the trailing-slash trap.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, "../dist");
const CACHE = join(here, "../.cache/parity");
const ORIGIN = "https://www.hunteralphahub.com";
const offline = process.argv.includes("--offline");

/**
 * Migrated pages that must match the live site on every indexed field. Routes
 * join this list as they are migrated; the article list is derived from the
 * build so a post cannot be added to the collection and quietly skip the check.
 */
const MIGRATED_PATHS = [
  "/",
  "/union-alpha",
  "/union-alpha-free",
  "/union-alpha-opencode",
  "/union-alpha-not-working",
  "/openrouter-models",
  "/comparison",
  "/stealth-models",
  "/alpha-models",
  "/best-openrouter-models",
  "/hunter-alpha",
  "/openrouter-free-models",
  "/hunter-alpha-benchmarks",
  "/terms",
  "/privacy",
  "/ox-alpha",
  "/faq",
  "/access",
  "/zh/faq",
  "/zh/access",
  "/openrouter-pricing-calculator",
  "/blog",
];

function builtArticlePaths() {
  const dir = join(DIST, "blog");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".html"))
    .map((name) => `/blog/${name.replace(/\.html$/, "")}`)
    .sort();
}

/**
 * Dynamic routes whose pages are generated from the curated snapshot. Both the
 * articles and these are derived from the build rather than listed by hand: a
 * template that gains a route cannot quietly skip the parity check, and a model
 * added to lib/openrouter-models.ts is checked the moment it renders.
 */
function builtPathsUnder(segment) {
  const dir = join(DIST, segment);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".html") && name !== "index.html")
    .map((name) => `/${segment}/${name.replace(/\.html$/, "")}`)
    .sort();
}

const PATHS = [
  ...MIGRATED_PATHS,
  ...builtArticlePaths(),
  ...builtPathsUnder("openrouter-models"),
  ...builtPathsUnder("compare"),
];

/**
 * Deviations we chose on purpose. Key = `path field`, value = why.
 * Anything not listed here fails the check.
 */
const ALLOWED_DIFFERENCES = {
  // The old renderer emitted a <h1> per "# ..." line (4 on one article) and
  // printed code fences as body text; the template fixes both. Titles,
  // descriptions and canonicals stay identical.
  "h1": "the article template keeps exactly one h1; the body's # headings are demoted to h2",
  "fences": "code fences render as <pre><code> instead of literal ``` text",
};

/**
 * Path+field exceptions, for the one case the field rules above cannot express:
 * the build is right and the live page is stale, because a data fix ships in
 * this build and the live site cannot have it yet. A price change is exactly
 * this — `npm run sync-models` exists to produce them.
 *
 * Each entry pins the *expected built value*, not just the field name. That is
 * the safeguard: the exception covers the value we reviewed, and any later
 * change to that page produces a different value, misses the pin, and fails the
 * run. So it cannot act as a permanent silencer — and once the deploy lands the
 * entry is a no-op, because a table read only on difference is never read when
 * live === built.
 */
const PINNED_DIFFERENCES = {
  "openrouter-models/deepseek-v4-pro description": {
    expect:
      "DeepSeek V4 Pro costs $0.579 input and $1.74 output per 1M tokens, with 1.05M tokens context. See strengths, limitations and best-fit workloads.",
    reason:
      "provider repriced the model on 2026-09-18 ($0.66/$1.98 → $0.57948/$1.73844 per 1M); this build carries the corrected snapshot and live catches up on deploy",
  },
};

const decode = (value) =>
  value
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

const pick = (html, regex) => {
  const match = regex.exec(html);
  return match ? decode(match[1].trim()) : null;
};

function facts(html) {
  const ldTypes = [...html.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]);
  return {
    title: pick(html, /<title>([\s\S]*?)<\/title>/),
    description: pick(html, /<meta name="description" content="([^"]*)"/),
    canonical: pick(html, /<link rel="canonical" href="([^"]*)"/),
    h1: (html.match(/<h1[\s>]/g) ?? []).length,
    fences: (html.match(/```/g) ?? []).length,
    ldTypes: [...new Set(ldTypes)].sort(),
  };
}

async function production(path) {
  mkdirSync(CACHE, { recursive: true });
  const file = join(CACHE, `${path.replace(/\//g, "_") || "root"}.html`);
  const fresh = existsSync(file) && Date.now() - statSync(file).mtimeMs < 6 * 60 * 60 * 1000;
  if (offline || (fresh && !process.argv.includes("--refresh"))) {
    if (!existsSync(file)) throw new Error(`no cached copy for ${path}; run without --offline once`);
    return readFileSync(file, "utf8");
  }
  // One retry: 38 sequential fetches against the live site occasionally hit a
  // dropped socket, and a flaky check is a check people learn to ignore.
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(`${ORIGIN}${path}`, {
        headers: { "User-Agent": "hunteralphahub-parity-check" },
      });
      if (!response.ok) throw new Error(`${path} returned ${response.status}`);
      const html = await response.text();
      writeFileSync(file, html);
      return html;
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  throw new Error(`unreachable: ${path}`);
}

const localFile = (path) => {
  const base = path.replace(/^\//, "");
  const flat = join(DIST, `${base}.html`);
  return existsSync(flat) ? flat : join(DIST, base, "index.html");
};

let failures = 0;
let checkedDeviations = 0;

for (const path of PATHS) {
  const file = localFile(path);
  if (!existsSync(file)) {
    console.error(`✗ ${path} — not built (${file} missing)`);
    failures += 1;
    continue;
  }
  const live = facts(await production(path));
  const built = facts(readFileSync(file, "utf8"));
  console.log(`\n== ${path}`);
  for (const field of ["title", "description", "canonical"]) {
    const same = live[field] === built[field];
    if (same) {
      console.log(`  ok   ${field}`);
      continue;
    }

    const pinned = PINNED_DIFFERENCES[`${path.replace(/^\//, "")} ${field}`];
    if (pinned && pinned.expect === built[field]) {
      console.log(`  note ${field} — build is ahead of live: ${pinned.reason}`);
      checkedDeviations += 1;
      continue;
    }

    console.log(`  DIFF ${field}`);
    console.log(`        live : ${live[field]}`);
    console.log(`        built: ${built[field]}`);
    if (pinned) {
      console.log(`        a pin exists for this page+field but the built value does not match it —`);
      console.log(`        either the change is deliberate (update the pin) or it is a regression`);
    }
    failures += 1;
  }
  // Structured data may be added during the migration, never dropped.
  const missing = live.ldTypes.filter((type) => !built.ldTypes.includes(type));
  const added = built.ldTypes.filter((type) => !live.ldTypes.includes(type));
  console.log(`  ${missing.length ? "FAIL" : "ok  "} json-ld  [${built.ldTypes.join(", ")}]`);
  if (missing.length) {
    console.log(`        dropped: ${missing.join(", ")} — the migration must not lose structured data`);
    failures += 1;
  }
  if (added.length) {
    console.log(`        added: ${added.filter((t) => t !== "ListItem" && t !== "Organization").join(", ") || "—"}`);
  }
  if (built.h1 !== 1) {
    console.log(`  FAIL h1 count = ${built.h1} (must be exactly 1)`);
    failures += 1;
  } else if (live.h1 !== 1) {
    console.log(`  note h1 ${live.h1} → 1 — ${ALLOWED_DIFFERENCES.h1}`);
    checkedDeviations += 1;
  } else {
    console.log("  ok   h1 count = 1");
  }
  if (built.fences > 0) {
    console.log(`  FAIL literal code fences still in output (${built.fences})`);
    failures += 1;
  } else if (live.fences > 0) {
    console.log(`  note fences ${live.fences} → 0 — ${ALLOWED_DIFFERENCES.fences}`);
    checkedDeviations += 1;
  }
}

console.log(
  `\n${failures === 0 ? "Parity OK" : `${failures} parity failure(s)`} across ${PATHS.length} pages` +
    (checkedDeviations ? `; ${checkedDeviations} page/field deviations were expected and documented.` : "."),
);

const origin = process.env.PREVIEW_ORIGIN;
if (origin) {
  console.log(`\n== deployed preview: ${origin}`);
  for (const path of PATHS) {
    const response = await fetch(`${origin}${path}`, { redirect: "manual" });
    const ok = response.status === 200;
    console.log(`  ${ok ? "ok  " : "FAIL"} ${response.status} ${path}`);
    if (!ok) failures += 1;
  }
}

process.exit(failures === 0 ? 0 : 1);
