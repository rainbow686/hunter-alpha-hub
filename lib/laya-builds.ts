/**
 * /laya/builds — the works index for Laya.
 *
 * Data: `lib/data/laya-builds.json` from `scripts/ingest-github.mjs --topic laya`. Same gate as
 * every other queue on this site (scripts/check-intake.mjs): a row reaches a page only when it is
 * `published` and carries a written note, and a GitHub row additionally needs a dossier — what it
 * does, how it works, what we read, and what we did not check.
 *
 * Why this column looks different from Jev's: Laya is five days old here and its corpus is
 * runtimes rather than products. Two of the eighteen rows are ports by the same author, four are
 * servers speaking TypeSafe's own wire format, and the most useful row for a reader with a laptop
 * has eleven stars rather than eleven thousand. The star floor in the topic config is lower for
 * that reason, and the sort is still by stars because it is the only ordering signal that is not
 * ours.
 */
import queue from "./data/laya-builds.json";

export interface LayaBuild {
  id: string;
  url: string;
  title: string;
  author: string;
  stars: number;
  /** Null until `ingest-github.mjs --topic laya --refresh` has read the repository. */
  forks: number | null;
  language: string | null;
  /** The day the stars above were read (ADR-0024 — every third-party number carries one). */
  starsAsOf: string;
  pushedAt: string;
  /**
   * The day the repository itself was published, when GitHub reports one — added 2026-09-25 for
   * the home page's feed, which orders cards by date across topics. Not `starsAsOf` (the day we
   * read the row) and not `pushedAt` (the last commit).
   */
  publishedAt: string;
  what: string;
  ourNote: string;
  card: string | null;
  tags: string[];
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
    dossier?: LayaBuild["dossier"] extends null ? never : NonNullable<LayaBuild["dossier"]>;
    media?: { card?: string };
    metrics: { stars: number; asOf: string; pushedAt: string; forks?: number | null; language?: string | null };
    publishedAt?: string;
  }[];
};

export const LAYA_BUILDS_READ_ON: string = RAW.entries[0]?.metrics.asOf ?? RAW.meta.generatedAt.slice(0, 10);

export const layaBuilds: LayaBuild[] = RAW.entries
  .filter((e) => e.status === "published" && e.ourNote.trim().split(/\s+/).length >= 20)
  .map((e) => ({
    id: e.id, url: e.url, title: e.title, author: e.author,
    stars: e.metrics.stars, forks: e.metrics.forks ?? null, language: e.metrics.language ?? null,
    starsAsOf: e.metrics.asOf, pushedAt: e.metrics.pushedAt, publishedAt: e.publishedAt ?? e.metrics.pushedAt,
    what: e.what, ourNote: e.ourNote,
    card: e.media?.card ?? null,
    tags: e.tags ?? [],
    dossier: e.dossier ?? null,
  }))
  .sort((a, b) => b.stars - a.stars);

/** Rows that carry a dossier, i.e. that have a page of their own. */
export const layaBuildsWithPages: LayaBuild[] = layaBuilds.filter((b) => b.dossier);

export const layaBuildCounts = {
  published: layaBuilds.length,
  waiting: RAW.meta.candidatesRemaining ?? 0,
  withPages: layaBuildsWithPages.length,
};
