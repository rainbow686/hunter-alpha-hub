/**
 * /typesafe-jev/videos — the video column of the Jev topic.
 *
 * Data: `lib/data/jev-videos.json`, produced by `scripts/ingest-youtube.mjs`
 * (YouTube Data API v3, quota notes in ADR-0023). Ranking is by view count, which is
 * the only ordering signal YouTube actually gives us; relevance was filtered at
 * ingest time because a bare "jev" is the rapper, the vaccine and Jevons paradox.
 *
 * Same gate as the threads column: published + a written note, or it does not render
 * (`scripts/check-intake.mjs` enforces it). Nothing is embedded before a click —
 * ADR-0022 — so a page of candidates costs no third-party requests.
 */
import queue from "./data/jev-videos.json";

export interface JevVideo {
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
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; candidates: number };
  entries: {
    id: string; videoId: string; url: string; title: string; author: string; publishedAt: string;
    status: string; ourNote: string;
    metrics: { views: number; asOf: string };
    media: { thumb: string; thumbW: number; thumbH: number; durationS: number };
  }[];
};

export const JEV_VIDEOS_READ_ON: string = RAW.entries[0]?.metrics.asOf ?? RAW.meta.generatedAt.slice(0, 10);

export const jevVideos: JevVideo[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({
    id: e.id,
    videoId: e.videoId,
    url: e.url,
    title: e.title,
    channel: e.author,
    publishedAt: e.publishedAt,
    views: e.metrics.views,
    durationS: e.media.durationS,
    thumb: e.media.thumb,
    thumbW: e.media.thumbW,
    thumbH: e.media.thumbH,
    ourNote: e.ourNote,
  }))
  .sort((a, b) => b.views - a.views);

export const jevVideoCounts = {
  published: jevVideos.length,
  waiting: RAW.meta.candidates - jevVideos.length,
};
