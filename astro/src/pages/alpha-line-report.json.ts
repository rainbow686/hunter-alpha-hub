/**
 * /alpha-line-report.json — the report's rows as data, for anyone who wants to
 * chart them rather than read them.
 *
 * Built from `lib/alpha-line.ts`, the same source the page renders, so the JSON
 * and the HTML cannot disagree. That is the point of publishing it: an assistant
 * or a journalist citing this should get the same numbers the reader sees, and
 * the licence line tells them what they are allowed to do with them.
 */
import type { APIRoute } from "astro";
import {
  ALPHA_LINE_CITATION,
  ALPHA_LINE_LICENSE,
  alphaLineEntries,
  alphaLineStats,
  daysBetween,
} from "@repo/lib/alpha-line";

export const prerender = true;

const stats = alphaLineStats;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: "The Alpha Line Report",
        url: "https://www.hunteralphahub.com/alpha-line-report",
        publisher: "Hunter Alpha Hub",
        licence: ALPHA_LINE_LICENSE,
        terms: `Free to quote, chart and reprint with a link to https://www.hunteralphahub.com/alpha-line-report. Cite as: ${ALPHA_LINE_CITATION}`,
        subject: "Anonymous stealth model releases on OpenRouter, 2026",
        measured: stats.dataAsOf,
        note: "Dates and prices are read from the public OpenRouter catalogue and re-checked by `npm run sync-models`. Day counts are whole days between the two dates in each row, computed at build time.",
        summary: {
          codenames: stats.count,
          medianDaysToMakerListing: stats.medianWindowDays,
          daysToListing: stats.windows,
          fastestDays: stats.fastestWindowDays,
          slowestDays: stats.slowestWindowDays,
          freeWhileAnonymous: stats.freeWhileAnonymous,
          freeNow: stats.stillFreeAfterReveal,
          inputPriceFloorPerMillion: stats.inputPriceFloor,
          inputPriceCeilingPerMillion: stats.inputPriceCeiling,
          priceSpreadFactor: stats.priceSpreadFactor,
          gapsBetweenCodenamesDays: stats.gaps.map((gap) => ({
            from: gap.from,
            to: gap.to,
            days: gap.days,
          })),
        },
        rows: alphaLineEntries.map((entry) => ({
          codename: entry.codename,
          page: `https://www.hunteralphahub.com${entry.href}`,
          firstListed: entry.firstListed,
          makerListingAdded: entry.productAdded,
          identityDisclosed: entry.disclosed,
          daysToListing: daysBetween(entry.firstListed, entry.productAdded),
          turnedOutToBe: entry.became,
          modelId: entry.modelId,
          contextWindow: entry.contextWindow,
          modalities: entry.modalities,
          freeWhileAnonymous: true,
          freeNow: false,
          pricePerMillion: {
            input: entry.inputPricePerMillion,
            output: entry.outputPricePerMillion,
            cachedInput: entry.cachedInputPricePerMillion ?? null,
          },
          priceStory: entry.priceStory,
        })),
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
