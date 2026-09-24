/**
 * fetch-cards.mjs — give each build a preview card, the way the reference site does.
 *
 * madewithjev embeds a preview image per build and self-hosts it; GitHub draws exactly
 * such a card for every public repository (name, description, stars, language) at
 * opengraph.githubassets.com. Two ways to use it:
 *
 *   hotlink  — zero storage, always current, one third-party request per row;
 *   snapshot — download once, keep it here, date it.
 *
 * This script takes the snapshot route, for the reasons the rest of the site already
 * runs on: no third-party requests from a reader's browser, a stable image behind a
 * stable URL, and a date we can print. The card is GitHub's drawing of the repository
 * as it stood on that date — which is exactly what this column claims.
 *
 * Runs over the existing queue and only adds fields; it never touches status or
 * ourNote, so a re-run cannot lose a written note.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { requireSource, resolveTopic } from "./lib/topics.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
/** Default topic `jev`; `--topic laya` snapshots GitHub's cards for Laya's rows instead. */
const TOPIC = resolveTopic();
const QUEUE = resolve(ROOT, requireSource(TOPIC, "github").out);
const OUTDIR = resolve(ROOT, "astro/public/img/cards");
const asOf = new Date().toISOString().slice(0, 10);

const queue = JSON.parse(readFileSync(QUEUE, "utf8"));
mkdirSync(OUTDIR, { recursive: true });

let fetched = 0, kept = 0;
for (const entry of queue.entries) {
  const slug = entry.title.replace("/", "-");
  const file = `cards/${slug}.png`;
  const abs = resolve(ROOT, "astro/public/img", file);
  if (!existsSync(abs)) {
    const res = await fetch(`https://opengraph.githubassets.com/1/${entry.title}`, {
      headers: { "user-agent": "hunter-alpha-hub-intake/0.1 (+https://www.hunteralphahub.com/contact)" },
    });
    if (!res.ok) { console.error(`  ${entry.title}: HTTP ${res.status} — row keeps no card`); continue; }
    writeFileSync(abs, Buffer.from(await res.arrayBuffer()));
    fetched++;
  } else kept++;
  entry.media = { ...(entry.media ?? {}), kind: "card", card: `/img/${file}`, cardW: 1280, cardH: 640, cardAsOf: asOf };
}
writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`cards: ${fetched} fetched, ${kept} already present → astro/public/img/cards/`);
