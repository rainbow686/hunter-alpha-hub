#!/usr/bin/env node
/**
 * Crawl madewithjev's build pages for **leads**, not for content.
 *
 * The import plan (docs/roadmap/jev-content-import.md) says their directory is a
 * source of leads and never of copy: we take the external URL each entry points
 * at, go read that original ourselves, and write our own row. This tool does the
 * first half mechanically, because 485 pages is not a thing to click through.
 *
 * Why a crawler and not their sitemap: the sitemap gives the 485 build slugs, but
 * the *source* of an entry (an X post, a repository, a video) only appears inside
 * the page. Their own index shows roughly one page of cards to a plain fetch —
 * the rest is client-rendered — so a bounded, polite crawl of the pages we can
 * read is the honest version of "go through their list".
 *
 *   node tools/lead-crawl/madewithjev.mjs --limit 60            # crawl 60 pages
 *   node tools/lead-crawl/madewithjev.mjs --limit 60 --json out.json
 *
 * Output: leads grouped by kind (x / github / youtube / other), with the ones we
 * already have removed, so the next batch is "the first N of this list".
 *
 * Politeness: one request per second, a real user agent with a contact URL, and a
 * hard `--limit`. We are reading somebody else's site to find links; nothing here
 * should look like a scraper with an appetite.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const UA = "hunter-alpha-hub-leads/0.1 (+https://www.hunteralphahub.com/contact)";
const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const LIMIT = Number(flag("limit", 60));
const DELAY_MS = Number(flag("delay", 1000));
const OUT = flag("json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Every external URL each of our own queues already has, so leads can be diffed. */
function knownUrls() {
  const files = [
    "lib/data/jev-x-posts.json",
    "lib/data/jev-builds.json",
    "lib/data/jev-videos.json",
    "lib/data/jev-threads.json",
    "lib/data/jev-x-sources.json",
  ];
  const out = new Set();
  for (const file of files) {
    const path = resolve(ROOT, file);
    if (!existsSync(path)) continue;
    const doc = JSON.parse(readFileSync(path, "utf8"));
    const rows = doc.entries ?? doc.sources ?? [];
    for (const row of rows) {
      if (row.url) out.add(row.url);
      if (row._externalUrl) out.add(row._externalUrl);
    }
  }
  return out;
}

const kindOf = (url) => {
  if (/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^/]+\/status\/\d+/i.test(url)) return "x";
  if (/^https?:\/\/(?:www\.)?github\.com\//i.test(url)) return "github";
  if (/^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(url)) return "youtube";
  return "other";
};

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  return res.ok ? res.text() : null;
}

async function slugs() {
  const xml = await get("https://madewithjev.com/sitemap.xml");
  if (!xml) throw new Error("sitemap unreachable");
  return [...xml.matchAll(/<loc>https:\/\/madewithjev\.com\/builds\/([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const all = await slugs();
  console.log(`their builds: ${all.length}`);
  const known = knownUrls();
  console.log(`we already hold: ${known.size} urls`);

  const leads = { x: [], github: [], youtube: [], other: [] };
  const seen = new Set();
  let read = 0;
  let blocked = 0;

  for (const slug of all.slice(0, LIMIT)) {
    const html = await get(`https://madewithjev.com/builds/${slug}`);
    read += 1;
    if (!html) {
      blocked += 1;
      await sleep(DELAY_MS);
      continue;
    }
    /* Their own domain and their author profile are not leads; everything else
       that looks like a source link is. */
    const found = [
      ...html.matchAll(/https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[A-Za-z0-9_]+\/status\/\d{15,20}/g),
      ...html.matchAll(/https?:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/g),
      ...html.matchAll(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[A-Za-z0-9_-]+|youtu\.be\/[A-Za-z0-9_-]+)/g),
    ].map((m) => m[0]);

    for (const url of found) {
      /* `github.com/kraayenjon` is their author profile, not a project. */
      if (/github\.com\/kraayenjon(\/|$)/i.test(url)) continue;
      if (seen.has(url)) continue;
      seen.add(url);
      const kind = kindOf(url);
      const have = [...known].some((k) => k === url || k.includes(url) || url.includes(k));
      leads[kind].push({ url, slug, have });
    }
    if (read % 10 === 0) console.log(`  read ${read}/${LIMIT} … leads so far: x ${leads.x.length}, gh ${leads.github.length}`);
    await sleep(DELAY_MS);
  }

  console.log(`\nread ${read} pages (${blocked} blocked)`);
  for (const [kind, rows] of Object.entries(leads)) {
    const fresh = rows.filter((r) => !r.have);
    console.log(`${kind.padEnd(8)} ${String(rows.length).padStart(3)} found · ${String(fresh.length).padStart(3)} new to us`);
  }
  console.log("\nnew to us, in crawl order:");
  for (const [kind, rows] of Object.entries(leads)) {
    for (const row of rows.filter((r) => !r.have).slice(0, 40)) {
      console.log(`  ${kind.padEnd(7)} ${row.url}  (from /builds/${row.slug})`);
    }
  }
  if (OUT) {
    writeFileSync(OUT, JSON.stringify({ read, blocked, leads }, null, 2) + "\n");
    console.log(`\nwrote ${OUT}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
