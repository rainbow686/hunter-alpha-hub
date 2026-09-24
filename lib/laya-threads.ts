/**
 * /laya/threads — the discussion column for Laya.
 *
 * Data: `lib/data/laya-threads.json` from `scripts/ingest-hn.mjs --topic laya`. One source, not
 * two, and that is a measured fact rather than a preference: dev.to has no `laya` tag yet, and
 * reading `tag=jev` instead dropped sixty Jev posts into this topic's file on the first run. They
 * were removed; if a Jev-tagged write-up turns out to be about Laya it belongs in the Jev column
 * anyway, where it already is.
 *
 * The score threshold is 3 points where the Jev column's is 20. That is not laxness: the author's
 * own 1,349-point thread is here, and so is a three-point Show HN whose demo is the reason a
 * quarter of this wall exists. The column prints each thread's score, so a reader can weigh a
 * three-point thread differently from a thousand-point one — which is the whole point of printing
 * it.
 */
import queue from "./data/laya-threads.json";

export interface LayaThread {
  id: string;
  source: "hn" | "devto";
  url: string;
  title: string;
  author: string;
  publishedAt: string;
  score: number;
  scoreLabel: string;
  comments: number;
  what: string;
  readingMinutes: number | null;
  aiDisclosure: string | null;
  ourNote: string;
  checked: string[];
  card: string | null;
  thumb: string;
  tags: string[];
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; queries: string[]; candidates: number; published: number; candidatesRemaining?: number };
  entries: {
    id: string; url: string; title: string; author: string; publishedAt: string; source?: string;
    status: string; ourNote: string; checked: string[]; tags?: string[];
    what?: string; aiDisclosure?: string | null;
    media?: { card?: string; thumb?: string };
    metrics: { score?: number; comments: number; reactions?: number; readingMinutes?: number | null; asOf: string };
  }[];
};

/** The newest read date in the file, not the first row's — see jev-threads.ts for the bug that rule came from. */
const readDates = RAW.entries
  .filter((e) => e.status === "published" && e.metrics?.asOf)
  .map((e) => e.metrics.asOf)
  .sort();

export const LAYA_THREADS_READ_ON: string = readDates.at(-1) ?? RAW.meta.generatedAt.slice(0, 10);

export const layaThreads: LayaThread[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => {
    const source = e.source === "devto" ? "devto" as const : "hn" as const;
    return {
      id: e.id, source, url: e.url, title: e.title, author: e.author, publishedAt: e.publishedAt,
      score: source === "devto" ? e.metrics.reactions ?? 0 : e.metrics.score ?? 0,
      scoreLabel: source === "devto" ? "reactions" : "points",
      comments: e.metrics.comments,
      what: e.what ?? "",
      readingMinutes: e.metrics.readingMinutes ?? null,
      aiDisclosure: e.aiDisclosure ?? null,
      ourNote: e.ourNote, checked: e.checked,
      card: e.media?.card ?? null, thumb: e.media?.thumb ?? "",
      tags: e.tags ?? [],
    };
  })
  .sort((a, b) => b.score - a.score);

export const layaThreadCounts = {
  published: layaThreads.length,
  waiting: RAW.meta.candidatesRemaining ?? 0,
  queries: RAW.meta.queries.length,
};
