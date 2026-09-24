/**
 * /laya/videos — the video column of the Laya topic.
 *
 * Data: `lib/data/laya-videos.json` from `scripts/ingest-youtube.mjs --topic laya` (YouTube Data
 * API v3, quota notes in ADR-0023). Ranking is by view count, the only ordering signal YouTube
 * publishes.
 *
 * The filter that matters here is title-and-description relevance, and it earns its keep on this
 * topic: five of the fourteen candidates are Jev explainers that the search surfaced because both
 * models live in the same sentence everywhere. Those were rejected with a written reason rather
 * than published with a shrug — a card titled "JEV Breakdown" in Laya's column is a card a reader
 * cannot trust.
 */
import queue from "./data/laya-videos.json";

export interface LayaVideo {
  id: string;
  videoId: string;
  url: string;
  title: string;
  channel: string;
  publishedAt: string;
  views: number;
  durationS: number;
  thumb: string;
  thumbW: number;
  thumbH: number;
  ourNote: string;
  tags: string[];
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; candidates: number; candidatesRemaining?: number };
  entries: {
    id: string; videoId: string; url: string; title: string; author: string; publishedAt: string;
    status: string; ourNote: string; tags?: string[];
    metrics: { views: number; asOf: string };
    media: { thumb: string; thumbW: number; thumbH: number; durationS: number };
  }[];
};

export const LAYA_VIDEOS_READ_ON: string = RAW.entries[0]?.metrics.asOf ?? RAW.meta.generatedAt.slice(0, 10);

export const layaVideos: LayaVideo[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({
    id: e.id, videoId: e.videoId, url: e.url, title: e.title, channel: e.author,
    publishedAt: e.publishedAt, views: e.metrics.views, durationS: e.media.durationS,
    thumb: e.media.thumb, thumbW: e.media.thumbW, thumbH: e.media.thumbH,
    ourNote: e.ourNote, tags: e.tags ?? [],
  }))
  .sort((a, b) => b.views - a.views);

export const layaVideoCounts = {
  published: layaVideos.length,
  waiting: RAW.meta.candidatesRemaining ?? 0,
};
