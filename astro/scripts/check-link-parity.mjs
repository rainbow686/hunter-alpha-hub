#!/usr/bin/env node
/**
 * Link parity — does the Astro build link to everything the live site links to?
 *
 * Why this exists: the two guards we already had both have a blind spot for links.
 *   - `verify:pages` compares content fields (title / description / canonical / JSON-LD / h1).
 *   - `audit-links` only asks that every sitemap page has **at least one** inbound link.
 * So a migration can quietly drop 81 links to a page and both stay green.
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
 * Usage: `npm run check:links` (compares dist/ against production).
 *        `npm run check:links -- --origin https://preview.example.workers.dev`
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
 * Allowlist: `/api/*`. Endpoints appear in prose and in fetch calls, not in navigation,
 * and an endpoint is not a page — losing a link to one is not a lost link.
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
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(`${LIVE}${path === "/" ? "" : path}`, {
        headers: { "user-agent": "hunteralphahub-link-parity" },
      });
      if (response.ok) return await response.text();
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  return null;
};

/** Links present in every response for this page — see the header. */
const liveLinkSets = async (path) => {
  const [first, second] = await Promise.all([fetchLive(path), fetchLive(path)]);
  if (!first || !second) return null;
  const a = internalLinks(first, LIVE);
  const b = internalLinks(second, LIVE);
  const stable = new Set([...a].filter((href) => b.has(href)));
  return { stable, varied: a.size !== b.size || [...a].some((href) => !b.has(href)) };
};

const failures = [];
let compared = 0;
const variedPages = [];

for (const path of paths) {
  const file = fileFor(path);
  if (!existsSync(file)) {
    failures.push(`${path}: no built page at ${file.replace(DIST, "dist")}`);
    continue;
  }
  const live = await liveLinkSets(path);
  if (!live) {
    failures.push(`${path}: could not fetch the live page from ${LIVE}`);
    continue;
  }
  compared++;
  if (live.varied) variedPages.push(path);
  const built = internalLinks(readFileSync(file, "utf8"), LIVE);
  const missing = [...live.stable].filter((href) => !built.has(href));
  if (missing.length) failures.push(`${path}: ${missing.length} link(s) missing → ${missing.join(", ")}`);
}

console.log(`link parity: compared ${compared}/${paths.length} pages against ${LIVE}`);
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
console.log("OK: every internal link the live site has, the build has too");
