/**
 * /typesafe-jev/threads — the discussion column for Jev.
 *
 * Data comes from the HN intake queue (`scripts/ingest-hn.mjs`, design in
 * docs/roadmap/jev-intake.md) and is stored in `lib/data/jev-threads.json`.
 *
 * The rule that makes automated collection safe is enforced here rather than in
 * prose: **an entry renders only when `status === "published"` and it carries a
 * written `ourNote`.** The ingest emits candidates and never writes a note, so
 * nothing can reach the page without somebody deciding it is worth a reader's time.
 * Reddit is deliberately absent as a source — see lessons/reddit-app-creation-is-a-dead-end.md.
 */
import queue from "./data/jev-threads.json";

export interface JevThread {
  id: string;
  url: string;
  title: string;
  author: string;
  publishedAt: string;
  score: number;
  comments: number;
  ourNote: string;
  checked: string[];
  card: string | null;
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; queries: string[]; candidates: number; published: number; candidatesRemaining?: number };
  entries: {
    id: string; url: string; title: string; author: string; publishedAt: string;
    status: string; ourNote: string; checked: string[];
    media?: { card?: string };
    metrics: { score: number; comments: number; asOf: string };
  }[];
};

/** The date the counts and the links in this column were read. */
export const JEV_THREADS_READ_ON: string = RAW.entries[0]?.metrics.asOf ?? RAW.meta.generatedAt.slice(0, 10);

/** Only published, annotated entries — the whole point of the queue. */
export const jevThreads: JevThread[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({
    id: e.id,
    url: e.url,
    title: e.title,
    author: e.author,
    publishedAt: e.publishedAt,
    score: e.metrics.score,
    comments: e.metrics.comments,
    ourNote: e.ourNote,
    checked: e.checked,
    card: e.media?.card ?? null,
  }))
  .sort((a, b) => b.score - a.score);

export const jevThreadCounts = {
  published: jevThreads.length,
  /** Candidates waiting for a written note: visible to us, never to a reader. */
  waiting: RAW.meta.candidatesRemaining ?? 0,
  queries: RAW.meta.queries.length,
};
