/**
 * ingest-youtube.mjs — YouTube Data API v3 → candidate queue for /typesafe-jev/videos
 *
 * Quota is the constraint, not speed (ADR-0023): search.list costs 100 units of a
 * shared 10,000/day, videos.list costs 1. So this script does two searches at most
 * and then one videos.list to enrich whatever it found — about 201 units per run.
 * Channel RSS is cheaper still and is the intended path once we know the channels;
 * search is for discovery only.
 *
 * Key: process.env.YOUTUBE_API_KEY — from ~/.config/shared-apis/env (never the repo).
 * Relevance: a bare "jev" is the rapper, the vaccine and Jevons paradox, so the same
 * filter the HN ingest uses applies — the title must name this Jev, and nothing older
 * than June 2026 can be about it.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../../lib/data/jev-videos.json");
const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) { console.error("YOUTUBE_API_KEY is not set (see docs/decisions/ADR-0023)"); process.exit(2); }

const API = "https://www.googleapis.com/youtube/v3";
const QUERIES = ["jev decision model typesafe", "system one jev tutorial"];
const MIN_DATE = "2026-06-01";
// "System One" alone is a category and pulls in unrelated products, so the
// test is the name (jev/kev) or the vendor (typesafe) — not the family word.
const RELEVANT = /(\bjev\b(?!ons)|\bkev\b|typesafe)/i;
const MIN_VIEWS = 200;
const MAX_RESULTS = 12;

async function api(path, params) {
  const url = new URL(`${API}/${path}`);
  for (const [k, v] of Object.entries({ ...params, key: KEY })) url.searchParams.set(k, v);
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(`${path}: ${res.status} ${json?.error?.message ?? ""}`);
  return json;
}

const iso = (d) => new Date(d).toISOString().slice(0, 10);
const seconds = (p) => {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(p ?? "");
  if (!m) return 0;
  const [, d, h, mi, s] = m;
  return (+(d ?? 0)) * 86400 + (+(h ?? 0)) * 3600 + (+(mi ?? 0)) * 60 + (+(s ?? 0));
};

const seen = new Set();
const ids = [];
for (const q of QUERIES) {
  const found = await api("search", { part: "snippet", q, type: "video", maxResults: "25", order: "relevance" });
  let kept = 0;
  for (const item of found.items ?? []) {
    const id = item.id.videoId;
    const title = item.snippet.title;
    const published = iso(item.snippet.publishedAt);
    if (seen.has(id)) continue;
    if (published < MIN_DATE) continue;
    if (!RELEVANT.test(title)) continue;
    if (!RELEVANT.test(title)) continue;
    seen.add(id); ids.push({ id, title, published, channel: item.snippet.channelTitle }); kept++;
  }
  console.log(`${q.padEnd(34)} ${(found.items ?? []).length} returned, ${kept} kept`);
}

let details = [];
if (ids.length) {
  const d = await api("videos", { part: "snippet,statistics,contentDetails", id: ids.map((x) => x.id).join(",") });
  details = (d.items ?? []).map((v) => ({
    id: v.id,
    title: v.snippet.title,
    channel: v.snippet.channelTitle,
    publishedAt: iso(v.snippet.publishedAt),
    durationS: seconds(v.contentDetails.duration),
    views: Number(v.statistics?.viewCount ?? 0),
    thumb: v.snippet.thumbnails?.medium?.url ?? "",
    thumbW: v.snippet.thumbnails?.medium?.width ?? 0,
    thumbH: v.snippet.thumbnails?.medium?.height ?? 0,
  }));
}

details.sort((a, b) => b.views - a.views);
const entries = details.filter((v) => v.views >= MIN_VIEWS).slice(0, MAX_RESULTS).map((v) => ({
  id: `yt:${v.id}`,
  videoId: v.id,
  source: "youtube",
  url: `https://www.youtube.com/watch?v=${v.id}`,
  title: v.title,
  author: v.channel,
  publishedAt: v.publishedAt,
  media: { kind: "video", thumb: v.thumb, thumbW: v.thumbW, thumbH: v.thumbH, durationS: v.durationS },
  metrics: { views: v.views, asOf: new Date().toISOString().slice(0, 10) },
  candidateReason: "matched a qualified search for this Jev",
  status: "candidate",
  ourNote: "",
  checked: [],
}));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify({
  meta: {
    generatedAt: new Date().toISOString(),
    source: "youtube-data-api-v3",
    queries: QUERIES,
    quotaPerRun: QUERIES.length * 100 + 1,
    candidates: entries.length,
    published: 0,
    note: "candidate-only queue — publish requires a written ourNote, enforced by scripts/check-intake.mjs",
  },
  entries,
}, null, 2)}\n`);
console.log(`\n${entries.length} candidates → lib/data/jev-videos.json`);
for (const e of entries) console.log(`  ${String(e.metrics.views).padStart(9)} views  ${String(e.media.durationS).padStart(5)}s  ${e.publishedAt}  ${e.title.slice(0, 58)}`);
