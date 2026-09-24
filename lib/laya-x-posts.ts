/**
 * /laya/x-posts — what people are saying about Laya on X.
 *
 * Data: `lib/data/laya-x-posts.json`, candidates resolved from `lib/data/laya-x-sources.json`
 * through X's public syndication endpoint (no API key — see scripts/ingest-x.mjs). The seeds were
 * found by searching the open web for the model on 2026-09-24, and every one of the 34 candidates
 * was read in full before a decision was taken: 22 are published, 12 are rejected with the reason
 * written down.
 *
 * What this column does not have, and why: no canonical item pages. The Jev column has 83 of
 * them, one per post, because the posts are the records there. Here the wall carries the post's
 * own words on the card and links to X for everything else, which is what the reader asked for
 * when they declined item pages ("把内容都在卡片上展示出来"). A Laya post that turns out to need
 * a page of its own will get one; none has yet.
 *
 * The clips are hotlinked from X's own CDN and never downloaded or rehosted (writing contract §3).
 */
import queue from "./data/laya-x-posts.json";

export interface LayaXPost {
  id: string;
  url: string;
  title: string;
  author: string;
  publishedAt: string;
  ourNote: string;
  likes: number;
  /** "video" | "image" | "none" — what the post contains, which is what the card's eyebrow says. */
  kind: string;
  thumb: string;
  thumbW: number;
  thumbH: number;
  /** A progressive mp4 on X's CDN when one fits the size cap (scripts/ingest-x-video.mjs). */
  video: { url: string; width: number; height: number; bytes: number; durationS: number | null } | null;
  avatar: string;
  quote: { text: string; chars: number; from: string; readOn: string } | null;
  checked: string[];
  tags: string[];
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; candidates: number; published: number; candidatesRemaining?: number };
  entries: {
    id: string; url: string; title: string; author: string; publishedAt: string; status: string;
    ourNote: string; tags?: string[];
    metrics: { likes: number; asOf: string };
    checked?: string[];
    quote?: { text: string; chars: number; from: string; readOn: string };
    media?: {
      kind?: string; thumb?: string; thumbW?: number; thumbH?: number;
      video?: { url: string; width: number; height: number; bytes: number; durationS: number | null };
      avatar?: string;
    };
  }[];
};

/** The newest `metrics.asOf` in the queue, not `meta.generatedAt` — see jev-x-posts.ts. */
const readDates = RAW.entries
  .filter((e) => e.status === "published" && e.metrics?.asOf)
  .map((e) => e.metrics.asOf)
  .sort();

export const LAYA_X_READ_ON: string = readDates.at(-1) ?? RAW.meta.generatedAt.slice(0, 10);

export const layaXPosts: LayaXPost[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({
    id: e.id, url: e.url, title: e.title, author: e.author, publishedAt: e.publishedAt,
    ourNote: e.ourNote, likes: e.metrics.likes, kind: e.media?.kind ?? "none",
    thumb: e.media?.thumb ?? "", thumbW: e.media?.thumbW ?? 0, thumbH: e.media?.thumbH ?? 0,
    video: e.media?.video ?? null,
    avatar: e.media?.avatar ?? "",
    quote: e.quote ?? null,
    checked: e.checked ?? [],
    tags: e.tags ?? [],
  }))
  .sort((a, b) => b.likes - a.likes);

/** The post with the most likes — the front page's hero uses it, so the pick is a count and not a mood. */
export const layaTopPost: LayaXPost | null = layaXPosts[0] ?? null;

export const layaXPostCounts = {
  described: layaXPosts.length,
  waiting: RAW.meta.candidatesRemaining ?? 0,
};
