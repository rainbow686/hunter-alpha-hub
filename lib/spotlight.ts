/**
 * What the masthead shows when no stealth codename is live.
 *
 * The status slot was built for one moment: a new codename appearing, which is the
 * only time this site has news. The rest of the time it printed the last reveal
 * next to "no live codename" — a badge for an event that was over, plus a sentence
 * telling the reader that nothing is happening. It took up the most valuable strip
 * on the site to say nothing twice.
 *
 * So the slot has two states. If a codename is live, the live badge wins (that is
 * its own field in lib/stealth-models.ts and it is not duplicated here). If not,
 * the newest thing on the site goes there instead — one hand-maintained pointer,
 * rendered as a link, so the space is always a place to go rather than a status
 * nobody can act on.
 *
 * Change this when something newer lands. It is one field on purpose: the previous
 * version of this slot said "Union Alpha revealed" for a week after the reveal,
 * because the value was derived from a fact rather than chosen by a person.
 */
export const spotlight = {
  /** Short enough for the masthead: it shares a row with the verified stamp. */
  label: "Laya: open weights, on your CPU",
  href: "/laya",
  /** The date the thing this points at went live, for anyone reading this file. */
  since: "2026-09-24",
} as const;
