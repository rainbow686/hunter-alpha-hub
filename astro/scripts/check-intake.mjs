/**
 * check-intake.mjs — the gate that keeps the intake columns honest.
 *
 * roadmap/jev-intake.md §4. Automation collects; a person decides. These are the
 * mechanical consequences of that sentence, and they run in `npm run checks` so
 * the rule cannot be quietly dropped when someone is in a hurry:
 *
 *   1. every rendered entry carries a written note (>= 20 words) — no note, no page;
 *   2. every entry has a URL, an author and a date;
 *   3. no URL appears twice;
 *   4. thumbnails declare their size (CLS) — enforced where thumbnails exist;
 *   5. the candidate queue has a ceiling: past it we are hoarding, not writing.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const QUEUES = [
  resolve(ROOT, "lib/data/jev-threads.json"),
  resolve(ROOT, "lib/data/jev-videos.json"),
  resolve(ROOT, "lib/data/jev-demos.json"),
  resolve(ROOT, "lib/data/jev-builds.json"),
];
const MAX_CANDIDATES = 200;
const MIN_NOTE_WORDS = 20;
const HOST_WHITELIST = ["news.ycombinator.com", "www.reddit.com", "reddit.com", "www.youtube.com", "youtube.com", "github.com", "x.com", "twitter.com"];

const fail = [];
let queued = 0, publishedTotal = 0, queryTotal = 0;
for (const QUEUE of QUEUES) {
  if (!existsSync(QUEUE)) { fail.push(`${QUEUE} missing — run its ingest script`); continue; }
  const q = JSON.parse(readFileSync(QUEUE, "utf8"));
  queryTotal += q.meta?.queries?.length ?? 0;
  const entries = q.entries ?? [];
  if (entries.length > MAX_CANDIDATES) fail.push(`candidate queue holds ${entries.length} entries (ceiling ${MAX_CANDIDATES}) — write notes or tighten the queries`);

  const seen = new Map();
  let published = 0;
  for (const e of entries) {
    const where = e.id ?? "(no id)";
    if (seen.has(e.url)) fail.push(`${where}: duplicate URL, already used by ${seen.get(e.url)}`);
    seen.set(e.url, where);

    if (!["candidate", "published", "rejected", "removed"].includes(e.status)) fail.push(`${where}: unknown status "${e.status}"`);
    if (!e.url || !e.author || !e.publishedAt) fail.push(`${where}: url/author/publishedAt are required`);

    if (e.status === "published") {
      published += 1;
      const words = (e.ourNote ?? "").trim().split(/\s+/).filter(Boolean).length;
      if (words < MIN_NOTE_WORDS) fail.push(`${where}: published with a ${words}-word note (minimum ${MIN_NOTE_WORDS}) — the note is the only thing that makes this not a link dump`);
      if (!Array.isArray(e.checked) || e.checked.length === 0) fail.push(`${where}: published with nothing recorded in "checked"`);
      const host = new URL(e.url).hostname;
      if (!HOST_WHITELIST.includes(host)) fail.push(`${where}: host ${host} is not in the whitelist`);
      if (e.media?.thumb && (!e.media.thumbW || !e.media.thumbH)) fail.push(`${where}: thumbnail without width/height`);
    }
  }
  queued += entries.length; publishedTotal += published;
}
console.log(`Intake OK — ${queued} queued, ${publishedTotal} published, ${queued - publishedTotal} waiting for a note (${queryTotal} queries).`);

if (fail.length) {
  console.error(`Intake check failed (${fail.length}):`);
  for (const f of fail) console.error(`  - ${f}`);
  process.exit(1);
}
