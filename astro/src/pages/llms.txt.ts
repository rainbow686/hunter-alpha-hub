/**
 * /llms.txt — the machine-readable summary of this site.
 *
 * What it is for: when an assistant answers "how many stealth models has
 * OpenRouter had" or "what does Jev cost", it should be able to read one small
 * file and get the same numbers a reader gets, with the date attached and the
 * licence stated, instead of scraping a paragraph and dropping the caveat.
 *
 * The convention is a proposal, not a standard, and it costs nothing: the file is
 * built from the same libs as the pages, so it cannot drift, and if the convention
 * dies the file does no harm.
 *
 * Reference we looked at: madewithjev.com/llms.txt (teardown in docs/research/).
 * The thing worth copying there is not the filename — it is that every sentence is
 * a fact with a date and a link, rather than a description of the site.
 */
import type { APIRoute } from "astro";
import { DATA_AS_OF, openrouterModels } from "@repo/lib/openrouter-models";
import { ALPHA_LINE_CITATION, ALPHA_LINE_LICENSE, alphaLineEntries, alphaLineStats } from "@repo/lib/alpha-line";
import { JEV_OURS_MEASURED_ON, JEV_OURS_SAMPLES, oursAmbiguity, oursLatency, oursSchemaProbe } from "@repo/lib/jev-our-measurements";
import { JEV_INPUT_PRICE_PER_MILLION } from "@repo/lib/jev";
import { JEV_RESOURCES_READ_ON, jevResourceCounts } from "@repo/lib/jev-resources";
import { LAYA_OURS_MEASURED_ON, determinism, latencyCpu, noul, schemaProbe, temperatureClamp } from "@repo/lib/laya-our-measurements";
import { LAYA_LICENSE } from "@repo/lib/laya";
import { layaBuildCounts } from "@repo/lib/laya-builds";
import { layaXPostCounts } from "@repo/lib/laya-x-posts";
import { JEV_THREADS_READ_ON, jevThreadCounts } from "@repo/lib/jev-threads";
import { JEV_VIDEOS_READ_ON, jevVideoCounts } from "@repo/lib/jev-videos";
import { JEV_BUILDS_READ_ON, jevBuildCounts } from "@repo/lib/jev-builds";

export const prerender = true;

const BASE = "https://www.hunteralphahub.com";
const stats = alphaLineStats;

