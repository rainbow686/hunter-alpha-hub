/**
 * The numbers the authors publish about their own builds.
 *
 * Why this exists: the reference site prints a bare figure on every card — `~300 ms`,
 * `~$0.0002`, `706k` — with the label ("Per decision", "Cost per step") in a tooltip. The
 * function is good: a card that shows a number tells you more than a card that only
 * describes. We copy the function and differ in two places, both because of who we are:
 *
 *   1. **The label is visible text.** A bare `300 ms` on a card invites the reader to
 *      assume it is *our* measurement of *Jev*. It is neither. Ours go on
 *      `/typesafe-jev/statistics` and are labelled as ours; this file is the other half.
 *   2. **The sentence travels with the number.** Every entry carries the quote it was read
 *      from and the page we read it on, so a reader (or a fact-checker) can go and look.
 *      That is the whole difference between a reference site and a screenshot of one.
 *
 * The labelling is deliberately allowed to be unflattering to the row it sits on: Kev's
 * number is about Kev's own local model, Von's is about Von, and both say so, because a
 * number that quietly borrowed Jev's reputation would be the one thing this site cannot do.
 *
 * Our README-first workflow (`scripts/ingest-x-video.mjs`) is untouched by this: nothing is
 * downloaded, nothing is copied, only figures the author printed themselves plus the
 * sentence they printed them in.
 */
import data from "./data/jev-claims.json";

export interface JevClaim {
  /** The figure as the author wrote it, e.g. `~300 ms`. Never re-rounded by us. */
  value: string;
  /** What the figure is about, in our words — including when it is not about Jev. */
  label: string;
  /** The sentence we read it in. */
  quote: string;
  /** The page it came from. */
  from: string;
  /** What kind of page that is: repository README, the post's own text, image alt text. */
  source: string;
}

export const jevClaimsReadOn: string = data.meta.readOn;
export const JEV_CLAIMS_NOTE: string = data.meta.what;

const table = data.claims as Record<string, JevClaim[]>;

/** Every claim we hold for one row, in the order the file lists them. */
export const claimsFor = (id: string): JevClaim[] => table[id] ?? [];

/** Rows that carry at least one number — the number the index pages print. */
export const JEV_CLAIM_ROWS = Object.keys(table).length;

/** Total claims, because one row can carry two (a decision budget and the RPC under it). */
export const JEV_CLAIM_TOTAL = Object.values(table).reduce((n, list) => n + list.length, 0);

export const JEV_CLAIMS_TABLE = table;
