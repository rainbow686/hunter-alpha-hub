/**
 * ingest-hn.mjs — Hacker News (Algolia) → candidate queue for /typesafe-jev/threads
 *
 * Design: docs/roadmap/jev-intake.md. Two rules from it are enforced here:
 *   1. this script only ever emits status:"candidate" — publishing requires a human
 *      (or an agent) to write `ourNote`, which is what the page guard then demands;
 *   2. every query is a *qualified* one. A bare "typesafe" is drowned by generic
 *      "type-safe" talk (2,755 hits, none about Jev), so qualification is the rule.
 *
 * Output: astro/src/data/intake/hn-jev.json — committed, diffable, reviewable.
 * No key, no quota: Algolia's HN API is free. Politeness: one pass, serial, 6 queries.
 */
import { mergeQueue } from "./lib/merge-queue.mjs";
import { matches, requireSource, resolveTopic } from "./lib/topics.mjs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
/** Default topic `jev`; `--topic laya` uses Laya's queries and writes lib/data/laya-threads.json. */
const TOPIC = resolveTopic();
const CFG = requireSource(TOPIC, "hn");
const OUT = resolve(ROOT, CFG.out);

const QUERIES = CFG.queries;

const MIN_POINTS = CFG.minPoints;
const MIN_DATE = CFG.minDate; // the model is new; older hits are about Jevons paradox, other Jevs
// A bare "jev" search returns Jevons paradox, a Chinese math prodigy and a 2022 economics story;
// a bare "laya" returns a game engine and a Dutch company. Relevance is a filter, not a hope: the
// title has to name the model, and the exclusion list in the topic config kills the homonyms.
const MIN_COMMENTS = CFG.minComments;
const UA = "hunter-alpha-hub-intake/0.1 (+https://www.hunteralphahub.com/contact)";

const asOf = new Date().toISOString().slice(0, 10);

async function search({ q, why }) {
  const url = new URL("https://hn.algolia.com/api/v1/search");
  url.searchParams.set("query", q);
  url.searchParams.set("tags", "story");
  url.searchParams.set("hitsPerPage", "20");
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${q}: HTTP ${res.status}`);
  const json = await res.json();
  return (json.hits ?? []).map((h) => ({
    id: `hn:${h.objectID}`,
    source: "hn",
    url: `https://news.ycombinator.com/item?id=${h.objectID}`,
    title: h.title ?? "",
    author: h.author ?? "",
    publishedAt: (h.created_at ?? "").slice(0, 10),
    media: { kind: "none" },
    metrics: { score: h.points ?? 0, comments: h.num_comments ?? 0, asOf },
    candidateReason: `matched "${q}" (${why})`,
    status: "candidate",
    ourNote: "",
    checked: [],
    _externalUrl: h.url ?? null,
  }));
}

const seen = new Set();
const entries = [];
for (const spec of QUERIES) {
  const hits = await search(spec);
  console.log(`${spec.q.padEnd(22)} ${String(hits.length).padStart(3)} hits`);
  for (const e of hits) {
    if (seen.has(e.id)) continue;
    if (e.metrics.score < MIN_POINTS && e.metrics.comments < MIN_COMMENTS) continue;
    if (e.publishedAt < MIN_DATE) continue;
    if (!matches(CFG, `${e.title} ${e._externalUrl ?? ""}`)) continue;
    seen.add(e.id);
    entries.push(e);
  }
}

entries.sort((a, b) => b.metrics.score - a.metrics.score);

/*
 * Merge, never overwrite. This file used to end with `writeFileSync(OUT, {meta, entries})` built
 * from this run's Algolia response — which meant a second run deleted every published thread and
 * its note. See lib/merge-queue.mjs.
 */
const dry = process.argv.includes("--dry");
const { added, kept, total, published } = mergeQueue(OUT, entries, {
  source: "hn-algolia",
  queries: QUERIES.map((q) => q.q),
  thresholds: { minPoints: MIN_POINTS, minComments: MIN_COMMENTS, minDate: MIN_DATE, relevance: String(CFG.relevance), exclude: String(CFG.exclude ?? "") },
  // The gate in one line: nothing here may reach a page until ourNote is written.
  note: "candidate-only queue — a page renders entries with status=published and a non-empty ourNote",
}, { dry });
console.log(`\n${entries.length} found · ${added} new · ${kept} already here · ${published} published · ${total} total${dry ? " (dry run)" : ""}`);
for (const e of entries.slice(0, 8)) {
  console.log(`  ${String(e.metrics.score).padStart(5)} pts  ${String(e.metrics.comments).padStart(4)} c  ${e.publishedAt}  ${e.title.slice(0, 64)}`);
}
