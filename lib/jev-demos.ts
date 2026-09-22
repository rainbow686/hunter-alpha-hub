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
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; candidates: number; published: number };
  entries: { id: string; url: string; title: string; author: string; publishedAt: string; status: string; ourNote: string;
    metrics: { likes: number; asOf: string }; media?: { kind?: string; thumb?: string } }[];
};

export const JEV_DEMOS_READ_ON: string = RAW.meta.generatedAt.slice(0, 10);

export const jevDemos: JevDemo[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({ id: e.id, url: e.url, title: e.title, author: e.author, publishedAt: e.publishedAt, ourNote: e.ourNote,
    likes: e.metrics.likes, kind: e.media?.kind ?? 'none', thumb: e.media?.thumb ?? '' }));

export const jevDemoCounts = { published: jevDemos.length, waiting: RAW.meta.candidates - jevDemos.length };
