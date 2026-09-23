#!/usr/bin/env node
/**
 * ingest-x-detail.mjs — the two fields a canonical X page needs that the hub does not print.
 *
 *   node scripts/ingest-x-detail.mjs [--dry]
 *
 * ## What it writes, and what it refuses to write
 *
 * Two fields per published row, and nothing else:
 *
 *   `quote`  — the post's own opening words, **capped at `MAX_QUOTE` characters**, kept so the
 *              item page can show what the post actually said instead of only our summary of it.
 *              It is a quotation with a link, the same tier as the `claims` file: short, attributed,
 *              and never the whole feed. A tweet that runs longer than the cap is cut at a word
 *              boundary with an ellipsis, because a quote that stops mid-word is a bad quote.
 *   `avatar`  — the author's profile image URL, **hotlinked from pbs.twimg.com, never downloaded**
 *              (writing contract §3). The reference site puts a face on every card; a wall of
 *              handle-only cards reads as machine-made, which is the complaint that started this.
 *
 * It does **not** touch a note, a title, a status or a number: those belong to a person or to
 * `--refresh`. Same retry rule as the refresh — this public endpoint intermittently refuses a
 * request, and a refusal must not silently leave a card faceless.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const QUEUE = resolve(ROOT, "lib/data/jev-x-posts.json");
const UA = "hunter-alpha-hub-intake/0.1 (+https://www.hunteralphahub.com/contact)";
/** Long enough for the sentence a page is built on, short enough to stay a quotation. */
const MAX_QUOTE = 280;
const DRY = process.argv.includes("--dry");
const asOf = new Date().toISOString().slice(0, 10);

const queue = JSON.parse(readFileSync(QUEUE, "utf8"));

/*
 * The syndication endpoint returns the post text **HTML-escaped** — `&gt; new action space every
 * step` came back as literal `&gt;` in the first run and printed as `&gt;` on the page. Decoding
 * the five entities a tweet can contain is enough; anything else is a link or an emoji and is
 * already text.
 */
const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'" };
const clean = (s) => s.replace(/&(?:amp|lt|gt|quot|#39|apos);/g, (m) => ENTITIES[m]).replace(/\s+/g, " ").trim();
const clip = (s) => {
  if (s.length <= MAX_QUOTE) return s;
  const cut = s.slice(0, MAX_QUOTE);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

let written = 0, failed = 0;
for (const entry of queue.entries) {
  if (entry.status !== "published") continue;
  if (entry.quote?.text && entry.media?.avatar) continue; // already have both
  const id = entry.id.replace("x:", "");
  let data = null;
  for (let attempt = 0; attempt < 2 && !data; attempt++) {
    try {
      const res = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=x`, { headers: { "user-agent": UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (err) {
      if (attempt === 1) { failed += 1; console.error(`  ${entry.id}: ${err.message.split("\n")[0]}`); }
      else await new Promise((r) => setTimeout(r, 1200));
    }
  }
  if (!data) continue;
  const text = clean(data.text ?? "");
  if (text) entry.quote = { text: clip(text), chars: text.length, from: entry.url, readOn: asOf };
  const avatar = data.user?.profile_image_url_https;
  if (avatar) entry.media = { ...entry.media, avatar };
  written += 1;
  console.log(`  ${String(text.length).padStart(4)} chars${text.length > MAX_QUOTE ? ` (quoted ${MAX_QUOTE})` : ""}  ${avatar ? "avatar" : "  —   "}  ${entry.id}`);
  await new Promise((r) => setTimeout(r, 400));
}

if (!DRY) writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`X detail: ${written} rows written, ${failed} failed${DRY ? " (dry run)" : ""}`);
process.exit(failed > 0 ? 1 : 0);
