#!/usr/bin/env node
/**
 * GA4 guard for the Astro build. Run after `astro build` (CI does both).
 *
 * Why this exists: Phase 4 replaces the app that currently serves the site, and
 * GA4 is the only traffic instrument this project has while GSC still shows 10
 * indexed pages out of 49. Losing the probe would not break a single test, a
 * single page, or a single ranking — it would just make the dashboard go quiet,
 * and we would not notice until we went looking for numbers that were never
 * collected. So the rule is mechanical: **every page in the sitemap must carry
 * the measurement tag**, and every event the Next app fires must still exist in
 * the Astro bundle under the same name.
 *
 * Checks
 *   1. every sitemap URL has an HTML file (missing page = the build is wrong)
 *   2. that file loads gtag with the measurement ID and calls gtag('config')
 *   3. every event name in `lib/gtag.ts`'s map appears in the built output
 *      — i.e. the two apps cannot drift apart under the same GA4 property
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(here, "../dist");
const GTAG_SOURCE = join(here, "../../lib/gtag.ts");

const failures = [];
const note = (message) => failures.push(message);

const sitemapPath = join(DIST, "sitemap.xml");
if (!existsSync(sitemapPath)) {
  console.error("FAIL: dist/sitemap.xml is missing — run `astro build` first");
  process.exit(1);
}

const sitemap = readFileSync(sitemapPath, "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length === 0) note("sitemap.xml declares no URLs");

/** /union-alpha -> dist/union-alpha.html (build.format = "file"); / -> index.html */
const fileFor = (url) => {
  const path = new URL(url).pathname.replace(/\/$/, "");
  return join(DIST, path === "" ? "index.html" : `${path}.html`);
};

const measurementId = (() => {
  const source = readFileSync(join(here, "../src/components/Analytics.astro"), "utf8");
  const hardcoded = source.match(/G-[A-Z0-9]{6,}/);
  const fromLib = readFileSync(join(here, "../src/lib/analytics.ts"), "utf8").match(/G-[A-Z0-9]{6,}/);
  return (fromLib ?? hardcoded)?.[0] ?? null;
})();
if (!measurementId) note("could not find a GA measurement ID in src/lib/analytics.ts");

const withTag = [];
const withoutTag = [];
for (const url of urls) {
  const file = fileFor(url);
  if (!existsSync(file)) {
    note(`sitemap URL ${url} has no built page at ${file.replace(DIST, "dist")}`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const loadsGtag = /googletagmanager\.com\/gtag\/js\?id=G-/.test(html);
  const configures = /gtag\(["']config["']/.test(html);
  if (loadsGtag && configures && (!measurementId || html.includes(measurementId))) withTag.push(url);
  else withoutTag.push(url);
}
for (const url of withoutTag) note(`${url} does not carry the GA4 tag`);

/**
 * Both apps carry the map as a doc comment (`── Event map … / Naming rules`).
 * Parsing both and comparing is the drift check: a rename on one side only would
 * otherwise split the funnel in half across the cutover and look like a traffic
 * change instead of a bug.
 */
const parseEventMap = (source) => {
  const section = source.split(/Event map/)[1]?.split(/Naming rules/)[0] ?? "";
  return section
    .split("\n")
    .map((line) => line.match(/^\s*\*\s+([a-z_]+)\s{2,}/)?.[1])
    .filter(Boolean);
};

const nextEvents = parseEventMap(readFileSync(GTAG_SOURCE, "utf8"));
const astroEvents = parseEventMap(readFileSync(join(here, "../src/lib/analytics.ts"), "utf8"));

if (nextEvents.length < 8) note(`only ${nextEvents.length} events parsed from lib/gtag.ts — check the map format`);
if (astroEvents.length < 8) note(`only ${astroEvents.length} events parsed from src/lib/analytics.ts`);

for (const name of nextEvents) {
  if (!astroEvents.includes(name)) note(`event "${name}" is in the Next map but not the Astro map`);
}
for (const name of astroEvents) {
  if (!nextEvents.includes(name)) note(`event "${name}" is in the Astro map but not the Next map`);
}

const bundle = [
  ...readdirSync(join(DIST, "_astro"))
    .filter((name) => name.endsWith(".js"))
    .map((name) => readFileSync(join(DIST, "_astro", name), "utf8")),
  ...withTag.map((url) => readFileSync(fileFor(url), "utf8")),
].join("\n");

// page_view is not ours to fire: it comes from gtag('config', …) itself, so it is
// asserted by the tag check above rather than looked up in the bundle.
const firedEvents = astroEvents.filter((name) => name !== "page_view");
const missingEvents = firedEvents.filter((name) => !bundle.includes(name));
for (const name of missingEvents) note(`event "${name}" exists in lib/gtag.ts but not in the Astro bundle`);

console.log(`analytics: ${withTag.length}/${urls.length} sitemap pages carry the GA4 tag`);
console.log(
  `analytics: measurement id ${measurementId ?? "???"}, ${astroEvents.length} events mapped (${firedEvents.length} wired + page_view from gtag)`,
);
console.log(`analytics: events missing from the bundle: ${missingEvents.length === 0 ? "none" : missingEvents.join(", ")}`);

if (failures.length > 0) {
  console.error("\nFAIL:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("OK: GA4 probe and event map survive the Astro build");
