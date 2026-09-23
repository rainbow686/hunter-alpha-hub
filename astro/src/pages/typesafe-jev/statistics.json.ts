/**
 * /typesafe-jev/statistics.json — the report's numbers as data.
 *
 * Generated from `lib/jev-statistics.ts`, the same module the page renders, so a reader who
 * charts this gets exactly what a reader who looks at the page sees. The licence line is in
 * the payload rather than on a separate page, because a citation without one is a citation
 * somebody has to guess at.
 */
import type { APIRoute } from "astro";
import {
  JEV_STATISTICS_CITATION,
  JEV_STATISTICS_LICENSE,
  JEV_STATISTICS_READ_ON,
  catalogued,
  facetDistribution,
  measured,
  queueStats,
} from "@repo/lib/jev-statistics";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: "The Jev catalogue report",
        url: "https://www.hunteralphahub.com/typesafe-jev/statistics",
        publisher: "Hunter Alpha Hub",
        licence: JEV_STATISTICS_LICENSE,
        citation: JEV_STATISTICS_CITATION,
        readOn: JEV_STATISTICS_READ_ON,
        /*
         * Two sections, never merged: `catalogue` describes this reading list, `measured`
         * describes the model. A consumer charting one of them should be able to tell which
         * question it answers without reading our page.
         */
        catalogue: { ...catalogued, sources: queueStats, facets: facetDistribution },
        measured: {
          ...measured,
          note: "measured by Hunter Alpha Hub with astro/scripts/jev-probe.mjs; re-runnable, and not a vendor figure",
        },
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