export const GET: APIRoute = () => {
  const cheapest = openrouterModels.reduce((best, model) =>
    model.inputPricePerMillion < best.inputPricePerMillion ? model : best,
  );
  const largest = openrouterModels.reduce((best, model) =>
    model.contextWindow > best.contextWindow ? model : best,
  );

  const body = `# OpenRouter Model Hub

> A dated directory of ${openrouterModels.length} models served by OpenRouter, a register of the anonymous stealth releases on that catalogue, and our own first-hand measurements of TypeSafe's Jev and of Laya, the open-weight System One model that answers Jev's protocol. Prices, context windows and modalities are read from the public catalogue and re-checked by a drift check that fails on any mismatch. Last verified ${DATA_AS_OF}.

Every fact below is dated, sourced and free to quote under ${ALPHA_LINE_LICENSE} with a link to ${BASE}. The same numbers, as data: ${BASE}/facts.json

## Citable facts

- **Anonymous stealth models on OpenRouter, documented:** ${stats.count} — Hunter Alpha, OX Alpha and Union Alpha. Median ${stats.medianWindowDays} days from the codename appearing to the maker's own listing (${stats.windows.join(", ")} days); ${stats.freeWhileAnonymous} of ${stats.freeWhileAnonymous} were free while anonymous and ${stats.stillFreeAfterReveal} are free now; post-reveal input prices span ${stats.priceSpreadFactor}x, from $${stats.inputPriceFloor} to $${stats.inputPriceCeiling} per million tokens. Read ${stats.dataAsOf}. Source: ${BASE}/alpha-line-report (data: ${BASE}/alpha-line-report.json).
- **What each codename became:** ${alphaLineEntries.map((entry) => `${entry.codename} → ${entry.became} (${entry.firstListed})`).join("; ")}.
- **The Alpha line runs on a fixed script:** a model appears with no maker and no price, is claimed and renamed within days, and the free window ends at or before the reveal. The line has produced ${stats.count} codenames since March 2026, with ${stats.gaps.map((gap) => gap.days).join(" and ")} days between them.
- **Curated model snapshot (${DATA_AS_OF}):** ${openrouterModels.length} models, cheapest input $${cheapest.inputPricePerMillion} per million (${cheapest.name}), largest window ${largest.contextWindow.toLocaleString("en-US")} tokens (${largest.name}). Source: ${BASE}/comparison.
- **Jev, measured by us on ${JEV_OURS_MEASURED_ON}:** ${JEV_OURS_SAMPLES} byte-identical calls, the chosen label never changed (${oursLatency.median} ms median wall time). In ${oursSchemaProbe.calls} adversarial calls run ${oursSchemaProbe.runs} times, ${oursSchemaProbe.offMenuAnswers} answers left the option set the caller defined — but an empty state still answered, at ${oursSchemaProbe.emptyState.confidence}. Confidence tracked how arguable the input was: mean ${oursAmbiguity.clear.meanConfidence} on ${oursAmbiguity.clear.n} unambiguous tickets against ${oursAmbiguity.ambiguous.meanConfidence} on ${oursAmbiguity.ambiguous.n} deliberately arguable ones. Source: ${BASE}/typesafe-jev#our-run.
- **Jev price:** $${JEV_INPUT_PRICE_PER_MILLION} per million input tokens, output free, no free tier. Source: ${BASE}/typesafe-jev.
- **Laya, measured by us on ${LAYA_OURS_MEASURED_ON}:** we downloaded the ${LAYA_LICENSE} weights and ran them on our own CPU. ${determinism.calls} identical calls returned the same label and the same probabilities, identical to four decimals — the range across every signal was ${determinism.signals[0].range.toFixed(4)}. In ${schemaProbe.cases} adversarial cases run ${schemaProbe.runs} times, ${schemaProbe.offMenuAnswers} answers left the option set the caller defined, and the Jev client we already had parsed ${schemaProbe.dropIn.http200} of ${schemaProbe.dropIn.calls} answers from its local server without a change. One question cost ${latencyCpu[0].p50} s; fifty in one call cost ${latencyCpu[2].perQuestion} s each. Source: ${BASE}/laya.
- **Laya, where it fails (we reproduced both):** the \`noul\` primitive followed its own two labels instead of the state — five reviews, three of them glowing, every one answered "no" (${noul.english.value}) at confidence ${noul.english.confidence} — and the shipped \`${temperatureClamp.bucket}\` temperature is ${temperatureClamp.shipped}, outside the range its own library accepts, so it is clamped to ${temperatureClamp.applied} and the confidence from those calls is not calibrated. Source: ${BASE}/laya/reference.

## Pages

- [The Alpha Line Report](${BASE}/alpha-line-report): every anonymous release with dates, the arithmetic on window lengths and what the reveals did to the price. JSON at ${BASE}/alpha-line-report.json.
- [Stealth models register](${BASE}/stealth-models): one row per codename, with the fields you can re-check in the catalogue.
- [Alpha models explained](${BASE}/alpha-models): why these releases are staged this way, and how to evaluate the next one.
- [Jev on OpenRouter](${BASE}/typesafe-jev): specs, price, question types, and the measurements above with their method.
- [Jev resources](${BASE}/typesafe-jev/resources): the vendor docs and listings, ${jevResourceCounts.collection} community collections and ${jevResourceCounts.tool} repositories — every link checked and every star count read on ${JEV_RESOURCES_READ_ON}.
- [Jev discussion](${BASE}/typesafe-jev/threads): ${jevThreadCounts.published} Hacker News threads, with score and comment count read on ${JEV_THREADS_READ_ON}.
- [Jev by use case](${BASE}/typesafe-jev/use-cases): the decisions people hand to Jev — sorting, triage, routing, context, judging, verification — with the projects and posts that show each one.
- [Jev on X](${BASE}/typesafe-jev/x-posts): what the field is saying — vendor announcements, benchmarks, sceptics — each with a sentence of ours and a link.
- [The Jev catalogue report](${BASE}/typesafe-jev/statistics): what we counted and what we measured, with our own probe results (CC BY 4.0, JSON at /typesafe-jev/statistics.json).
- [Jev builds](${BASE}/typesafe-jev/builds): ${jevBuildCounts.published} projects built on Jev, stars and last push read on ${JEV_BUILDS_READ_ON}.
- [Jev videos](${BASE}/typesafe-jev/videos): ${jevVideoCounts.published} walkthroughs and breakdowns, views read on ${JEV_VIDEOS_READ_ON}.
- [Jev field notes](${BASE}/typesafe-jev/guide): eleven projects built on Jev, read first-hand, and the line all five independent implementations drew between what the model decides and what the code decides.
- [Laya](${BASE}/laya): the open-weight System One model — what it is, where it runs, and the measurements above.
- [Laya, specified](${BASE}/laya/reference): the three checkpoints, the limits the model card admits to, and our full probe of the weights.
- [Built with Laya](${BASE}/laya/builds): ${layaBuildCounts.published} projects from the model's first week — MLX and Core ML ports, Jev-compatible servers, agents and games.
- [Laya on X](${BASE}/laya/x-posts): ${layaXPostCounts.described} posts, each read in full — including the test that found the faster model letting attacks through that the slower one caught.
- [Laya resources](${BASE}/laya/resources): the repository, all three sets of weights, the package, and two demos you can open without installing anything.
- [Compare models](${BASE}/comparison): every curated model side by side on price, window and modality.
- [Free models](${BASE}/openrouter-free-models): the free routes on the catalogue, re-checked against the API.
- [Cost calculator](${BASE}/openrouter-pricing-calculator): monthly spend by token volume and input/output mix.
- [About](${BASE}/about): who runs this, what gets published, and how corrections work.

## Method

- Prices, windows and modalities come from \`https://openrouter.ai/api/v1/models\`, re-checked by \`npm run sync-models\`, which exits non-zero on drift. It caught two repricings on ${DATA_AS_OF} — Z.ai GLM 5.3 Flash across the board and DeepSeek V4 Flash's output price — and both are published as changed.
- Measurements described as ours were run from our own machine with our own API key; the method, the cost and the raw response are on the page, and the probe is reproducible from \`astro/scripts/jev-probe.mjs\`.
- Numbers published by someone else are labelled as theirs, with the source linked. Where we could not verify something, the page says so instead of rounding it over.

Licence: ${ALPHA_LINE_LICENSE}. Cite as: ${ALPHA_LINE_CITATION}
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
