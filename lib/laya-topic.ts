/**
 * The Laya topic's directory, in one place — the same module shape as lib/jev-topic.ts, with the
 * columns this topic actually has. Every page under /laya renders it at the foot.
 *
 * The explainers that predate this build (`/laya/vs-jev`, `/laya/self-hosting`,
 * `/laya/open-weights`) are listed here beside the columns. They were written before the columns
 * existed and they answer the questions the columns raise — which model to run, what it costs to
 * run it, and what the licence lets you do — so they belong in the directory rather than under a
 * separate heading.
 */
import { LAYA_KIND_COUNTS } from "./laya-kinds";
import { layaBuildCounts } from "./laya-builds";
import { layaThreadCounts } from "./laya-threads";
import { layaVideoCounts } from "./laya-videos";
import { layaXPostCounts } from "./laya-x-posts";
import { layaResourceCounts } from "./laya-resources";

export interface LayaTopicEntry {
  href: string;
  label: string;
  group: string;
  count?: number;
  blurb?: string;
}

export const layaTopicColumns: LayaTopicEntry[] = [
  { href: "/laya", label: "Laya, the reference", group: "Start here", blurb: "What it is, what we measured running it, and what it is not." },
  { href: "/laya/vs-jev", label: "Laya and Jev, compared", group: "Start here", blurb: "The two models on the same questions, including the ones Laya loses." },
  { href: "/laya/builds", label: "Built with Laya", group: "Columns", count: layaBuildCounts.published, blurb: "Ports, servers, agents and games, with what we checked." },
  { href: "/laya/x-posts", label: "What X is saying", group: "Columns", count: layaXPostCounts.described },
  { href: "/laya/videos", label: "What people filmed", group: "Columns", count: layaVideoCounts.published },
  { href: "/laya/threads", label: "What Hacker News made of it", group: "Columns", count: layaThreadCounts.published },
  { href: "/laya/resources", label: "Docs, weights and reading", group: "Columns", count: layaResourceCounts.total },
  { href: "/laya/kinds", label: "Every record, by kind of work", group: "The topic", blurb: "The same rows cut a second way, across every column." },
  { href: "/laya/self-hosting", label: "What self-hosting costs", group: "The topic", blurb: "Hardware, memory, and the failure modes of running it yourself." },
  { href: "/laya/open-weights", label: "What the licence allows", group: "The topic", blurb: "Apache-2.0 weights, three checkpoints, and the limits that come with them." },
];

export const layaTopicKinds: LayaTopicEntry[] = LAYA_KIND_COUNTS.map((kind) => ({
  href: `/laya/kinds/${kind.slug}`,
  label: kind.label,
  group: "By kind of work",
  count: kind.count,
  blurb: kind.blurb,
}));

export const layaTopicEntries: LayaTopicEntry[] = [...layaTopicColumns, ...layaTopicKinds];
