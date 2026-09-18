#!/usr/bin/env node
/**
 * Crawler-facing files that nothing else checks.
 *
 * A page can be perfect and the site still lose discovery: robots.txt carries the
 * Sitemap: line, `_headers` carries the security policy and the canonical host's
 * index/follow, `_redirects` carries the retired routes. None of them are HTML,
 * so `verify:pages`, `check:analytics` and `check-page-parity` all walk past them
 * — and the Astro build started out with **none of the three** (no robots.txt, no
 * `_redirects`, no security headers), which would have shipped a 404 robots.txt,
 * six 404s where the live site 301s, and no CSP.
 *
 * The noindex assertion is the important one: `scripts/mark-preview.mjs` stamps
 * the preview build so it cannot be indexed, and the day that stamp runs during a
 * production deploy the whole domain silently drops out of search. This check
 * runs on a plain `npm run build`, where a noindex line means exactly that.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(here, "../dist");
const failures = [];

const read = (name) => {
  const path = join(DIST, name);
  if (!existsSync(path)) {
    failures.push(`${name} is missing from dist/`);
    return null;
  }
  return readFileSync(path, "utf8");
};

const robots = read("robots.txt");
if (robots !== null) {
  if (!/^Sitemap:\s+https:\/\/www\.hunteralphahub\.com\/sitemap\.xml$/m.test(robots)) {
    failures.push("robots.txt has no Sitemap: line for the canonical host");
  }
  if (!/^Allow:\s+\/$/m.test(robots)) failures.push("robots.txt does not allow crawling");
}

const headers = read("_headers");
if (headers !== null) {
  if (!/^\s*Content-Security-Policy:/m.test(headers)) failures.push("_headers has no Content-Security-Policy");
  const robotsHeader = headers.match(/^\s*X-Robots-Tag:\s*(.+)$/m)?.[1] ?? "";
  if (!robotsHeader) failures.push("_headers has no X-Robots-Tag line");
  else if (/noindex/i.test(robotsHeader)) {
    failures.push(
      `_headers ships "${robotsHeader}" — a plain build must stay indexable; only scripts/mark-preview.mjs may stamp noindex, and only for the preview Worker`,
    );
  }
}

const redirects = read("_redirects");
if (redirects !== null) {
  // The six retired routes (next.config.ts → redirects()).
  for (const route of ["/leaderboard", "/monitor", "/evidence", "/timeline", "/videos", "/profile/:nickname"]) {
    if (!redirects.includes(`${route} `)) failures.push(`_redirects does not send ${route} anywhere`);
  }
  if (/\b302\b/.test(redirects)) failures.push("_redirects uses 302 for a retired route; retired routes are permanent");
}

if (!existsSync(join(DIST, "ads.txt"))) failures.push("ads.txt is missing from dist/");
const indexNowKey = readdirSync(DIST).find((name) => /^[a-f0-9]{16,128}\.txt$/.test(name));
if (!indexNowKey) failures.push("no IndexNow key file in dist/ (the submit workflow verifies it on the live site)");

/**
 * The cutover config must stay asset-first, and the apex must have its own Worker.
 *
 * Measured 2026-09-18: adding `assets.run_worker_first: true` to get the apex
 * redirect into the Astro Worker silently stopped the asset layer applying
 * `_redirects` — `/faq/` returned 200 instead of 308, `/evidence` 200 instead of
 * 301, i.e. all 92 generated rules gone. It is an easy line to add for a
 * plausible reason, and nothing else in this repo would notice, so it is a check.
 */
const productionConfig = read("../wrangler.production.jsonc");
if (productionConfig !== null) {
  if (/^\s*"run_worker_first"\s*:\s*true/m.test(productionConfig)) {
    failures.push(
      "wrangler.production.jsonc enables run_worker_first — that drops every _redirects rule (see docs/lessons); the apex redirect belongs in wrangler.apex.jsonc",
    );
  }
  if (!/"main"\s*:\s*"dist\/_worker\.js\/index\.js"/.test(productionConfig)) {
    failures.push("wrangler.production.jsonc no longer points main at the generated Astro entry");
  }
}
const apexConfig = read("../wrangler.apex.jsonc");
if (apexConfig === null) {
  failures.push("wrangler.apex.jsonc is missing — nothing would answer hunteralphahub.com with the 308");
} else if (!/"pattern"\s*:\s*"hunteralphahub\.com"/.test(apexConfig)) {
  failures.push("wrangler.apex.jsonc does not bind the apex host");
}

/**
 * Each hostname belongs to exactly one Worker, and the retired one holds none.
 *
 * Two failure modes got here, both invisible until the moment they matter:
 *
 *   - 2026-09-18 morning: `wrangler.production.jsonc` declared **both** the apex
 *     and www even after the apex got its own Worker, so whichever of the two
 *     deployed last would take the apex and the other would start failing;
 *   - the Next Worker is still built on every push to main. As long as its config
 *     declares a custom domain, a routine push would silently move the live site
 *     back to Next — the cutover would undo itself, on a commit that says nothing
 *     about it.
 *
 * So: www → the Astro production Worker, apex → the apex Worker, and the Next
 * Worker declares none (it stays deployed and unreachable, which is the rollback).
 */
const routeHosts = (source) =>
  [...source.matchAll(/"pattern"\s*:\s*"([^"]+)"[^}]*?"custom_domain"\s*:\s*true/g)].map((m) => m[1]);

const nextConfig = read("../../wrangler.jsonc");
const declaredHosts = {
  "Next (root wrangler.jsonc)": routeHosts(nextConfig ?? ""),
  "Astro production (wrangler.production.jsonc)": routeHosts(productionConfig ?? ""),
  "apex (wrangler.apex.jsonc)": routeHosts(apexConfig ?? ""),
};

