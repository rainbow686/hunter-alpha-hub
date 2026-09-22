/**
 * /typesafe-jev/builds — the works index for Jev.
 *
 * Data: `lib/data/jev-builds.json` from `scripts/ingest-github.mjs`. The numbers here
 * (stars, last push) are the author's/platform's, read on a stated date — the same
 * shape the reference site publishes, and the same caveat: they move, so the read
 * date is printed rather than implied.
 *
 * Same gate as the other queues: publish + a written note, or it does not render.
 */
import queue from "./data/jev-builds.json";

export interface JevBuild {
  id: string;
  url: string;
  title: string;
  author: string;
  stars: number;
  pushedAt: string;
  what: string;
  ourNote: string;
  card: string | null;
  /** Use-case tags, read straight from the queue (see docs/lessons/ on filtered views). */
  tags: string[];
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; candidates: number; candidatesRemaining?: number };
  entries: {
    id: string; url: string; title: string; author: string; status: string; ourNote: string; what: string; tags?: string[];
    media?: { card?: string };
    metrics: { stars: number; asOf: string; pushedAt: string };
  }[];
};

export const JEV_BUILDS_READ_ON: string = RAW.entries[0]?.metrics.asOf ?? RAW.meta.generatedAt.slice(0, 10);

export const jevBuilds: JevBuild[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({
    id: e.id, url: e.url, title: e.title, author: e.author,
    stars: e.metrics.stars, pushedAt: e.metrics.pushedAt, what: e.what, ourNote: e.ourNote,
    card: e.media?.card ?? null,
    tags: e.tags ?? [],
  }))
  .sort((a, b) => b.stars - a.stars);

/**
 * Counts for the page header. `waiting` reads the queue's own `candidatesRemaining`
 * rather than subtracting this column's published rows from the queue total — that
 * subtraction counted rejected rows as waiting, and after the 2026-09-22 triage it
 * printed "6 waiting for a note" on a queue with nothing left in it.
 */
export const jevBuildCounts = {
  published: jevBuilds.length,
  waiting: RAW.meta.candidatesRemaining ?? 0,
};
