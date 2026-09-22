/**
 * /facts.json — every number this site publishes, in one machine-readable place,
 * with the licence that says what you may do with them.
 *
 * Why this exists: a directory whose value is that its numbers are dated and
 * checkable loses that value the moment a reader has to scrape a paragraph to
 * quote it. The reference we looked at (madewithjev.com, teardown in
 * docs/research/2026-09-22-*) publishes its directory counts as a CC BY dataset
 * and writes "free to quote" next to them; the mechanism is cheap and the effect
 * is that assistants and journalists cite the source rather than a paraphrase.
 *
 * Everything below is derived from the libs the pages themselves render:
 * lib/openrouter-models.ts, lib/alpha-line.ts and lib/jev-our-measurements.ts.
 * There is no number in this file that is not also on a page, and no number on a
 * page that is typed here rather than imported.
 */
import type { APIRoute } from "astro";
import { DATA_AS_OF, openrouterModels } from "@repo/lib/openrouter-models";
import { ALPHA_LINE_CITATION, ALPHA_LINE_LICENSE, alphaLineEntries, alphaLineStats } from "@repo/lib/alpha-line";
import {
  JEV_OURS_MEASURED_ON,
  JEV_OURS_SAMPLES,
  oursAmbiguity,
  oursLabelStability,
  oursLatency,
  oursPhrasing,
  oursSchemaProbe,
} from "@repo/lib/jev-our-measurements";
import { JEV_INPUT_PRICE_PER_MILLION, JEV_MODEL_ID } from "@repo/lib/jev";

export const prerender = true;

const site = "https://www.hunteralphahub.com";

export const GET: APIRoute = () => {
  const inputs = openrouterModels.map((model) => model.inputPricePerMillion);
  const cheapestInput = openrouterModels.reduce((best, model) =>
    model.inputPricePerMillion < best.inputPricePerMillion ? model : best,
  );
  const largestContext = openrouterModels.reduce((best, model) =>
    model.contextWindow > best.contextWindow ? model : best,
  );
  const free = openrouterModels.filter((model) =>
    model.bestFor.includes("Free"),
  ).length;

  return new Response(
    JSON.stringify(
      {
        site: {
          name: "OpenRouter Model Hub",
          url: site,
          what: "A dated directory of models served by OpenRouter, plus a register of the anonymous stealth releases on that catalogue, plus our own measurements of TypeSafe's Jev.",
          licence: ALPHA_LINE_LICENSE,
          terms: `Free to quote, chart and reprint with a link to ${site}. Models and prices are read from the public OpenRouter catalogue and re-checked by npm run sync-models, which fails on any mismatch.`,
          cite_as: ALPHA_LINE_CITATION,
        },
        model_snapshot: {
          data_as_of: DATA_AS_OF,
          source: "https://openrouter.ai/api/v1/models",
          curated_models: openrouterModels.length,
          free_tier_models: free,
          cheapest_input_per_million: {
            model: cheapestInput.name,
            slug: cheapestInput.slug,
            price: cheapestInput.inputPricePerMillion,
          },
          largest_context: {
            model: largestContext.name,
            slug: largestContext.slug,
            tokens: largestContext.contextWindow,
          },
          input_price_range_per_million: {
            min: Math.min(...inputs),
            max: Math.max(...inputs),
          },
        },
        alpha_line: {
          what: "Anonymous stealth model releases on OpenRouter — a codename appears with no maker and no price, then is claimed, renamed and repriced.",
          data_as_of: alphaLineStats.dataAsOf,
          codenames_documented: alphaLineStats.count,
          median_days_to_makers_listing: alphaLineStats.medianWindowDays,
          days_to_listing: alphaLineStats.windows,
          free_while_anonymous: alphaLineStats.freeWhileAnonymous,
          free_now: alphaLineStats.stillFreeAfterReveal,
          post_reveal_input_price_range_per_million: {
            min: alphaLineStats.inputPriceFloor,
            max: alphaLineStats.inputPriceCeiling,
            spread_factor: alphaLineStats.priceSpreadFactor,
          },
          gaps_between_codenames_days: alphaLineStats.gaps.map((gap) => gap.days),
          rows: alphaLineEntries.map((entry) => ({
            codename: entry.codename,
            first_listed: entry.firstListed,
            maker_listing_added: entry.productAdded,
            identity_disclosed: entry.disclosed,
            turned_out_to_be: entry.became,
            model_id: entry.modelId,
            price_per_million: {
              input: entry.inputPricePerMillion,
              output: entry.outputPricePerMillion,
              cached_input: entry.cachedInputPricePerMillion ?? null,
            },
            page: `${site}${entry.href}`,
          })),
          report: `${site}/alpha-line-report`,
          full_dataset: `${site}/alpha-line-report.json`,
        },
        jev: {
          what: "TypeSafe's System One model: text state in, typed decisions out. Below is what we measured ourselves with a key we own — the one kind of number on this site that nobody else publishes.",
          model_id: JEV_MODEL_ID,
          measured_on: JEV_OURS_MEASURED_ON,
          input_price_per_million: JEV_INPUT_PRICE_PER_MILLION,
          output_price: "free",
          identical_calls: {
            calls: JEV_OURS_SAMPLES,
            label_chosen: oursLabelStability.label,
            label_changed: oursLabelStability.of - oursLabelStability.runs,
            wall_time_median_ms: oursLatency.median,
          },
          schema_probe: {
            measured_on: oursSchemaProbe.measuredOn,
            runs: oursSchemaProbe.runs,
            calls_per_run: oursSchemaProbe.calls,
            answers_outside_the_option_set: oursSchemaProbe.offMenuAnswers,
            empty_state_still_answered_at: oursSchemaProbe.emptyState.confidence,
          },
          confidence_vs_ambiguity: {
            measured_on: oursAmbiguity.measuredOn,
            runs: oursAmbiguity.runs,
            unambiguous: {
              items: oursAmbiguity.clear.n,
              mean_confidence: oursAmbiguity.clear.meanConfidence,
            },
            deliberately_arguable: {
              items: oursAmbiguity.ambiguous.n,
              mean_confidence: oursAmbiguity.ambiguous.meanConfidence,
              spread: oursAmbiguity.ambiguousSpread,
              spread_second_run: oursAmbiguity.repeat.ambiguousSpread,
            },
            limitation: oursAmbiguity.limitation,
          },
          scale_wording: {
            measured_on: oursPhrasing.measuredOn,
            items: oursPhrasing.items,
            calls: oursPhrasing.calls,
            mean_absolute_difference_in_levels: oursPhrasing.meanAbsDelta,
            ranking_pairs_changed: oursPhrasing.orderAgreement.pairs - oursPhrasing.orderAgreement.agreed,
            ranking_pairs: oursPhrasing.orderAgreement.pairs,
          },
          page: `${site}/typesafe-jev`,
          method: `${site}/typesafe-jev#our-run`,
          probe_source: "astro/scripts/jev-probe.mjs (cases in jev-probe-cases.json)",
        },
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
};
