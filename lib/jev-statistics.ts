/**
 * The numbers behind /typesafe-jev/statistics, in one place so the page and the JSON
 * endpoint cannot disagree.
 *
 * Two kinds of number live here, and the page keeps them apart on purpose:
 *
 *   - **what we catalogued** — counts over the four queues, which move every day the
 *     intake runs, and the facet distribution;
 *   - **what we measured** — the probe results from `lib/jev-our-measurements.ts`, which
 *     are ours and do not move unless we re-run the probe.
 *
 * Mixing the two in one "stats" table is how a report starts lying: readers cannot tell
 * which number they can quote as a fact about the model and which is a fact about our
 * reading list. Every section below says which one it is.
 */
import buildsQueue from "./data/jev-builds.json";
import threadsQueue from "./data/jev-threads.json";
import videosQueue from "./data/jev-videos.json";
import xPostsQueue from "./data/jev-x-posts.json";
import { JEV_FACET_COUNTS, JEV_ITEMS_TOTAL, JEV_TAGGED_TOTAL } from "./jev-facets";
import { jevBuildCounts } from "./jev-builds";
import { JEV_OURS_MEASURED_ON, oursLatency, oursSchemaProbe, oursUsage } from "./jev-our-measurements";

export const JEV_STATISTICS_READ_ON: string = (buildsQueue as { meta: { generatedAt: string } }).meta.generatedAt.slice(0, 10);
export const JEV_STATISTICS_LICENSE = "CC BY 4.0";

type Queue = {
  meta: { candidates: number; candidatesRemaining?: number };
  entries: { status: string; tags?: string[] }[];
};

const queues: { name: string; slug: string; queue: Queue }[] = [
  { name: "GitHub projects", slug: "builds", queue: buildsQueue as Queue },
  { name: "Hacker News threads", slug: "threads", queue: threadsQueue as Queue },
  { name: "YouTube videos", slug: "videos", queue: videosQueue as Queue },
  { name: "X posts", slug: "x-posts", queue: xPostsQueue as Queue },
];

export interface QueueStat {
  name: string;
  slug: string;
  published: number;
  candidates: number;
  rejected: number;
  waiting: number;
}

export const queueStats: QueueStat[] = queues.map(({ name, slug, queue }) => {
  const byStatus = (status: string) => queue.entries.filter((e) => e.status === status).length;
  return {
    name,
    slug,
    published: byStatus("published"),
    rejected: byStatus("rejected"),
    waiting: queue.meta.candidatesRemaining ?? 0,
    candidates: queue.entries.length,
  };
});

export const catalogued = {
  published: queueStats.reduce((sum, q) => sum + q.published, 0),
  rejected: queueStats.reduce((sum, q) => sum + q.rejected, 0),
  waiting: queueStats.reduce((sum, q) => sum + q.waiting, 0),
  rows: queueStats.reduce((sum, q) => sum + q.candidates, 0),
  tagged: JEV_TAGGED_TOTAL,
  facets: JEV_FACET_COUNTS.length,
  withPages: jevBuildCounts.withPages,
};

export const facetDistribution = JEV_FACET_COUNTS.map((facet) => ({ slug: facet.slug, label: facet.label, count: facet.count }));

export const measured = {
  readOn: JEV_OURS_MEASURED_ON,
  probe: {
    calls: oursSchemaProbe.calls,
    runs: oursSchemaProbe.runs,
    offMenuAnswers: oursSchemaProbe.offMenuAnswers,
    injectionsAttempted: oursSchemaProbe.injectionsAttempted,
    measuredOn: oursSchemaProbe.measuredOn,
  },
  latency: { median: oursLatency.median, min: oursLatency.min, max: oursLatency.max, note: oursLatency.note },
  usage: {
    inputTokens: oursUsage.inputTokens,
    outputTokens: oursUsage.outputTokens,
    costPerCallUsd: oursUsage.costPerCallUsd,
    costForExperimentUsd: oursUsage.costForExperimentUsd,
  },
};

export const JEV_STATISTICS_CITATION =
  "Hunter Alpha Hub, The Jev catalogue report, " +
  "https://www.hunteralphahub.com/typesafe-jev/statistics";

export { JEV_ITEMS_TOTAL };
