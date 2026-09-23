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
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(here, "../dist");
const failures = [];
// sharp is already a devDependency (scripts/gen-illustration.mjs writes the webp files this reads).
const sharp = createRequire(import.meta.url)("sharp");

/*
 * Every built page has to be declared in `sitemap.xml` — the "200 but not declared" check, applied
 * to our own output rather than to the live site.
 *
 * Why it exists: on 2026-09-23 the build produced **174 pages and the sitemap declared 129**. The
 * 45 missing were exactly the 42 X-post records and the 3 explainer-cluster pages — live, reachable
 * by link, and invisible to a crawler that trusts the declaration. `verify:pages` could not catch
 * it: that guard compares our build against the **live** site's sitemap and correctly files
 * anything new as "not compared yet", which is the right behaviour for a pre-merge branch and the
 * wrong question for a finished one.
 *
 * The allow-list is short on purpose. Everything that is not a page — the 404, API routes, the JSON
 * twins — is named here, so adding a page that nobody linked or declared is a build failure rather
 * than a discovery problem six weeks later.
 */
const NOT_IN_SITEMAP = new Set([
  "404.html", // correct: a 404 must not be advertised
  "typesafe-jev/statistics.json", // data twin of a declared page, and not an .html file anyway
]);

function builtPages(dir = DIST, prefix = "") {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (["_astro", "pagefind", "og", "img", "api"].includes(name)) continue;
      out.push(...builtPages(full, `${prefix}${name}/`));
    } else if (name.endsWith(".html")) {
      out.push(`${prefix}${name}`);
    }
  }
  return out;
}

function declaredRoutes() {
  const xml = readFileSync(join(DIST, "sitemap.xml"), "utf8");
  const routes = new Set();
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = new URL(match[1]).pathname.replace(/\/$/, "") || "/";
    routes.add(path);
  }
  return routes;
}

/** `/a/b.html` on disk is the route `/a/b`; `/index.html` is `/`. */
const routeOf = (file) => {
  const noExt = file.replace(/\.html$/, "");
  return (noExt.endsWith("index") ? noExt.slice(0, -"index".length) : `/${noExt}`).replace(/\/$/, "") || "/";
};

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
 * The icons: three files, three clients, and a mark that has to stay current.
 *
 * Until 2026-09-18 the site shipped only `favicon.svg` — and that SVG was still the
 * retired navy/violet/teal magnifying glass from the pre-Astro design, while the
 * page pointed `apple-touch-icon` at it (iOS does not read SVG there) and
 * `/favicon.ico` simply 404'd. Nothing noticed, because a favicon is not a page,
 * not a crawler file and not part of parity. It was the last asset wearing the old
 * visual language, and the user is the one who saw it in a browser tab.
 *
 * So: all three files must exist, the markup must point at the right one for the
 * right client, and the mark must not drift back to the retired palette — that
 * last check is what makes this more than a file-exists test.
 */
const iconPage = readdirSync(DIST).find((name) => name.endsWith(".html"));
const iconHtml = iconPage ? readFileSync(join(DIST, iconPage), "utf8") : "";
for (const [what, pattern] of [
  ["the SVG icon link", /rel="icon"[^>]*href="\/favicon\.svg(\?v=\d+)?"[^>]*type="image\/svg\+xml"/],
  ["a bitmapped /favicon.ico link", /rel="icon"[^>]*href="\/favicon\.ico"/],
  ["a PNG apple-touch-icon link", /rel="apple-touch-icon"[^>]*href="\/apple-touch-icon\.png"/],
]) {
  if (!pattern.test(iconHtml)) failures.push(`no ${what} in the built HTML`);
}
for (const icon of ["favicon.svg", "favicon.ico", "apple-touch-icon.png"]) {
  const path = join(DIST, icon);
  if (!existsSync(path)) {
    failures.push(`${icon} is missing from dist/ — one of the three clients would get nothing`);
    continue;
  }
  if (statSync(path).size < 300) failures.push(`${icon} is suspiciously small (${statSync(path).size} bytes)`);
}
const faviconSvg = existsSync(join(DIST, "favicon.svg")) ? readFileSync(join(DIST, "favicon.svg"), "utf8") : "";
for (const [colour, name] of [
  ["#8b5cf6", "violet"],
  ["#14b8a6", "teal"],
  ["#1a1a2e", "navy"],
]) {
  if (faviconSvg.toLowerCase().includes(colour)) {
    failures.push(`favicon.svg uses the retired ${name} ${colour} — the mark is back in the pre-Astro palette`);
  }
}
if (!/#14507d/.test(faviconSvg)) failures.push("favicon.svg does not use the frozen ink-blue accent (#14507d)");

/**
 * What the site loads for money, checked in both directions.
 *
 * 2026-09-18: the live site ran an Adsterra social bar on every page (the only ad
 * code actually present) while its privacy policy described popunders it never
 * served, and its AdSense script was absent because no publisher id was set at
 * build time — on a site that was between AdSense reviews. Three separate
 * mismatches between what the site says, what it does and what it declares:
 *
 *   - no third-party ad-network script may appear in the build (the social bar is
 *     removed, and an accidental reintroduction should fail here rather than ship);
 *   - ads.txt must not authorise a seller whose code is absent;
 *   - the privacy policy must not describe an ad network the site does not use.
 *
 * The AdSense tag itself is build-gated (`PUBLIC_ADSENSE_ID`, production only), so
 * it is checked for presence in the *production* build path below rather than in
 * every build.
 */
for (const file of readdirSync(DIST).filter((name) => name.endsWith(".html"))) {
  const html = readFileSync(join(DIST, file), "utf8");
  if (/developdomicile\.com|adsterra/i.test(html)) {
    failures.push(`${file} still references an ad network that is no longer loaded (developdomicile/adsterra)`);
  }
}
/*
 * ads.txt comments are stripped before matching. The first version of this check
 * failed on the *comment* that documents the removal ("adsterra.com, 29047445 …
 * was removed on 2026-09-18") — the third time in this repo that a regex matched
 * the prose about the code instead of the code. See
 * docs/lessons/guard-matched-the-comment-not-the-code.md.
 */
const adsTxt = (read("ads.txt") ?? "")
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("#"))
  .join("\n");
