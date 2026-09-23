#!/usr/bin/env node
/**
 * Page parity — does the build keep the things a page needs besides its words?
 *
 * Two checks, both aimed at the same blind spot. `verify:pages` compares content
 * fields (title / description / canonical / JSON-LD / h1) and `audit-links` only
 * asks that every sitemap page has **at least one** inbound link, so:
 *
 *   1. LINKS — a migration can quietly drop 81 links to a page and both stay green.
 *   2. HEAD TAGS — robots, og:*, twitter:*, icons are nobody's field. They are not
 *      in any checklist, they do not break a page when missing, and they are
 *      exactly what a rewrite forgets. (Same class as the GA4 tag, which the
 *      Astro build had dropped entirely — see check-analytics.mjs.)
 *
 * Rule for both: **anything the live page has, the build must have.** Additions
 * are allowed (a redesign may improve on the live page); losses are not.
 *
 * That is exactly what happened (found 2026-09-18, on the preview vs production diff):
 *   1. the footer stopped linking `/access` on 81 pages — `/access` is the only inner
 *      page with organic clicks (it eats the `openrouter playground` family), and its
 *      inbound-link count would have collapsed at cutover;
 *   2. `/union-alpha` stopped linking its three sibling pages (/union-alpha-free,
 *      -opencode, -not-working) — the cluster the content is written around;
 *   3. blog "Related Articles" picked a different three posts, because Astro's
 *      collection order is alphabetical while the Next app used the curated array order.
 *
 * Usage: `npm run check:parity` (compares dist/ against production).
 *        `npm run check:parity -- --origin https://preview.example.workers.dev`
 *
 * Each live page is fetched twice and the comparison uses the **intersection** of
 * the two responses. Reason, learned the hard way on 2026-09-18: a live page can
 * vary between requests (that day: `getAllPosts()` sorted a shared array in place,
 * so "Related Articles" flipped ~50/50 per request depending on the isolate's
 * history). Comparing against one arbitrary sample made this script flaky — and a
 * flaky guard is worse than no guard, because it teaches people to re-run it.
 * Stable links are the ones every response agrees on; those are the ones that must
 * not be dropped. Pages that disagreed are reported instead of silently ignored.
 *
 * Allowlists: `/api/*` links (an endpoint is not a page), and `<html lang>` (the
 * live Chinese pages declare lang="en", which is wrong; the rebuild fixes it).
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(here, "../dist");

const args = process.argv.slice(2);
const originIndex = args.indexOf("--origin");
const LIVE = (originIndex >= 0 ? args[originIndex + 1] : "https://www.hunteralphahub.com").replace(/\/$/, "");

const sitemapPath = join(DIST, "sitemap.xml");
if (!existsSync(sitemapPath)) {
  console.error("FAIL: dist/sitemap.xml is missing — run `astro build` first");
  process.exit(1);
}
const paths = [...readFileSync(sitemapPath, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname.replace(/\/$/, "") || "/")
  .filter((path) => !path.startsWith("/api/"));

const fileFor = (path) => join(DIST, path === "/" ? "index.html" : `${path}.html`);

/*
 * URL migrations: a live link the build deliberately points somewhere else.
 *
 * The rule this script enforces is "anything the live page has, the build must have" — and it
 * earned that rule (it caught 81 pages dropping `/access` at cutover). But a page that *moved*
 * is not a page that was dropped: the link still works, one hop away. Without this, moving
 * `/jev-guide` to `/typesafe-jev/guide` fails the guard on every page that carries the footer,
 * and the honest way out would be a hand-written exception in the PR — which is a habit that
 * rots, because the next migration needs another one and nobody remembers the first.
 *
 * So the redirect table is the single source of truth: `public/_redirects` already declares
 * every URL that moved and where it went (that file is load-bearing for the crawler anyway).
 * Read it here and treat "live link → 301 → a page the build links" as migrated rather than
 * missing. A link that vanished with no redirect behind it still fails, which is the behaviour
 * that matters.
 */
const MIGRATIONS = new Map();
{
  const rules = readFileSync(join(here, "../public/_redirects"), "utf8");
  for (const line of rules.split("\n")) {
    const rule = line.trim();
    if (!rule || rule.startsWith("#")) continue;
    const [from, to, code] = rule.split(/\s+/);
    if (from && to && /^30[18]$/.test(code ?? "")) MIGRATIONS.set(from.replace(/\/$/, "") || "/", to.replace(/\/$/, "") || "/");
  }
}

/** Internal navigation links only: same site, no build assets, no file downloads. */
function internalLinks(html, base) {
  const found = new Set();
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    let url;
    try {
      url = new URL(match[1], base);
    } catch {
      continue;
    }
    if (!url.host.endsWith("hunteralphahub.com")) continue;
    if (url.pathname.startsWith("/api/")) continue;
    if (/^\/(_next|_astro)\//.test(url.pathname)) continue;
    if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) continue;
    found.add(url.pathname.replace(/\/$/, "") || "/");
  }
  return found;
}

