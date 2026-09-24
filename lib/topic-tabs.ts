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
import { JEV_FACET_COUNTS, JEV_ITEMS_TOTAL, JEV_TAGGED_TOTAL } from "./jev-facets";
import { layaBuildCounts } from "./laya-builds";
import { layaVideoCounts } from "./laya-videos";
import { layaXPostCounts } from "./laya-x-posts";
import { layaThreadCounts } from "./laya-threads";
import { layaResourceCounts } from "./laya-resources";
import { LAYA_ITEMS_TOTAL, LAYA_KIND_COUNTS, LAYA_TAGGED_TOTAL } from "./laya-kinds";


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
  /**
   * The second axis, folded into one segment of the bar (2026-09-24).
   *
   * The reference site keeps its use cases in a permanent left rail; we do not have the width for
   * one (see docs/research/2026-09-24-use-case-axis.md) and the reader did not want a rail-sized
   * change. So the second axis is a panel that opens from the bar — six links, with the counts
   * read from the same file the facet pages render.
   *
   * Note what it is: **links to pages**, not a filter. The in-place filtering happens on the wall
   * itself (the front page's chips), because a filter belongs where the cards are; a page belongs
   * where a URL is.
   */
  more?: {
    /** The trigger in the bar: "By use case". */
    label: string;
    /** The panel's own title. */
    heading: string;
    /** One line under it, in the panel. */
    note?: string;
    items: TopicTab[];
    /** The footer link — the section's index, when it has one. */
    more?: { href: string; label: string };
  };
}

export const topicNavs: TopicNav[] = [
  {
    prefix: "/typesafe-jev",
    label: "Jev",
    tabs: [
      { href: "/typesafe-jev", label: "Overview", note: "What Jev is, what it costs, and what we measured ourselves" },
      { href: "/typesafe-jev/reference", label: "Reference", note: "The long version: specs, price, question types, and our own probe" },
      { href: "/typesafe-jev/builds", label: "Built with Jev", count: jevBuildCounts.published },
      { href: "/typesafe-jev/x-posts", label: "X posts", count: jevXPostCounts.described },
      { href: "/typesafe-jev/videos", label: "Videos", count: jevVideoCounts.published },
      { href: "/typesafe-jev/threads", label: "Threads", count: jevThreadCounts.published },
      { href: "/typesafe-jev/resources", label: "Resources", count: jevResourceCounts.total },
      /*
       * No "Use cases" tab any more (2026-09-24, second pass). The panel beside the capsule is that
       * section's front door now, and having both put the same two words in the bar twice — a tab
       * that opened an article called *use cases*, and a panel labelled *use cases* that opened the
       * six facet pages. One name, one place.
       */
    ],
    more: {
      label: "By use case",
      heading: "Use cases",
      /*
       * The line under the heading, and the reason this is a panel and not a menu: the six pages
       * below are the section, each with its own URL and its own search intent ("jev for trading").
       */
      note: `Six pages, one per kind of decision — ${JEV_TAGGED_TOTAL} of the ${JEV_ITEMS_TOTAL} records we hold carry one of them.`,
      items: JEV_FACET_COUNTS.map((facet) => ({
        href: `/typesafe-jev/use-cases/${facet.slug}`,
        label: facet.label,
        count: facet.count,
        note: facet.blurb,
      })),
      more: { href: "/typesafe-jev/use-cases", label: "All use cases" },
    },
  },
  {
    prefix: "/laya",
    label: "Laya",
    tabs: [
      /*
       * Laya's bar was four chapters (overview, vs Jev, self-hosting, open weights) until the topic
       * grew its own columns on 2026-09-24. The chapters are still there — two of them moved under
       * Reference and two stayed — but the bar now carries the catalogue views, because that is what
       * a switcher is for: seeing what the topic holds.
       */
      { href: "/laya", label: "Overview", note: "What Laya is, and what our own run of the weights showed" },
      { href: "/laya/reference", label: "Reference", note: "The long version: checkpoints, limits, and the probe we ran" },
      { href: "/laya/builds", label: "Built with Laya", count: layaBuildCounts.published },
      { href: "/laya/x-posts", label: "X posts", count: layaXPostCounts.described },
      { href: "/laya/videos", label: "Videos", count: layaVideoCounts.published },
      { href: "/laya/threads", label: "Threads", count: layaThreadCounts.published },
      { href: "/laya/resources", label: "Resources", count: layaResourceCounts.total },
    ],
    /*
     * The second axis, and it is deliberately not Jev's. Jev's panel is use cases because its corpus
     * is applications; Laya's first week produced runtimes, servers, agents, games and benchmark
     * arguments, so its panel is kinds of work (ADR-0018). One name, one place: there is no "Kinds"
     * tab as well as a "By kind" panel, for the same reason Jev has no "Use cases" tab.
     */
    more: {
      label: "By kind",
      heading: "Kinds of work",
      note: `Six pages, one per kind of thing built on Laya — ${LAYA_TAGGED_TOTAL} of the ${LAYA_ITEMS_TOTAL} records we hold carry one of them.`,
      items: LAYA_KIND_COUNTS.map((kind) => ({
        href: `/laya/kinds/${kind.slug}`,
        label: kind.label,
        count: kind.count,
        note: kind.blurb,
      })),
      more: { href: "/laya/kinds", label: "All kinds" },
    },
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
