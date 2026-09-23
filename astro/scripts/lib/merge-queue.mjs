/**
 * merge-queue.mjs — put discovered rows into a queue file **without touching what is there**.
 *
 * Why this exists: `ingest-github.mjs`, `ingest-hn.mjs` and `ingest-youtube.mjs` all ended with
 * `writeFileSync(OUT, {meta, entries})` built from the current API response. Running any of them
 * a second time would **overwrite the queue with a fresh candidate list** — deleting every
 * `ourNote`, every dossier and every published row in it. Nobody had run them twice yet; the day
 * somebody did ("let me refresh the builds list"), the column would have emptied itself and the
 * only copy of that writing is in the repo that had just been overwritten.
 *
 * The rule is the same one `ingest-x.mjs` already followed: **automation collects, a person
 * decides** (`roadmap/jev-intake.md` §4). A discovery script's job is to *add* candidates. It has
 * no business deleting or editing a row a person has read.
 *
 * So: existing rows are kept **as they are** — including `candidate` rows, because a candidate
 * may be mid-review and re-ordering it would lose the reason it was kept. Fresh rows are added
 * only when their id is new. `meta` keeps its history and gains counts.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export function readQueue(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : { meta: {}, entries: [] };
}

/**
 * @param {string} path          queue file to update
 * @param {object[]} fresh       rows discovered this run (any status; they are added untouched)
 * @param {object} meta          the discovery facts for this run (source, queries, thresholds…)
 * @param {object} [options]
 * @param {boolean} [options.dry] report what would change, write nothing
 * @returns {{ added: number, kept: number, total: number, published: number }}
 */
export function mergeQueue(path, fresh, meta, { dry = false } = {}) {
  const queue = readQueue(path);
  const existing = queue.entries ?? [];
  const known = new Set(existing.map((e) => e.id));

  const added = fresh.filter((e) => e.id && !known.has(e.id));
  const entries = [...existing, ...added];

  const published = entries.filter((e) => e.status === "published").length;
  const next = {
    ...queue.meta,
    ...meta,
    generatedAt: new Date().toISOString(),
    candidates: entries.length,
    published,
  };

  mkdirSync(dirname(path), { recursive: true });
  if (!dry) writeFileSync(path, `${JSON.stringify({ meta: next, entries }, null, 2)}\n`);

  return { added: added.length, kept: existing.length, total: entries.length, published };
}
