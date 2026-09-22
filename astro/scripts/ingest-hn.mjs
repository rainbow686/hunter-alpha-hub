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
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../../lib/data/jev-threads.json");

const QUERIES = [
  { q: "jev", why: "the model itself" },
  { q: "system one typesafe", why: "the launch, by its other name" },
  { q: "jev decision model", why: "what it is" },
  { q: "kev jev", why: "the derivative family (Kev)" },
  { q: "jev leftpad", why: "the joke build that trended" },
  { q: "madewithjev", why: "the directory built on the flood" },
];

const MIN_POINTS = 20;
const MIN_DATE = "2026-06-01"; // the model is new; older hits are about Jevons paradox, other Jevs
// A bare "jev" search returns Jevons paradox, a Chinese math prodigy and a 2022 economics story.
// Relevance is therefore a filter, not a hope: the title must name this Jev (not "Jevons").
const RELEVANT = /(\bjev\b(?!ons)|\bkev\b|typesafe|system one)/i;
const MIN_COMMENTS = 10;
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
    if (!RELEVANT.test(`${e.title} ${e._externalUrl ?? ""}`)) continue;
    seen.add(e.id);
    entries.push(e);
  }
}

entries.sort((a, b) => b.metrics.score - a.metrics.score);

const payload = {
  meta: {
    generatedAt: new Date().toISOString(),
    source: "hn-algolia",
    queries: QUERIES.map((q) => q.q),
    thresholds: { minPoints: MIN_POINTS, minComments: MIN_COMMENTS, minDate: MIN_DATE, relevance: String(RELEVANT) },
    candidates: entries.length,
    published: 0,
    // The gate in one line: nothing here may reach a page until ourNote is written.
    note: "candidate-only queue — a page renders entries with status=published and a non-empty ourNote",
  },
  entries,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`\n${entries.length} candidates → ${OUT.replace(`${process.cwd()}/`, "")}`);
for (const e of entries.slice(0, 8)) {
  console.log(`  ${String(e.metrics.score).padStart(5)} pts  ${String(e.metrics.comments).padStart(4)} c  ${e.publishedAt}  ${e.title.slice(0, 64)}`);
}
