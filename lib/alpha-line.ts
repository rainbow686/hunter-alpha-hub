/**
 * The Alpha line, as a dataset rather than as prose.
 *
 * Why this exists as its own file: /alpha-line-report, its JSON twin and
 * /llms.txt all quote the same numbers, and this site's rule is that a number is
 * published from exactly one place. The conflict this avoids is not theoretical —
 * on 2026-09-22 the drift check found two models repriced and one page still
 * carried the old figure in a table while another carried it in a sentence.
 *
 * What counts as an entry: a codename we can tie to a public OpenRouter listing,
 * before and after. Three qualify. Forum names we cannot tie to a listing are
 * deliberately absent, which is why the count here is small — see the page's
 * "what this report cannot tell you" section, which is the other half of the
 * claim.
 *
 * Dates, and why there are two of them per entry:
 *   `firstListed`  the day the codename appeared in the catalogue. Ours, from the
 *                  page we wrote when it happened.
 *   `productAdded` the day the maker's own model id was created — the catalogue's
 *                  own `created` field, readable for every row here, which is why
 *                  it is the column the day-count is computed from.
 *   `disclosed`    the day the maker was named publicly, where we have a source.
 *                  For Hunter Alpha this is 11 days before the listing appeared,
 *                  which is the whole reason the two are separate columns instead
 *                  of one "reveal date".
 */

export interface AlphaLineEntry {
  codename: string;
  /** The page we keep for this codename. */
  href: string;
  firstListed: string;
  /** Day the maker's own model id was created in the catalogue. */
  productAdded: string;
  /** Day the maker was named publicly, where we have a source for it. */
  disclosed: string | null;
  became: string;
  /** The id that resolves today. */
  modelId: string;
  contextWindow: number;
  modalities: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  cachedInputPricePerMillion?: number;
  /** What the reveal did to the price, in one line. */
  priceStory: string;
  notes: string[];
}

const DAY = 86_400_000;

/** Whole days between two ISO dates. Exported because the page prints it. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / DAY);
}

export const alphaLineEntries: AlphaLineEntry[] = [
  {
    codename: "Hunter Alpha",
    href: "/hunter-alpha",
    firstListed: "2026-03-12",
    productAdded: "2026-04-22",
    disclosed: "2026-03-23",
    became: "Xiaomi MiMo-V2.5",
    modelId: "xiaomi/mimo-v2.5",
    contextWindow: 1_050_000,
    modalities: "Text, image, audio, video",
    inputPricePerMillion: 0.14,
    outputPricePerMillion: 0.28,
    cachedInputPricePerMillion: 0.0028,
    priceStory:
      "Free for 11 days, then disclosed and repriced. The listing under Xiaomi's own name appeared 30 days after that.",
    notes: [
      "The line's first codename, and the only one where the identity was disclosed well before the model was listed under the maker's name",
      "Now in its second generation: MiMo-V2.6-Pro and MiMo-V2.6-Flash were listed on 2026-09-21, five months after the codename resolved",
    ],
  },
  {
    codename: "OX Alpha",
    href: "/ox-alpha",
    firstListed: "2026-08-20",
    productAdded: "2026-08-26",
    disclosed: null,
    became: "Z.ai GLM 5.3 Flash",
    modelId: "z-ai/glm-5.3-flash",
    contextWindow: 1_310_720,
    modalities: "Text, image, video",
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.5,
    cachedInputPricePerMillion: 0.05,
    priceStory:
      "Free while anonymous, repriced at the reveal, then repriced again on 2026-09-22: input up 67%, output up 67%, cached input up 178%.",
    notes: [
      "The largest window of the three at 1.31M tokens",
      "We never had a clickable source for the disclosure day, so that column is blank rather than estimated",
    ],
  },
  {
    codename: "Union Alpha",
    href: "/union-alpha",
    firstListed: "2026-09-16",
    productAdded: "2026-09-17",
    disclosed: "2026-09-18",
    became: "Unbiased Pareto",
    modelId: "unbiased/pareto",
    contextWindow: 262_144,
    modalities: "Text, image",
    inputPricePerMillion: 2.5,
    outputPricePerMillion: 7.5,
    cachedInputPricePerMillion: 0.25,
    priceStory:
      "Free for two days, then delisted and repriced at 18x the input price of the cheapest model in the line.",
    notes: [
      "The shortest window of the three: listed 2026-09-16 14:42 UTC, revealed 2026-09-18",
      "The first in the line to accept images, and the first whose maker was named on OpenRouter's own stealth page rather than inferred",
      "The most expensive: $2.50 in / $7.50 out per million against $0.14 / $0.28 for the cheapest",
    ],
  },
];

/**
 * The numbers the report exists to publish. Derived, never typed twice: if a date
 * above changes, the summary paragraph, the JSON and llms.txt all move with it.
 */
export const alphaLineStats = (() => {
  const windows = alphaLineEntries.map((entry) => daysBetween(entry.firstListed, entry.productAdded));
  const sorted = [...windows].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;

  const gaps: { from: string; to: string; days: number }[] = [];
  for (let index = 1; index < alphaLineEntries.length; index += 1) {
    const previous = alphaLineEntries[index - 1];
    const current = alphaLineEntries[index];
    gaps.push({ from: previous.codename, to: current.codename, days: daysBetween(previous.firstListed, current.firstListed) });
  }

  const inputs = alphaLineEntries.map((entry) => entry.inputPricePerMillion);
  const disclosed = alphaLineEntries.filter((entry) => entry.disclosed !== null).length;

  return {
    /** How many codenames we can point at a listing for, before and after. */
    count: alphaLineEntries.length,
    /** Days from codename to the maker's own listing, per entry. */
    windows,
    medianWindowDays: median,
    fastestWindowDays: Math.min(...windows),
    slowestWindowDays: Math.max(...windows),
    /** Codenames where we have a source for the day the maker was named. */
    disclosedCount: disclosed,
    /** Every one was free while anonymous and none stayed free. */
    freeWhileAnonymous: alphaLineEntries.length,
    stillFreeAfterReveal: 0,
    inputPriceFloor: Math.min(...inputs),
    inputPriceCeiling: Math.max(...inputs),
    /** Ceiling ÷ floor, rounded to one decimal. */
    priceSpreadFactor: Math.round((Math.max(...inputs) / Math.min(...inputs)) * 10) / 10,
    gaps,
    /** Read from the catalogue by `npm run sync-models` on this date. */
    dataAsOf: "2026-09-22",
  };
})();

/** The report's own citation line, printed on the page and in the JSON. */
export const ALPHA_LINE_CITATION =
  "Hunter Alpha Hub, “The Alpha Line Report”, hunteralphahub.com/alpha-line-report, read 2026-09-22.";

export const ALPHA_LINE_LICENSE = "CC BY 4.0";
