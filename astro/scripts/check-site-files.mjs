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

console.log(
  `site files: robots.txt ${robots ? "ok" : "missing"} · _headers ${headers ? "ok" : "missing"} · _redirects ${
    redirects ? "ok" : "missing"
  } · indexnow key ${indexNowKey ?? "missing"} · og cards ${cardsChecked} declared, all present`,
);
if (failures.length) {
  console.error("\nFAIL:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("OK: crawler-facing files are in the build, and the build is indexable");
