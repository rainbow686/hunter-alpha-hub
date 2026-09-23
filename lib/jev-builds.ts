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
  /**
   * The two cells the stat strip only has once `ingest-github.mjs --refresh` has run against the
   * repo. Null is the honest state for "we have not read it yet", and the page falls back to the
   * licence and the stack rather than printing a zero a reader would read as a count.
   */
  forks: number | null;
  language: string | null;
  /** The day the stars above were read (ADR-0024 — every third-party number carries one). */
  starsAsOf: string;
  pushedAt: string;
  what: string;
  ourNote: string;
  card: string | null;
  /** Use-case tags, read straight from the queue (see docs/lessons/ on filtered views). */
  tags: string[];
  /**
   * The first-hand layer, and the only thing on this site that makes a build page a page:
   * what it does and how it works in our words, what we read in the repository, and what
   * we did not check. A published row without one is a link with a sentence, which is a
   * list entry — not a record. `check:intake` enforces it.
   */
  dossier: {
    slug: string;
    readOn: string;
    license: string;
    stack: string;
    whatItDoes: string;
    howItWorks: string;
    whatWeChecked: string[];
    whatWeDidNotCheck: string;
    bestFor: string;
  } | null;
}

const RAW = queue as unknown as {
  meta: { generatedAt: string; candidates: number; candidatesRemaining?: number };
  entries: {
    id: string; url: string; title: string; author: string; status: string; ourNote: string; what: string; tags?: string[];
    dossier?: { slug: string; readOn: string; license: string; stack: string; whatItDoes: string; howItWorks: string;
                whatWeChecked: string[]; whatWeDidNotCheck: string; bestFor: string };
    media?: { card?: string };
    metrics: { stars: number; asOf: string; pushedAt: string; forks?: number | null; language?: string | null };
  }[];
};

export const JEV_BUILDS_READ_ON: string = RAW.entries[0]?.metrics.asOf ?? RAW.meta.generatedAt.slice(0, 10);

export const jevBuilds: JevBuild[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({
    id: e.id, url: e.url, title: e.title, author: e.author,
    stars: e.metrics.stars, forks: e.metrics.forks ?? null, language: e.metrics.language ?? null,
    starsAsOf: e.metrics.asOf, pushedAt: e.metrics.pushedAt, what: e.what, ourNote: e.ourNote,
    card: e.media?.card ?? null,
    tags: e.tags ?? [],
    dossier: e.dossier ?? null,
  }))
  .sort((a, b) => b.stars - a.stars);

/**
 * Counts for the page header. `waiting` reads the queue's own `candidatesRemaining`
 * rather than subtracting this column's published rows from the queue total — that
 * subtraction counted rejected rows as waiting, and after the 2026-09-22 triage it
 * printed "6 waiting for a note" on a queue with nothing left in it.
 */
/** Rows that carry a dossier, i.e. that have a page of their own. */
export const jevBuildsWithPages: JevBuild[] = jevBuilds.filter((b) => b.dossier);

export const jevBuildCounts = {
  published: jevBuilds.length,
  waiting: RAW.meta.candidatesRemaining ?? 0,
  withPages: jevBuildsWithPages.length,
};
