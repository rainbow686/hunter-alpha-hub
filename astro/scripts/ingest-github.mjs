/**
 * ingest-github.mjs — repositories built on Jev → candidate queue for /typesafe-jev/builds
 *
 * One search call (unauthenticated search allows 10/min, core 60/hr — we use one),
 * because the search response already carries the fields this column is about:
 * stars, last push, description. Those are the author's numbers, which is exactly
 * what the reference site publishes too; our addition is the date we read them and
 * the sentence saying what the thing does.
 */
import { mergeQueue } from "./lib/merge-queue.mjs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../../lib/data/jev-builds.json");
const UA = "hunter-alpha-hub-intake/0.1 (+https://www.hunteralphahub.com/contact)";
const QUERIES = ["jev in:name,description created:>2026-06-01", "jev typesafe in:readme"];
const MIN_STARS = 25;
const RELEVANT = /(\bjev\b(?!ons)|\bkev\b|typesafe)/i;

const asOf = new Date().toISOString().slice(0, 10);
const seen = new Map();

for (const q of QUERIES) {
  const url = new URL("https://api.github.com/search/repositories");
  url.searchParams.set("q", q);
  url.searchParams.set("sort", "stars");
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", "50");
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/vnd.github+json" } });
  if (!res.ok) { console.error(`${q}: HTTP ${res.status}`); continue; }
  const json = await res.json();
  let kept = 0;
  for (const r of json.items ?? []) {
    if (seen.has(r.full_name)) continue;
    if ((r.stargazers_count ?? 0) < MIN_STARS) continue;
    const text = `${r.name} ${r.description ?? ""} ${r.topics?.join(" ") ?? ""}`;
    if (!RELEVANT.test(text)) continue;
    seen.set(r.full_name, {
      id: `gh:${r.full_name}`,
      source: "github",
      url: r.html_url,
      title: r.full_name,
      author: r.owner?.login ?? "",
      publishedAt: (r.created_at ?? "").slice(0, 10),
      media: { kind: "none" },
      metrics: { stars: r.stargazers_count ?? 0, asOf, pushedAt: (r.pushed_at ?? "").slice(0, 10) },
      what: r.description ?? "No description published.",
      candidateReason: `matched "${q}"`,
      status: "candidate",
      ourNote: "",
      checked: [],
    });
    kept++;
  }
  console.log(`${q.padEnd(46)} ${(json.items ?? []).length} returned, ${kept} kept`);
}

const fresh = [...seen.values()].sort((a, b) => b.metrics.stars - a.metrics.stars).slice(0, 24);
/*
 * Merge, never overwrite: the 24 rows in this response are *candidates*, and the queue already
 * holds dossiers somebody wrote (see lib/merge-queue.mjs for what the old write did instead).
 */
const dry = process.argv.includes("--dry");
const { added, kept, total, published } = mergeQueue(OUT, fresh, {
  source: "github-search", queries: QUERIES, thresholds: { minStars: MIN_STARS },
  note: "candidate-only queue — publish requires a written ourNote, enforced by scripts/check-intake.mjs",
}, { dry });
console.log(`\n${fresh.length} found · ${added} new · ${kept} already here · ${published} published · ${total} total${dry ? " (dry run)" : ""}`);
for (const e of fresh.slice(0, 14)) console.log(`  ${String(e.metrics.stars).padStart(6)} \u2605  ${e.metrics.pushedAt}  ${e.title.slice(0, 42).padEnd(42)} ${(e.what ?? "").slice(0, 46)}`);
