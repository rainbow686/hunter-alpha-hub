/**
 * The Jev topic's directory, in one place.
 *
 * Every page in the topic renders the same list at its foot: the columns on one shelf,
 * the use-case facets on another, each with the count it actually has. Two reasons it is
 * a module and not markup repeated in six pages:
 *
 *   - a count typed into a page is a count that goes wrong (this site has already printed
 *     "15 models tracked" for a week after the catalogue grew); here the counts are read
 *     from the same data the pages render;
 *   - the reference site keeps its directory in a persistent rail. We keep the function —
 *     "from anywhere, the whole topic" — and put it in the page instead of the frame,
 *     because our prose column is the frozen layout (ADR-0019) and a rail would narrow it.
 */
import { JEV_FACET_COUNTS } from "./jev-facets";
import { jevBuildCounts } from "./jev-builds";
import { jevThreadCounts } from "./jev-threads";
import { jevVideoCounts } from "./jev-videos";
import { jevXPostCounts } from "./jev-x-posts";
import { jevResourceCounts } from "./jev-resources";

export interface TopicEntry {
  href: string;
  label: string;
  group: string;
  count?: number;
  blurb?: string;
}

export const jevTopicColumns: TopicEntry[] = [
  { href: "/typesafe-jev", label: "Jev, the reference", group: "Start here", blurb: "What it is, what it costs, what we measured." },
  { href: "/jev-guide", label: "How people actually use it", group: "Start here", blurb: "Eleven projects read line by line." },
  { href: "/typesafe-jev/builds", label: "What people built", group: "Columns", count: jevBuildCounts.published },
  { href: "/typesafe-jev/resources", label: "Docs, collections and repositories", group: "Columns", count: jevResourceCounts.total },
  { href: "/typesafe-jev/threads", label: "What Hacker News made of it", group: "Columns", count: jevThreadCounts.published },
  { href: "/typesafe-jev/videos", label: "What people filmed", group: "Columns", count: jevVideoCounts.published },
  { href: "/typesafe-jev/x-posts", label: "What X is saying", group: "Columns", count: jevXPostCounts.described },
  { href: "/typesafe-jev/statistics", label: "The catalogue report", group: "The topic", blurb: "What we counted and what we measured, with the JSON." },
];

export const jevTopicFacets: TopicEntry[] = JEV_FACET_COUNTS.map((facet) => ({
  href: `/typesafe-jev/use-cases/${facet.slug}`,
  label: facet.label,
  group: "By use case",
  count: facet.count,
  blurb: facet.blurb,
}));

export const jevTopicEntries: TopicEntry[] = [...jevTopicColumns, ...jevTopicFacets];

/** Tags per item, keyed by the id the queue uses — the chip counts and the `data-tags`
 *  attribute both read this, so a filter chip can never disagree with the cards. */
export const jevTagCounts: { slug: string; label: string; count: number }[] = JEV_FACET_COUNTS;
export { JEV_FACET_COUNTS };
