/**
 * /typesafe-jev/demos — the hand-entered column.
 *
 * X and Threads have no read API we can afford (X) or get approved (Threads), and
 * Reddit's app creation is a dead end (docs/lessons/). So this queue is written by
 * hand and it starts empty on purpose: the same gate as the other two applies — an
 * entry renders only when it is published and carries a written note.
 */
import queue from "./data/jev-demos.json";

export interface JevDemo {
  id: string;
  url: string;
  title: string;
  author: string;
  publishedAt: string;
  ourNote: string;
  likes: number;
  kind: string;
  thumb: string;
  thumbW: number;
  thumbH: number;
  /** One row can be listed in two views: every published post is an X post, and the
   *  ones showing something running are also demos. The field is a facet, not a bucket. */
  isDemo: boolean;
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; candidates: number; published: number; candidatesRemaining?: number };
  entries: { id: string; url: string; title: string; author: string; publishedAt: string; status: string; ourNote: string;
    isDemo?: boolean; metrics: { likes: number; asOf: string }; media?: { kind?: string; thumb?: string; thumbW?: number; thumbH?: number } }[];
};

export const JEV_DEMOS_READ_ON: string = RAW.meta.generatedAt.slice(0, 10);

const published: JevDemo[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({ id: e.id, url: e.url, title: e.title, author: e.author, publishedAt: e.publishedAt, ourNote: e.ourNote,
    likes: e.metrics.likes, kind: e.media?.kind ?? 'none', thumb: e.media?.thumb ?? '', thumbW: e.media?.thumbW ?? 0, thumbH: e.media?.thumbH ?? 0, isDemo: e.isDemo === true }));

/** Rows that show something running — the narrower column. */
export const jevDemos: JevDemo[] = published.filter((e) => e.isDemo);

/** Every published X post, demos included. */
export const jevAllPosts: JevDemo[] = published;

/**
 * Two views over one queue, so two counts: `published` is the demo column (rows that
 * show something running) and `described` is every post with a note of ours. The
 * X-posts page header said "42 demos described" about things that are not demos.
 */
export const jevDemoCounts = {
  published: jevDemos.length,
  described: jevAllPosts.length,
  waiting: RAW.meta.candidatesRemaining ?? 0,
};
