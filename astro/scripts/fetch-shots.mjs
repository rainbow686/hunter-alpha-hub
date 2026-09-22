/**
 * fetch-shots.mjs — a screenshot of the source page for entries that publish no image.
 *
 * A thread has no preview: Hacker News draws no card, and the item page is the source
 * itself. So the honest image for the row is a picture of that page as it looked on a
 * stated date — real, checkable, and dated, which is the same claim the row makes.
 *
 * The alternative the contract forbids is the interesting one: a generated illustration
 * here would be a picture of nothing in particular, on a directory page whose whole job
 * is pointing at things that exist (contract §5).
 *
 * Cropped to the first 1200x630 of the item page: enough for the title, the score, the
 * top comment and the shape of the discussion; webp, so a card costs ~40KB.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const QUEUE = resolve(ROOT, "lib/data/jev-threads.json");
const OUTDIR = resolve(ROOT, "astro/public/img/shots");
const require = createRequire(import.meta.url);

const { chromium } = require("@playwright/test");
const sharp = require("sharp");
const asOf = new Date().toISOString().slice(0, 10);

const queue = JSON.parse(readFileSync(QUEUE, "utf8"));
mkdirSync(OUTDIR, { recursive: true });

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
let made = 0, kept = 0;
for (const entry of queue.entries) {
  if (entry.status !== "published") continue;
  const id = entry.id.replace("hn:", "");
  const name = `hn-${id}.webp`;
  const abs = resolve(OUTDIR, name);
  if (existsSync(abs)) { kept++; }
  else {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    try {
      await page.goto(entry.url, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(700);
      const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } });
      await sharp(buf).resize(1200, 630).webp({ quality: 80 }).toFile(abs);
      made++;
    } catch (err) {
      console.error(`  ${entry.id}: ${err.message.split("\n")[0]} — row keeps no image`);
    } finally { await page.close(); }
  }
  if (existsSync(abs)) {
    entry.media = { ...(entry.media ?? {}), kind: "screenshot", card: `/img/shots/${name}`, cardW: 1200, cardH: 630, cardAsOf: asOf };
  }
}
await browser.close();
writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`shots: ${made} taken, ${kept} already present → astro/public/img/shots/`);
