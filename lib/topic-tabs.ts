/**
 * The switcher that sits under the header on every page of a model topic.
 *
 * Why this exists, and why it is not the page's own directory:
 *
 * The reader's complaint (2026-09-24) was that the topic's categories were *links that
 * made you leave the page* — "来回跳很烦". Measured against the site they asked us to
 * copy, the diagnosis changed: madewithjev's chips are links too (clicking `GitHub 275`
 * loads `/github-repos`, 287 cards, its own h1). What makes that feel like tabs instead
 * of a maze is that the chip bar **never goes away** — it is sticky on `/`, on
 * `/github-repos` and on `/x-posts`, with the same counts in the same places.
 *
 * So the fix was never an in-page filter; it is a persistent switcher. That is this file:
 * the level-1 views of a topic, in one order, with the counts read from the same data the
 * pages render (a typed count is a count that goes wrong — this site has already printed
 * "15 models tracked" for a week).
 *
 * What belongs here: the **catalogue views** (what the topic holds, one question each).
 * What does not: the explainers (guide, pricing, vs-llm, open source, statistics). Those
 * are reading, not switching, and the topic directory at the foot of every page already
 * carries them with their blurbs.
 *
 * The count is optional because a topic need not have any: Laya's four pages are chapters,
 * not shelves, and a number invented to fill the slot is exactly the kind of label this
 * site exists to avoid.
 */
import { jevBuildCounts } from "./jev-builds";
import { jevVideoCounts } from "./jev-videos";
import { jevXPostCounts } from "./jev-x-posts";
import { jevThreadCounts } from "./jev-threads";
import { jevResourceCounts } from "./jev-resources";


export interface TopicTab {
  href: string;
  label: string;
  count?: number;
  /** The tooltip, for a tab whose label is a shorthand. */
  note?: string;
}

export interface TopicNav {
  /** The topic's namespace. Every page under it gets this switcher. */
  prefix: string;
  /** Used in the bar's `aria-label`: "Jev topic". */
  label: string;
  tabs: TopicTab[];
}

export const topicNavs: TopicNav[] = [
  {
    prefix: "/typesafe-jev",
    label: "Jev",
    tabs: [
      { href: "/typesafe-jev", label: "Overview", note: "What Jev is, what it costs, and what we measured ourselves" },
      { href: "/typesafe-jev/builds", label: "Built with Jev", count: jevBuildCounts.published },
      { href: "/typesafe-jev/x-posts", label: "X posts", count: jevXPostCounts.described },
      { href: "/typesafe-jev/videos", label: "Videos", count: jevVideoCounts.published },
      { href: "/typesafe-jev/threads", label: "Threads", count: jevThreadCounts.published },
      { href: "/typesafe-jev/resources", label: "Resources", count: jevResourceCounts.total },
      /*
       * No count on this one, on purpose. The page it opens is the article ("the nine jobs
       * people hand to a decision model"); the number of *facet pages* behind it is six, and
       * a "6" next to a page that says nine is the kind of disagreement this site is not
       * allowed to print. A tab with no number promises nothing.
       */
      { href: "/typesafe-jev/use-cases", label: "Use cases" },
    ],
  },
  {
    prefix: "/laya",
    label: "Laya",
    tabs: [
      { href: "/laya", label: "Overview", note: "What Laya is, and what our own run of the weights showed" },
      { href: "/laya/vs-jev", label: "vs Jev" },
      { href: "/laya/self-hosting", label: "Self-hosting" },
      { href: "/laya/open-weights", label: "Open weights" },
    ],
  },
];

/**
 * The topic a pathname belongs to, or undefined.
 *
 * Trailing slashes are stripped first: `/typesafe-jev/` and `/typesafe-jev` are the same
 * page to a reader and must be the same page to this function, or the switcher disappears
 * on whichever form a crawler happened to keep.
 *
 * The `.html` strip is not belt-and-braces. Astro's file-format build hands a component
 * `Astro.url.pathname === "/typesafe-jev.html"` on the topic's front page (and
 * `/typesafe-jev/x-posts.html` on the column), which made this function answer "none" for
 * exactly the two pages that most need a switcher. The components pass a normalised path
 * (`astro/src/lib/page-path.ts`); this is the second seat belt because the failure was
 * silent and asymmetrical, the worst combination to debug.
 */
const normalise = (pathname: string): string =>
  pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/+$/, "") || "/";

export function topicNavFor(pathname: string): TopicNav | undefined {
  const path = normalise(pathname);
  return topicNavs.find((topic) => path === topic.prefix || path.startsWith(`${topic.prefix}/`));
}

/**
 * The tab a pathname is on — prefix-aware, so a record page two levels down
 * (`/typesafe-jev/x-posts/jev-clearly-explained`) still says "X posts".
 *
 * "Overview" is the exception: it is the prefix itself, so it matches only exactly.
 * Without that, every page in the topic would claim to be the overview.
 */
export function tabForPath(topic: TopicNav, pathname: string): TopicTab | undefined {
  const path = normalise(pathname);
  return topic.tabs.find((tab) =>
    tab.href === topic.prefix ? path === tab.href : path === tab.href || path.startsWith(`${tab.href}/`),
  );
}
