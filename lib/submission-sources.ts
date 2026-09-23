import table from "./data/submission-sources.json";

/**
 * Read the source of a submitted link off its URL.
 *
 * The sender should not have to know that github.com belongs in /builds and
 * news.ycombinator.com in /threads — and asking them would invite a wrong answer
 * that nothing downstream could catch. The host is the fact; the classification is
 * ours to make.
 *
 * The table lives in `lib/data/submission-sources.json` because three callers need
 * it and only two of them can import TypeScript: the endpoint and the /submit page
 * use this function, and `scripts/submissions.mjs` reads the same JSON directly to
 * route a pulled row into the right queue file. One table, so the names cannot
 * drift apart — the same reason the ingest scripts' `source` values are reused
 * here rather than a parallel set of labels.
 */

export interface SubmissionSource {
  source: string;
  hosts: string[];
  /** Queue file under `lib/data/`, or null when the platform is closed to us. */
  column: string | null;
  /**
   * URL list an ingest script reads, for sources that cannot be searched — X is
   * the only one today. Null means the ingest script for that source queries an
   * API instead, so a submitted link waits for a query or for a hand-written row.
   */
  seed: string | null;
  /** The `topic` option this source usually means, used to pre-pick the form. */
  topic: string;
  label: string;
  enrich: string;
}

const FALLBACK: SubmissionSource = table.fallback as SubmissionSource;
const SOURCES = table.sources as SubmissionSource[];

/** Hostname of a URL, or null when it is not a URL at all. */
function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Match on the host and its parent domains, so `gist.github.com` and
 * `www.reddit.com` land on the same source as their apex. Suffix matching rather
 * than a substring test: `notgithub.com` must not read as github.
 */
export function inferSource(url: string): SubmissionSource {
  const host = hostOf(url);
  if (!host) return FALLBACK;
  for (const entry of SOURCES) {
    for (const candidate of entry.hosts) {
      const bare = candidate.replace(/^www\./, "");
      if (host === bare || host.endsWith(`.${bare}`)) return entry;
    }
  }
  return FALLBACK;
}

export function sourceByKey(key: string | null | undefined): SubmissionSource | null {
  if (!key) return null;
  return SOURCES.find((entry) => entry.source === key) ?? (key === FALLBACK.source ? FALLBACK : null);
}

/**
 * The whole table, known platforms first and the catch-all last.
 *
 * For the one caller that has to *name* the platforms rather than classify a
 * link: /submit lists them so a sender can see that GitHub, X and "something else
 * entirely" all work. It renders this instead of restating it in prose, which is
 * what keeps the answer from going stale the first time a platform is added.
 */
export function allSources(): SubmissionSource[] {
  return [...SOURCES, FALLBACK];
}