if (/adsterra\.com/i.test(adsTxt)) {
  failures.push("ads.txt still authorises adsterra.com, but no Adsterra code is loaded");
}
if (!/^google\.com, pub-\d+, DIRECT/m.test(adsTxt)) {
  failures.push("ads.txt lost the AdSense line — that line is what the review reads");
}
const privacyHtml = existsSync(join(DIST, "privacy.html")) ? readFileSync(join(DIST, "privacy.html"), "utf8") : "";
if (/Adsterra/i.test(privacyHtml)) {
  failures.push("the privacy policy still describes Adsterra, which the site no longer loads");
}

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
  /*
   * The array form is required, for the opposite reason to the line above: with
   * asset-first routing the asset layer answers a *navigation* to a path that has
   * no file with the 404 page, and the Worker never runs. `/unsubscribe` is exactly
   * that path, so a build without this list ships an unsubscribe link that only
   * works for curl. (Measured 2026-09-18: `Sec-Fetch-Mode: navigate` → 404,
   * without it → our page.)
   */
  for (const route of ["/unsubscribe", "/api/*"]) {
    if (!new RegExp(`"run_worker_first"\\s*:\\s*\\[[^\\]]*"${route.replace("*", "\\*")}"`).test(productionConfig)) {
      failures.push(
        `wrangler.production.jsonc does not route ${route} to the Worker first — asset-first serves the 404 page to browsers`,
      );
    }
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

/*
 * The declaration check. Runs here rather than in `verify:pages` because this script already owns
 * the crawler-facing files, and because it runs on every build rather than only on a parity run.
 */
const declared = declaredRoutes();
const undeclared = builtPages()
  .filter((file) => !NOT_IN_SITEMAP.has(file))
  .filter((file) => !declared.has(routeOf(file)));
if (undeclared.length) {
  failures.push(
    `${undeclared.length} built page(s) are not declared in sitemap.xml: ${undeclared.slice(0, 6).join(", ")}` +
      (undeclared.length > 6 ? ` … ${undeclared.length - 6} more` : ""),
  );
}
/* And the other direction: a declared URL with no page behind it is a 404 we asked Google to fetch. */
const orphans = [...declared].filter((route) => {
  if (route === "/") return !existsSync(join(DIST, "index.html"));
  return !existsSync(join(DIST, `${route.slice(1)}.html`)) && !existsSync(join(DIST, route.slice(1), "index.html"));
});
if (orphans.length) {
  failures.push(`${orphans.length} sitemap URL(s) have no page in the build: ${orphans.slice(0, 6).join(", ")}`);
}

/*
 * Declared image dimensions have to be the file's real dimensions.
 *
 * `width`/`height` on an `<img>` exists to reserve layout space, which only works if it is true —
 * a wrong pair is worse than none, because the browser reserves the wrong box and then reflows.
 * This reached production three times the same way: the image API ignores the requested aspect
 * ratio and always returns a square (checked 2026-09-23), so three covers whose HTML said
 * `1280x720` were 1024x1024 files, hidden behind `aspect-ratio: 16/9; object-fit: cover` in CSS.
 * The writing-style contract asks for "declared width/height" and for 16:9 covers; CSS was
 * silently satisfying the second and defeating the first (see
 * docs/lessons/generated-cover-is-not-done-until-you-look-at-it.md).
 *
 * Source files are read rather than dist output: the declaration is an authoring fact, and
 * checking the source names the file someone has to edit.
 */
function astroSources(dir = join(here, "../src")) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...astroSources(full));
    else if (entry.endsWith(".astro")) out.push(full);
  }
  return out;
}

const IMG_TAG = /<img\b[^>]*?>/gs;
let sizesChecked = 0;
for (const file of astroSources()) {
  const source = readFileSync(file, "utf8");
  for (const tag of source.match(IMG_TAG) ?? []) {
    const src = tag.match(/src="(\/img\/[^"]+)"/);
    const w = tag.match(/\bwidth="(\d+)"/);
    const h = tag.match(/\bheight="(\d+)"/);
    if (!src || !w || !h) continue;
    const asset = join(here, "../public", src[1].replace(/^\//, ""));
    const rel = file.slice(join(here, "..").length + 1);
    if (!existsSync(asset)) {
      failures.push(`${rel} points at ${src[1]}, which is not in public/`);
      continue;
    }
    const real = await sharp(asset).metadata();
    if (Number(w[1]) !== real.width || Number(h[1]) !== real.height) {
      failures.push(
        `${rel} declares ${src[1]} as ${w[1]}x${h[1]} but the file is ${real.width}x${real.height}`,
      );
    }
    sizesChecked += 1;
  }
}

console.log(
  `site files: robots.txt ${robots ? "ok" : "missing"} · _headers ${headers ? "ok" : "missing"} · _redirects ${
    redirects ? "ok" : "missing"
  } · indexnow key ${indexNowKey ?? "missing"} · og cards ${cardsChecked} declared · JSON-LD ${jsonLdBlocks} blocks valid` +
    ` · img sizes ${sizesChecked} declared`,
);
console.log(`  sitemap: ${declared.size} declared · ${builtPages().length} pages built · ${undeclared.length} undeclared`);
if (failures.length) {
  console.error("\nFAIL:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("OK: crawler-facing files are in the build, and the build is indexable");
