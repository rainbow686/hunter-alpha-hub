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
import { readFileSync, writeFileSync } from "node:fs";
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
/*
 * Unauthenticated GitHub core API is **60 requests an hour**, and the refresh below needs one per
 * published row (18 today) plus a retry each. The first run of it died with 18 × HTTP 403 at
 * `remaining: 0 / 60`. A token raises that to 5,000/hour, so it is read from the shared env if it
 * is there (`~/.config/shared-apis/env`, ADR-0023) and the request quietly goes without one if not.
 */
const GH_AUTH = (() => {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  return token ? { authorization: `Bearer ${token}` } : {};
})();
const GH_HEADERS = { "user-agent": UA, accept: "application/vnd.github+json", ...GH_AUTH };

/*
 * `--refresh`: re-read the numbers on the rows we have already published — stars, forks, language
 * and the last push — without touching anything a person wrote.
 *
 * The reason it exists is the same as `ingest-x.mjs --refresh` (ADR-0024): the item page prints
 * "stars read on <date>" and the number has to be able to move when we look again. Before this,
 * the only way to refresh a star count was to run the discovery pass, which — until
 * `merge-queue.mjs` — would have replaced the whole queue.
 *
 * Two fields are added rather than refreshed, because the item page now shows a four-cell stat
 * strip and we never stored them: `forks` and `language`. They are the repo's own numbers, read
 * from the API, and they carry the same read date as everything else on that strip.
 */
if (process.argv.includes("--refresh")) {
  const queue = JSON.parse(readFileSync(OUT, "utf8"));
  const published = queue.entries.filter((e) => e.status === "published");
  let changed = 0, moved = 0, failed = 0;
  for (const e of published) {
    const slug = e.id.replace("gh:", "");
    let repo = null;
    for (let attempt = 0; attempt < 2 && !repo; attempt++) {
      try {
        const res = await fetch(`https://api.github.com/repos/${slug}`, { headers: GH_HEADERS });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        repo = await res.json();
      } catch (err) {
        if (attempt === 1) {
          failed += 1;
          console.error(`  ${slug}: ${err.message.split("\n")[0]} — left at ${e.metrics.stars} (${e.metrics.asOf})`);
        }
        else await new Promise((r) => setTimeout(r, 1500)); // unauthenticated reads are rate-limited
      }
    }
    if (!repo) continue;
    const before = e.metrics.stars;
    const stars = repo.stargazers_count ?? before;
    if (stars !== before) moved += 1;
    console.log(`  ${String(stars - before).padStart(6)} ★  ${String(before).padStart(6)} → ${String(stars).padStart(6)}  ${slug}`);
    e.metrics = { ...e.metrics, stars, forks: repo.forks_count ?? null, language: repo.language ?? null, asOf, pushedAt: (repo.pushed_at ?? "").slice(0, 10) };
    changed += 1;
    await new Promise((r) => setTimeout(r, 900));
  }
  queue.meta = { ...queue.meta, refreshedAt: new Date().toISOString() };
  if (!process.argv.includes("--dry")) writeFileSync(OUT, `${JSON.stringify(queue, null, 2)}\n`);
  const hint = failed > 0 && !process.env.GITHUB_TOKEN && !process.env.GH_TOKEN
    ? " — 60 req/hour unauthenticated; set GITHUB_TOKEN in ~/.config/shared-apis/env to raise it to 5,000"
    : "";
  console.log(`builds refresh: ${changed} read (${moved} moved), ${failed} failed${process.argv.includes("--dry") ? " — dry run" : ""}${hint}`);
  process.exit(failed > 0 ? 1 : 0);
}

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
