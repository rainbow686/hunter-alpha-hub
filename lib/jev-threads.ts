/**
 * /typesafe-jev/threads — the discussion column for Jev.
 *
 * Data comes from **two** intake queues that share one file (`lib/data/jev-threads.json`):
 * Hacker News via `scripts/ingest-hn.mjs` and dev.to via `scripts/ingest-devto.mjs`. The column was
 * mapped onto the reference site's `/community`, which carries Reddit and Hacker News; Reddit is
 * closed to us (403 without OAuth, `lessons/reddit-app-creation-is-a-dead-end.md`), and re-checking
 * the alternatives on 2026-09-23 left exactly one standing: dev.to answers 200 and already had
 * thirty Jev posts in it. So the column has two sources rather than a scope it cannot fill.
 *
 * The rule that makes automated collection safe is enforced here rather than in
 * prose: **an entry renders only when `status === "published"` and it carries a
 * written `ourNote`.** The ingest emits candidates and never writes a note, so
 * nothing can reach the page without somebody deciding it is worth a reader's time.
 */
import queue from "./data/jev-threads.json";

export interface JevThread {
  id: string;
  /** `hn` or `devto` — the card says which, because a 1,949-point thread and a 10-minute
   *  write-up are not the same kind of thing and the reader should not have to guess. */
  source: "hn" | "devto";
  url: string;
  title: string;
  author: string;
  publishedAt: string;
  /** Platform-specific, normalised to one number the card can print. */
  score: number;
  /** What that number is called on its platform: "points" on HN, "reactions" on dev.to. */
  scoreLabel: string;
  comments: number;
  /** The author's own one-line summary, where the platform publishes one. */
  what: string;
  /** Reading time, dev.to only. Null everywhere else. */
  readingMinutes: number | null;
  /** dev.to's own AI disclosure (`some_ai` = AI-assisted, `not_disclosed` = says nothing). */
  aiDisclosure: string | null;
  ourNote: string;
  checked: string[];
  card: string | null;
  /** Cover image for dev.to rows; HN rows have a screenshot card instead. */
  thumb: string;
  /** Use-case tags, read straight from the queue. */
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

/** The date the counts and the links in this column were read. */
export const JEV_THREADS_READ_ON: string = RAW.entries[0]?.metrics.asOf ?? RAW.meta.generatedAt.slice(0, 10);

/** Only published, annotated entries — the whole point of the queue. */
export const jevThreads: JevThread[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => {
    const source = e.source === "devto" ? "devto" as const : "hn" as const;
    return {
      id: e.id,
      source,
      url: e.url,
      title: e.title,
      author: e.author,
      publishedAt: e.publishedAt,
      /* One number, two names. HN orders its threads by points, dev.to by reactions — normalising
         them into one field is what lets the wall stay sorted without pretending they are equal. */
      score: source === "devto" ? e.metrics.reactions ?? 0 : e.metrics.score ?? 0,
      scoreLabel: source === "devto" ? "reactions" : "points",
      comments: e.metrics.comments,
      what: e.what ?? "",
      readingMinutes: e.metrics.readingMinutes ?? null,
      aiDisclosure: e.aiDisclosure ?? null,
      ourNote: e.ourNote,
      checked: e.checked,
      card: e.media?.card ?? null,
      thumb: e.media?.thumb ?? "",
      tags: e.tags ?? [],
    };
  })
  .sort((a, b) => b.score - a.score);

export const jevThreadCounts = {
  published: jevThreads.length,
  /** Candidates waiting for a written note: visible to us, never to a reader. */
  waiting: RAW.meta.candidatesRemaining ?? 0,
  queries: RAW.meta.queries.length,
};
