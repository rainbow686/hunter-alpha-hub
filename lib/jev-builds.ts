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
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; candidates: number };
  entries: {
    id: string; url: string; title: string; author: string; status: string; ourNote: string; what: string;
    metrics: { stars: number; asOf: string; pushedAt: string };
  }[];
};

export const JEV_BUILDS_READ_ON: string = RAW.entries[0]?.metrics.asOf ?? RAW.meta.generatedAt.slice(0, 10);

export const jevBuilds: JevBuild[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({
    id: e.id, url: e.url, title: e.title, author: e.author,
    stars: e.metrics.stars, pushedAt: e.metrics.pushedAt, what: e.what, ourNote: e.ourNote,
  }))
  .sort((a, b) => b.stars - a.stars);

export const jevBuildCounts = { published: jevBuilds.length, waiting: RAW.meta.candidates - jevBuilds.length };