if (nextConfig === null) {
  failures.push("the Next Worker's wrangler.jsonc is missing — rollback would have no config to redeploy");
} else if (declaredHosts["Next (root wrangler.jsonc)"].length > 0) {
  failures.push(
    `the Next Worker still declares custom domain(s) ${declaredHosts["Next (root wrangler.jsonc)"].join(", ")} — the next push to main would take them back from the Astro Worker`,
  );
}

const owners = new Map();
for (const [where, hosts] of Object.entries(declaredHosts)) {
  for (const host of hosts) owners.set(host, [...(owners.get(host) ?? []), where]);
}
for (const [host, claimants] of owners) {
  if (claimants.length !== 1) {
    failures.push(
      `${host} is declared by ${claimants.length} configs (${claimants.join(", ")}) — two Workers fighting over one hostname`,
    );
  }
}
for (const [where, host] of [
  ["Astro production (wrangler.production.jsonc)", "www.hunteralphahub.com"],
  ["apex (wrangler.apex.jsonc)", "hunteralphahub.com"],
]) {
  if (!declaredHosts[where].includes(host)) {
    failures.push(`${where} does not declare ${host} — that host would have no Worker`);
  }
}

/**
 * `<lastmod>` has to be believable or it is worse than absent: Google ignores a
 * value it cannot trust, so a sitemap that says "every URL changed just now"
 * silently loses the one hint that says which pages are new. That is exactly what
 * both apps did until 2026-09-18 (`const lastModified = new Date()`).
 *
 * The invariant is deliberately mechanical: a sitemap with this many pages must
 * carry more than a couple of distinct dates, no date may be in the future, and
 * no url may appear twice. The regression this is aimed at — "stamp now for
 * everything" — collapses the date set to one value and fails immediately.
 */
const sitemap = read("sitemap.xml");
if (sitemap !== null) {
  const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]);
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const distinct = new Set(lastmods);
  if (locs.length > 20 && distinct.size < 3) {
    failures.push(
      `sitemap.xml has ${distinct.size} distinct <lastmod> value(s) across ${locs.length} URLs — dates are being generated, not recorded`,
    );
  }
  const future = lastmods.filter((value) => {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) || parsed > Date.now() + 24 * 60 * 60 * 1000;
  });
  if (future.length) {
    failures.push(`sitemap.xml has ${future.length} unparseable or future <lastmod> value(s), e.g. ${future[0]}`);
  }
  if (new Set(locs).size !== locs.length) failures.push("sitemap.xml lists the same URL more than once");
  console.log(`sitemap: ${locs.length} URLs, ${distinct.size} distinct lastmod dates, ${locs.length - lastmods.length} undated`);
}

/**
 * Every page points its og:image/twitter:image at its own generated card
 * (scripts/generate-og-images.mjs). A card URL that resolves to nothing is worse
 * than no card at all: the social crawler shows a blank preview *and* caches it.
 * So: every declared image on our own host must be a real PNG in dist.
 */
let cardsChecked = 0;
for (const file of readdirSync(DIST, { recursive: true }).filter((name) => String(name).endsWith(".html"))) {
  const html = readFileSync(join(DIST, String(file)), "utf8");
  const declared = new Set(
    [...html.matchAll(/<meta\s+property="og:image"\s+content="([^"]+)"/g)].map((match) => match[1]),
  );
  for (const url of declared) {
    if (!url.includes("hunteralphahub.com")) continue;
    const localPath = join(DIST, new URL(url).pathname.replace(/^\//, ""));
    cardsChecked++;
    if (!existsSync(localPath)) {
      failures.push(`${file} declares og:image ${url} but there is no file at ${localPath.replace(DIST, "dist")}`);
      continue;
    }
    const size = statSync(localPath).size;
    const header = readFileSync(localPath).subarray(0, 8);
    const isPng = header.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    if (!isPng) failures.push(`${file} og:image ${url} is not a PNG`);
    else if (size < 3_000) failures.push(`${file} og:image ${url} is only ${size} bytes — a broken render`);
  }
}

/**
 * Structured data. `verify:pages` compares which schema *types* a page declares
 * against the live page, but nothing checks that the JSON is valid — and a block
 * that fails to parse loses the rich result silently, with the page still looking
 * perfect to a human. 203 blocks across 86 pages, all of them ours to keep valid.
 */
let jsonLdBlocks = 0;
for (const file of readdirSync(DIST, { recursive: true }).filter((name) => String(name).endsWith(".html"))) {
  const html = readFileSync(join(DIST, String(file)), "utf8");
  for (const match of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    jsonLdBlocks++;
    let parsed;
    try {
      parsed = JSON.parse(match[1]);
    } catch (error) {
      failures.push(`${file} has an unparseable JSON-LD block: ${String(error).slice(0, 80)}`);
      continue;
    }
    for (const item of Array.isArray(parsed) ? parsed : [parsed]) {
      if (!item?.["@context"] || !item?.["@type"]) {
        failures.push(`${file} has a JSON-LD block without @context/@type`);
      }
    }
  }
}

console.log(
  `site files: robots.txt ${robots ? "ok" : "missing"} · _headers ${headers ? "ok" : "missing"} · _redirects ${
    redirects ? "ok" : "missing"
  } · indexnow key ${indexNowKey ?? "missing"} · og cards ${cardsChecked} declared · JSON-LD ${jsonLdBlocks} blocks valid`,
);
if (failures.length) {
  console.error("\nFAIL:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("OK: crawler-facing files are in the build, and the build is indexable");
