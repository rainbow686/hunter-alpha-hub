/**
 * When each page's content last actually changed.
 *
 * Why this exists: both sitemaps used `new Date()` for every URL, so all 87
 * entries claimed to have been modified at the moment a crawler asked. Google's
 * documented behaviour for a `<lastmod>` it cannot trust is to ignore it — so the
 * one signal that would tell it "these four pages are new, crawl them" was
 * thrown away, on a site whose sitemap had not been re-read since March.
 *
 * The rule here is the same one the rest of the site uses for facts: publish a
 * date you can point at, or publish nothing. A page with no entry below gets **no
 * `<lastmod>` at all** rather than today's date, and adding it is a one-line
 * change on the day someone edits the page.
 *
 * Sources, in order of what the sitemaps do:
 *   1. this map (hand-maintained, one entry per edit);
 *   2. blog posts → `publishedAt` from the post itself, with an override here
 *      when a post is rewritten after publication;
 *   3. model and comparison pages → the `dataAsOf` the page already prints, which
 *      is the date its numbers were read and therefore the date it changed;
 *   4. anything else → omitted.
 */
export const CONTENT_REVISED: Record<string, string> = {
  // The MiMo-V2.6 line landed in the catalogue on 2026-09-21 and the drift check
  // found two repricings on the 22nd: both changed numbers on these pages.
  "/": "2026-09-22",
  "/comparison": "2026-09-22",
  "/best-openrouter-models": "2026-09-22",
  "/stealth-models": "2026-09-22",
  // New page, written and dated 2026-09-22.
  "/alpha-line-report": "2026-09-22",
  "/typesafe-jev/threads": "2026-09-22",
  "/typesafe-jev/videos": "2026-09-22",
  "/typesafe-jev/demos": "2026-09-22",
  "/typesafe-jev/use-cases/browser-agents": "2026-09-22",
  "/typesafe-jev/use-cases/triage-and-routing": "2026-09-22",
  "/typesafe-jev/use-cases/coding-and-context": "2026-09-22",
  "/typesafe-jev/use-cases/research-and-data": "2026-09-22",
  "/typesafe-jev/use-cases/media-and-content": "2026-09-22",
  "/typesafe-jev/use-cases/trading-and-markets": "2026-09-22",
  "/typesafe-jev/use-cases/getting-started": "2026-09-22",
  "/typesafe-jev/builds": "2026-09-22",
  // First column of the Jev topic: links checked and star counts read this day.
  "/typesafe-jev/resources": "2026-09-22",
  // The Union Alpha reveal (2026-09-18) touched all of these.
  "/faq": "2026-09-18",
  "/alpha-models": "2026-09-18",
  "/union-alpha": "2026-09-18",
  "/union-alpha-free": "2026-09-18",
  "/union-alpha-opencode": "2026-09-18",
  "/union-alpha-not-working": "2026-09-18",
  "/openrouter-free-models": "2026-09-18",
  "/hunter-alpha": "2026-09-18",
  "/ox-alpha": "2026-09-18",
  "/privacy": "2026-09-18",
  "/about": "2026-09-18",
  "/contact": "2026-09-18",
  "/terms": "2026-09-17",
  // Hand-written, and the date it was written. Facts are dated in the page body;
  // this entry moves only when someone re-reads the sources. (Superseded for this path by the
  // 2026-09-24 entry below, which is the day the page was rewritten.)
  /*
   * The 2026-09-24 pass over the Jev topic — the one that turned it into a front page with a wall.
   * Every line below is a page whose content changed that day, and only those: the FAQs moved under
   * the wall on the front page, the reference was split off it, the use-case section was rebuilt
   * twice, statistics changed tier, and open-source was corrected because Laya had made it stale.
   */
  "/typesafe-jev": "2026-09-24",
  "/typesafe-jev/reference": "2026-09-24",
  "/typesafe-jev/use-cases": "2026-09-24",
  "/typesafe-jev/use-cases/jobs": "2026-09-24",
  "/typesafe-jev/statistics": "2026-09-24",
  "/typesafe-jev/open-source": "2026-09-24",
  "/typesafe-jev/x-posts": "2026-09-24",
  "/submit": "2026-09-24",
  // Last edited 2026-09-23 (one definition of the "In short" block, commit 3d3fe46) and untouched
  // since — dated rather than left blank, because the edit is one `git log` away.
  "/typesafe-jev/pricing": "2026-09-23",
  "/typesafe-jev/vs-llm": "2026-09-23",
  // Field notes over eleven repositories, all read on this date.
  "/typesafe-jev/guide": "2026-09-20",
  // The section index for that series.
  "/field-notes": "2026-09-20",

  // Posts rewritten after publication, keyed the way the sitemaps key them.
  "/blog/union-alpha-stealth-model-openrouter": "2026-09-18",
  "/blog/free-ai-models-like-hunter-alpha": "2026-09-18",
  "/blog/hunter-alpha-not-working-fix": "2026-09-18",
  "/blog/openrouter-hunter-alpha-timeout-fix": "2026-09-18",
  "/blog/long-context-ai-models-compared-2026": "2026-09-18",
  "/blog/xiaomi-mimo-v2-chinese-guide": "2026-09-18",
};

/** The revision date for a path, or undefined when we do not actually know. */
export function revisedOn(path: string): string | undefined {
  return CONTENT_REVISED[path];
}

/**
 * `<lastmod>` wants a date, and a date-only value is the honest granularity here:
 * "we edited this on the 18th" is a claim we can support, "at 01:12:00.525Z" is
 * not.
 */
export function lastmodFor(path: string, fallback?: string): string | undefined {
  const value = revisedOn(path) ?? fallback;
  if (!value) return undefined;
  return value.slice(0, 10);
}
