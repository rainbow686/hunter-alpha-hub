#!/usr/bin/env node
/**
 * ingest-x-video.mjs — attach the playable mp4 to every X post that has one.
 *
 * Why this exists: the reference site plays X clips inside its cards (138 `<video>` elements
 * on its /x-posts page), and a reader asked why ours did not. The public syndication endpoint
 * we already use for these rows returns `video_info.variants`, including progressive
 * `video/mp4` URLs on `video.twimg.com` — so the clip can be played from X's own CDN.
 *
 * Hotlinked, never downloaded or rehosted (writing contract §3). The alternative we rejected
 * was a poster image that sends the reader to X to watch: it is the same clip, one click
 * further away, and it is the difference the reader noticed.
 *
 * Variant choice, and why it is not "the best quality": the first run took the largest mp4
 * under 1280px and produced a **149 MB** clip for the founder interview — on a 330px-wide card
 * that is ~12× the pixels anyone can see and a phone bill for the reader. So the policy is the
 * one a video engineer would give you:
 *
 *   1. only variants at least 480px wide (below that a retina phone shows a soft rectangle);
 *   2. among those, the smallest file that is still at least 640px wide and no bigger than
 *      `MAX_BYTES` — the 640×360 ladder rung is 40px wider than the card and a third of the
 *      720p file;
 *   3. if nothing fits the cap, **no player at all**: the card keeps its poster and links out.
 *      A clip nobody can afford to stream is not a feature.
 *
 * The file size is read with a HEAD request per variant, so the number in the queue is
 * measured, not extrapolated from the nominal bitrate (which is an average; the 1080p variant
 * of one clip is 10368 kbps nominal and 23 MB on disk).
 *
 * Usage: node scripts/ingest-x-video.mjs [--check]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { requireSource, resolveTopic } from "./lib/topics.mjs";

const ROOT = resolve(import.meta.dirname, "../..");
/** Default topic `jev`; `--topic laya` attaches playable clips to Laya's X queue. */
const TOPIC = resolveTopic();
const QUEUE = resolve(ROOT, requireSource(TOPIC, "x").out);
const MAX_BYTES = 25 * 1024 * 1024;
const MIN_WIDTH = 480;
const PREFERRED_WIDTH = 640;
const ENDPOINT = (id) => `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=x`;

const queue = JSON.parse(readFileSync(QUEUE, "utf8"));
const check = process.argv.includes("--check");

const widthOf = (variant) => {
  const m = /\/vid\/[^/]+\/(\d+)x(\d+)\//.exec(variant.url);
  return m ? Number(m[1]) : 0;
};

async function sizeOf(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const bytes = Number(res.headers.get("content-length") ?? 0);
    return Number.isFinite(bytes) && bytes > 0 ? bytes : null;
  } catch {
    return null;
  }
}

async function bestVariant(media) {
  const variants = (media?.video_info?.variants ?? [])
    .filter((v) => v.content_type === "video/mp4" && v.url)
    .map((v) => ({ ...v, width: widthOf(v) }))
    .filter((v) => v.width >= MIN_WIDTH)
    .sort((a, b) => a.width - b.width);
  if (!variants.length) return null;
  const measured = [];
  for (const variant of variants) measured.push({ ...variant, bytes: await sizeOf(variant.url) });
  const affordable = measured.filter((v) => v.bytes !== null && v.bytes <= MAX_BYTES);
  const pool = affordable.length ? affordable : [];
  if (!pool.length) return null;
  const preferred = pool.filter((v) => v.width >= PREFERRED_WIDTH);
  const chosen = (preferred.length ? preferred : pool).sort((a, b) => a.bytes - b.bytes)[0];
  return chosen;
}

let attached = 0, already = 0, missing = 0, failed = 0;
for (const entry of queue.entries) {
  if (entry.status !== "published") continue;
  if (entry.media?.kind !== "video") continue;
  if (entry.media.video?.url) { already += 1; continue; }
  const id = entry.id.replace("x:", "");
  try {
    const res = await fetch(ENDPOINT(id));
    const data = await res.json();
    const media = (data.mediaDetails ?? []).find((m) => m.type === "video");
    const variant = await bestVariant(media);
    if (!variant) { missing += 1; console.log(`  ${entry.id}: no mp4 under the ${Math.round(MAX_BYTES / 1024 / 1024)} MB cap — card keeps its poster and links out`); continue; }
    const durationS = media.video_info?.duration_millis ? Math.round(media.video_info.duration_millis / 1000) : null;
    entry.media = {
      ...entry.media,
      video: {
        url: variant.url,
        width: variant.width,
        height: (media.video_info?.aspect_ratio ?? [16, 9])[1] && variant.width
          ? Math.round((variant.width * (media.video_info.aspect_ratio?.[1] ?? 9)) / (media.video_info.aspect_ratio?.[0] ?? 16))
          : 0,
        durationS,
        bitrate: variant.bitrate ?? null,
        bytes: variant.bytes,
        /* X's own duration field. Kept because it is theirs, but the card does not print it:
           the unit does not survive cross-checking (one clip's payload says 2174 "millis" and
           the file implies ~575 s at the nominal bitrate), and a wrong number on a card is
           worse than no number. */
        durationS,
        readOn: new Date().toISOString().slice(0, 10),
      },
    };
    attached += 1;
    console.log(`  ${entry.id}: ${variant.width}px, ${(variant.bytes / 1024 / 1024).toFixed(1)} MB${durationS ? ` (payload duration ${durationS}s)` : ""}`);
  } catch (err) {
    failed += 1;
    console.log(`  ${entry.id}: ${String(err).split("\n")[0]}`);
  }
}

if (!check) writeFileSync(QUEUE, JSON.stringify(queue, null, 2) + "\n");
console.log(`x video: ${attached} attached, ${already} already present, ${missing} with no mp4, ${failed} failed${check ? " (check only)" : ""}`);
