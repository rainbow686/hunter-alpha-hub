/**
 * ingest-x.mjs — X posts → the x-posts queue, without X's API.
 *
 * The file used to be called jev-demos.json: the column was misnamed "demos" from the
 * start (see lib/jev-x-posts.ts). Renamed 2026-09-23 with the column.
 *
 * X's read API is priced (Free is write-only, Basic $200/mo), but the widget endpoint
 * that renders an embedded post is public and returns every field this column needs:
 * text, author, timestamp, like count, and the media URLs. No key, no OAuth:
 *
 *   https://cdn.syndication.twimg.com/tweet-result?id=<post id>&token=x
 *
 * What we take: the post's own text, its author, its date, its like count, and the
 * thumbnail URL on X's CDN. What we do not do: download or rehost the video, or the
 * images (contract §3 — a reader's browser fetches the poster from X, which is exactly
 * what an embed would do, and the row links to the post for everything else).
 *
 * Candidates only. The queue is the same shape as the other three, so publishing still
 * requires a written ourNote (scripts/check-intake.mjs enforces it).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const SEEDS = resolve(ROOT, "lib/data/jev-x-sources.json");
const QUEUE = resolve(ROOT, "lib/data/jev-x-posts.json");
const UA = "hunter-alpha-hub-intake/0.1 (+https://www.hunteralphahub.com/contact)";
const LIMIT = Number(process.env.X_LIMIT ?? 20); // politeness: one pass, bounded
const asOf = new Date().toISOString().slice(0, 10);

const { sources } = JSON.parse(readFileSync(SEEDS, "utf8"));
const queue = existsSync(QUEUE) ? JSON.parse(readFileSync(QUEUE, "utf8")) : { meta: {}, entries: [] };
const known = new Set(queue.entries.map((e) => e.id));

let added = 0, failed = 0, skipped = 0;
for (const { url } of sources.slice(0, LIMIT)) {
  const id = url.split("/").pop();
  if (known.has(`x:${id}`)) { skipped++; continue; }
  try {
    const res = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=x`, { headers: { "user-agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const t = await res.json();
    const media = t.mediaDetails?.[0] ?? t.media?.[0] ?? null;
    const kind = media?.type === "video" || media?.type === "animated_gif" ? "video" : media ? "image" : "none";
    const text = (t.text ?? "").replace(/\s+/g, " ").trim();
    queue.entries.push({
      id: `x:${id}`,
      source: "x",
      url,
      title: text.length > 96 ? `${text.slice(0, 93)}…` : text || "(no text)",
      author: t.user?.screen_name ? `@${t.user.screen_name}` : (t.user?.name ?? "unknown"),
      publishedAt: (t.created_at ?? "").slice(0, 10),
      media: {
        kind,
        thumb: media?.media_url_https ?? "",
        thumbW: media?.original_info?.width ?? 0,
        thumbH: media?.original_info?.height ?? 0,
      },
      metrics: { likes: t.favorite_count ?? 0, asOf },
      candidateReason: "read from the X list we curated, then resolved through the public syndication endpoint",
      status: "candidate",
      ourNote: "",
      checked: [],
    });
    added++;
  } catch (err) {
    failed++;
    console.error(`  ${id}: ${err.message.split("\n")[0]} — skipped`);
  }
  await new Promise((r) => setTimeout(r, 400)); // one request at a time
}

queue.meta = {
  ...queue.meta,
  generatedAt: new Date().toISOString(),
  source: "x-syndication",
  queries: [`${sources.length} curated links`],
  candidates: queue.entries.length,
  published: queue.entries.filter((e) => e.status === "published").length,
  note: "candidate-only queue — publish requires a written ourNote, enforced by scripts/check-intake.mjs",
};
writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`X: ${added} resolved, ${skipped} already known, ${failed} failed → lib/data/jev-x-posts.json (${queue.entries.length} total)`);
for (const e of queue.entries.slice(-6)) console.log(`  ${String(e.metrics.likes).padStart(5)} ♥  ${e.publishedAt}  ${e.media.kind.padEnd(5)}  ${e.author.padEnd(18)} ${e.title.slice(0, 46)}`);