const fetchLive = async (path) => {
  // Returns { status, html }. `status: 404` is meaningful — it means the build has
  // a page the live site does not, i.e. a new page — and must not be reported as a
  // dropped link. Transient failures return `status: 0` and are retried first.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(`${LIVE}${path === "/" ? "" : path}`, {
        headers: { "user-agent": "hunteralphahub-link-parity" },
      });
      if (response.ok) return { status: response.status, html: await response.text() };
      if (response.status === 404 || response.status === 410) return { status: response.status, html: "" };
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  return { status: 0, html: "" };
};

/**
 * Head features that `verify:pages` does not look at: robots, og:*, twitter:*
 * and the icon links. Compared by name → content, so a renamed or reworded tag
 * counts, and an added tag does not.
 */
function headFeatures(html) {
  const features = new Map();
  for (const match of html.matchAll(/<meta\s+[^>]*>/g)) {
    const tag = match[0];
    const name = tag.match(/(?:property|name)="((?:og:|twitter:)[^"]*|robots)"/)?.[1];
    if (!name) continue;
    const content = tag.match(/content="([^"]*)"/)?.[1] ?? "";
    features.set(name, content);
  }
  const icons = [...html.matchAll(/<link\s+[^>]*rel="(?:icon|apple-touch-icon)"[^>]*>/g)].map(
    (match) => match[0].match(/href="([^"]*)"/)?.[1] ?? "",
  );
  if (icons.length) features.set("icons", icons.sort().join(" "));
  /**
   * `<link rel="alternate" hreflang>` — the tags that tell Google which of a
   * bilingual pair to serve. They were invisible to this guard for a whole round
   * because it only parsed `<meta>` tags: the live site declared the /access and
   * /faq pairs and the Astro build declared none, and nothing failed. Attribute
   * names are matched case-insensitively because Next emits `hrefLang`.
   */
  for (const match of html.matchAll(/<link\s+[^>]*rel="alternate"[^>]*>/gi)) {
    const lang = match[0].match(/hreflang="([^"]*)"/i)?.[1];
    const href = match[0].match(/href="([^"]*)"/i)?.[1];
    if (lang && href) features.set(`hreflang:${lang.toLowerCase()}`, href.replace(/\/$/, ""));
  }
  return features;
}

/**
 * Presence-only tags. Their values are either editorial (the live site's og:title
 * often differs from its own <title>) or generated per page by Next
 * (`/<page>/opengraph-image` — a real feature the Astro build does not reproduce;
 * it ships one static card, documented in docs/OPERATIONS.md). Losing the *tag*
 * is the regression this guard is about; a different value is a design choice.
 */
const PRESENCE_ONLY = new Set([
  /*
   * `icons` is presence-only, and that is a correction made the day the guard
   * blocked a legitimate change. The live site declared the *retired* mark
   * (`/favicon.svg` twice — navy, violet, teal, magnifying glass) while the build
   * declares the frozen system's mark plus a bitmapped `/favicon.ico` for clients
   * that request it blind and a PNG `apple-touch-icon` for iOS. Comparing values
   * would have forced the build to keep serving the old icon to pass its own
   * guard — the exact way the old mark survived a whole redesign. What this guard
   * is for is losing the *tags*; a different file name is a design decision.
   * (`check:files` is where the icons are checked properly: the three files exist,
   * the markup points each client at the right one, and the palette is the frozen
   * one.)
   */
  "icons",
  "og:title",
  "og:description",
  "og:image",
  "og:image:alt",
  "og:image:type",
  "twitter:title",
  "twitter:description",
  "twitter:image",
  "twitter:image:alt",
  "twitter:image:type",
]);

/**
 * Live values that are simply wrong. `/hunter-alpha` points og:url at the site
 * root, so a page about Hunter Alpha advertises the homepage as its URL. The
 * build must use its own canonical instead; copying the bug to keep the guard
 * green would be the worst possible use of a guard.
 */
const LIVE_MISTAKES = new Set(["/hunter-alpha og:url"]);

/** Links present in every response for this page — see the header. */
const liveLinkSets = async (path) => {
  const [first, second] = await Promise.all([fetchLive(path), fetchLive(path)]);
  if (first.status === 404 || second.status === 404 || first.status === 410 || second.status === 410) {
    return { stable: new Set(), varied: false, notLiveYet: true, html: "" };
  }
  if (!first.html || !second.html) return null;
  const a = internalLinks(first.html, LIVE);
  const b = internalLinks(second.html, LIVE);
  const stable = new Set([...a].filter((href) => b.has(href)));
  return { stable, varied: a.size !== b.size || [...a].some((href) => !b.has(href)), notLiveYet: false, html: first.html };
};

const failures = [];
let compared = 0;
const variedPages = [];
const retriedClean = [];
const newPages = [];
/** Live links whose target moved, per the redirect table — reported, not failed. */
const migrated = [];

/** Re-check a single page; returns the failures (empty array = fine). */
async function checkPage(path) {
  const issues = [];
  const file = fileFor(path);
  if (!existsSync(file)) {
    return [`${path}: no built page at ${file.replace(DIST, "dist")}`];
  }
  const live = await liveLinkSets(path);
  if (!live) {
    return [`${path}: could not fetch the live page from ${LIVE}`];
  }
  // A page that is in the build but not on the live site is a *new page*, not a
  // regression. Comparing it against production is meaningless until it ships.
  if (live.notLiveYet) {
    newPages.push(path);
    return [];
  }
  compared++;
  if (live.varied) variedPages.push(path);
  const built = internalLinks(readFileSync(file, "utf8"), LIVE);
  const dropped = [...live.stable].filter((href) => !built.has(href));
  /*
   * A dropped link is fine when the redirect table says the URL moved *and* the page now links
   * its new home: the reader takes the same number of steps, the crawler gets a 301 instead of a
   * 404, and the guard's real question ("did we lose a link?") is answered no.
   */
  const missing = dropped.filter((href) => {
    const to = MIGRATIONS.get(href.replace(/\/$/, "") || "/");
    if (!to) return true;
    migrated.push(`${href} → ${to}`);
    return !built.has(to);
  });
  if (missing.length) issues.push(`${path}: ${missing.length} link(s) missing → ${missing.join(", ")}`);

  const liveHead = headFeatures(live.html);
  const builtHtml = readFileSync(file, "utf8");
  const builtHead = headFeatures(builtHtml);
  const missingHead = [];
  for (const [name, content] of liveHead) {
    const builtValue = builtHead.get(name);
    if (builtValue === undefined) {
      missingHead.push(`${name} absent (live="${content.slice(0, 50)}")`);
      continue;
    }
    if (PRESENCE_ONLY.has(name)) continue;
    // Known-wrong live values: check the intent, never copy the mistake.
    if (name === "og:url" && LIVE_MISTAKES.has(`${path} og:url`)) {
      const canonical = builtHtml.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
      if (!canonical || builtValue !== canonical) {
        missingHead.push(`og:url must equal this page's canonical (build="${builtValue}")`);
      }
      continue;
    }
    if (builtValue !== content) {
      missingHead.push(`${name} (live="${content.slice(0, 50)}" build="${builtValue.slice(0, 50)}")`);
    }
  }
  if (missingHead.length) {
    issues.push(`${path}: head tag(s) missing or different → ${missingHead.join(", ")}`);
  }
  return issues;
}

const firstPass = new Map();
for (const path of paths) firstPass.set(path, await checkPage(path));

for (const [path, issues] of firstPass) {
  if (issues.length === 0) continue;
  // The live site is redeployed on every merge, and a Cloudflare deployment can
  // serve a mix of old and new for a short window (seen twice on this site). One
  // retry separates "the edge was mid-rollout" from "the build drops something"
  // without turning the guard into a coin flip: a real regression fails both.
  await new Promise((resolve) => setTimeout(resolve, 600));
  const retry = await checkPage(path);
  if (retry.length === 0) {
    retriedClean.push(path);
    continue;
  }
  failures.push(...retry);
}

console.log(`link parity: compared ${compared}/${paths.length} pages against ${LIVE}`);
if (newPages.length) {
  console.log(
    `link parity: ${newPages.length} page(s) are not on the live site yet — counted as new, not compared (${newPages.join(", ")})`,
  );
}
if (retriedClean.length) {
  console.log(
    `link parity: ${retriedClean.length} page(s) failed the first pass and passed on retry — the live edge was mid-rollout (${retriedClean.slice(0, 5).join(", ")})`,
  );
}
if (migrated.length) {
  const unique = [...new Set(migrated)];
  console.log(
    `link parity: ${unique.length} live link(s) now point at a moved URL, per public/_redirects — counted as migrated, not dropped (${unique.join("; ")})`,
  );
}
if (variedPages.length) {
  console.log(
    `link parity: ${variedPages.length} page(s) returned different links on two fetches — compared the stable subset (investigate; a live page should not change per request):`,
  );
  for (const path of variedPages.slice(0, 10)) console.log(`  ~ ${path}`);
}
if (failures.length) {
  console.error(`\nFAIL: the build drops links the live site has (${failures.length} page(s)):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error("\nEither restore the link, or explain in the PR why the live link was wrong.");
  process.exit(1);
}
console.log("OK: every internal link and head tag the live site has, the build has too");
