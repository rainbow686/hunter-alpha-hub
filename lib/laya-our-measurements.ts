/**
 * What we measured on Laya ourselves, on 2026-09-24, on the machine the work
 * happened on: an Intel i7-8550U (four cores, eight threads, 1.8 GHz, a 2018
 * laptop part), 15 GB of RAM, no GPU, torch reading four threads. Python 3.12.3,
 * `laya` 0.3.11, transformers 5.17.0, torch 2.14.0+cpu.
 *
 * Why these numbers exist: every Laya comparison in circulation is either the
 * publisher's or Jev's. Nobody had run both through the same cases. We already
 * had the cases — `astro/scripts/jev-probe-cases.json` is the file our Jev client
 * sends — so the Laya run uses those exact payloads, and the drop-in test points
 * that same client at `laya-serve`. The runner is in the repository
 * (`tools/laya-lab/laya-probe.py`) so the run can be repeated by anyone with a
 * laptop and a spare half hour.
 *
 * What this is not: a benchmark. Six tickets is not a benchmark, one machine is
 * not a benchmark, and a CPU is not a T4. Where a difference could be noise we
 * say so in the row rather than in a footnote.
 */

export const LAYA_OURS_MEASURED_ON = "2026-09-24";

/** Environment, so the latency rows can be read against something concrete. */
export const environment = {
  machine: "Intel i7-8550U, 4 cores / 8 threads, 2018 laptop part",
  memory: "15 GB",
  accelerator: "none — CPU only, torch intra-op threads 4",
  python: "3.12.3",
  laya: "0.3.11",
  transformers: "5.17.0",
  torch: "2.14.0+cpu",
  install:
    "torch from the CPU wheel index, then `pip install \"laya[serve]\"`; the default torch pull is the CUDA build, 2.7 GB of wheels for a model that runs on a CPU",
  weights: "2.3 GB for all three checkpoints; 843 MB for the English one alone, encoder included",
  noKeyNeeded: true,
};

/**
 * Twenty byte-identical calls — the same experiment we ran on Jev on 2026-09-20.
 *
 * The comparison that matters is not the values, it is the spread. Over twenty
 * identical calls Jev's label never moved but its confidence ranged 0.38–0.58,
 * which crosses the vendor's own routing bands. Laya's four signals were
 * identical to four decimals on all twenty calls.
 */
export const determinism = {
  calls: 20,
  labels: "technical, 20 of 20",
  signals: [
    { signal: "Noul P(urgent)", value: 0.753, range: 0, sd: 0 },
    { signal: "Score frustration (0–4)", value: 2.4512, range: 0, sd: 0 },
    { signal: "Choice P(technical)", value: 0.7832, range: 0, sd: 0 },
    { signal: "Choice confidence", value: 0.4636, range: 0, sd: 0 },
  ],
  // The Jev figures, from lib/jev-our-measurements.ts, so the two sit side by side.
  jevComparison: {
    labels: "technical, 20 of 20",
    confidence: "0.38–0.58 (range 0.20, sd 0.050)",
  },
};

/**
 * Wall clock on this CPU, three questions per call.
 *
 * The cost per question is flat from ten questions up — batching is doing what
 * the card says it does — and a single question costs about a third of a second
 * on a 2018 laptop. Jev's measured 783 ms median includes a round trip to Asia's
 * edge; this number includes nothing but arithmetic, so the two are not the same
 * measurement and the page says so where it prints them.
 */
export const latencyCpu = [
  { questions: 1, p50: 0.302, perQuestion: 0.302, note: "the least flattering case: no batching" },
  { questions: 10, p50: 2.088, perQuestion: 0.209, note: "" },
  { questions: 50, p50: 10.409, perQuestion: 0.208, note: "flat from here up" },
];

/**
 * The thirteen adversarial cases we wrote against Jev, sent to Laya unchanged
 * through our own Jev client (`--endpoint http://…/v1/systemone`), four runs
 * each.
 *
 * Two results, and the second one is the interesting one: no answer ever left
 * the option set (52 calls), and on eleven of the thirteen cases Laya returned
 * the same label Jev returned. `jevLabel` is from the same run we published for
 * Jev; the two that differ are marked.
 */
export interface LayaAttempt {
  attempt: string;
  allowed: string;
  laya: string;
  confidence: number;
  jev: string;
  same: boolean;
}

export const schemaProbe = {
  cases: 13,
  runs: 4,
  calls: 52,
  offMenuAnswers: 0,
  unstableLabels: 0,
  /** Same payloads, through HTTP, against the local server rather than the library. */
  dropIn: {
    http200: 13,
    calls: 13,
    client: "astro/scripts/jev-probe.mjs, the same client we point at Jev",
    parseable: "all thirteen answered in the envelope the client already parses",
    latencyMs: { min: 135, median: 293, max: 1814 },
  },
  attempts: [
    { attempt: "An option that was never offered", allowed: "billing / shipping / technical / returns", laya: "returns", confidence: 0.0834, jev: "billing", same: false },
    { attempt: "Instructions inside the state", allowed: "the same four", laya: "technical", confidence: 0.0953, jev: "technical", same: true },
    { attempt: "A forged system line", allowed: "the same four", laya: "billing", confidence: 0.6702, jev: "billing", same: true },
    { attempt: "Three options that nearly mean the same thing", allowed: "billing / invoices / payments", laya: "billing", confidence: 0.2408, jev: "billing", same: true },
    { attempt: "A single option", allowed: "one", laya: "billing", confidence: 1, jev: "billing", same: true },
    { attempt: "An empty state", allowed: "the same four", laya: "returns", confidence: 0.0347, jev: "technical", same: false },
    { attempt: "Ten thousand characters of log lines", allowed: "the same four", laya: "technical", confidence: 0.0199, jev: "technical", same: true },
    { attempt: "A Chinese state against English options", allowed: "the same four", laya: "shipping", confidence: 0.3397, jev: "shipping", same: true },
    { attempt: "Numeric option keys", allowed: "\"1\" / \"2\" / \"3\"", laya: "\"1\"", confidence: 0.8341, jev: "\"1\"", same: true },
    { attempt: "A question that asks for raw JSON", allowed: "the same four", laya: "shipping", confidence: 0.6351, jev: "shipping", same: true },
    { attempt: "A criteria map that is crossed over", allowed: "billing / technical, swapped", laya: "billing", confidence: 0.0544, jev: "billing", same: true },
    { attempt: "Ten options, none of them described", allowed: "team1 … team10", laya: "team1", confidence: 0.6573, jev: "team1", same: true },
    { attempt: "Punctuation in the question name", allowed: "the same four", laya: "returns", confidence: 0.2856, jev: "returns", same: true },
  ] as LayaAttempt[],
  note:
    "The two differences are both cases where the state is about cancelling or about nothing at all: Laya answers `returns` where Jev answers `billing`, and `returns` where Jev answers `technical`. In both, Laya's confidence was 0.083 and 0.035 — the two lowest numbers in the run.",
};

/**
 * Does confidence track how arguable the input is? The same thirty clear tickets
 * and ten deliberately arguable ones we sent Jev, against the same four options.
 *
 * The separation is much weaker than Jev's — 0.48 against 0.41, where Jev
 * produced 0.97 against 0.71 — and the absolute numbers are lower across the
 * board. Two of the thirty clear tickets got a wrong answer, against none of
 * Jev's. One run, so treat the means as a direction rather than a figure.
 */
export const ambiguity = {
  clear: { n: 30, defensible: 28, meanConfidence: 0.484, range: "0.030–0.903" },
  arguable: { n: 10, defensible: 10, meanConfidence: 0.411, range: "0.179–0.658" },
  jevComparison: { clear: 0.97, arguable: 0.71 },
};

/**
 * Does the wording of an ordinal scale move the score? Twelve reports, scored
 * twice: once with levels described by situation, once with levels described only
 * by how strong they are.
 *
 * Laya moves more than Jev did on this test — mean |Δ| 0.47 against 0.19, and the
 * ordering of the twelve changed for one pair in six.
 */
export const phrasing = {
  items: 12,
  calls: 24,
  meanAbsDelta: 0.466,
  jevMeanAbsDelta: 0.19,
  orderAgreement: { agreed: 50, pairs: 66 },
  jevOrderAgreement: { agreed: 55, pairs: 66 },
  largestMove: {
    item: "The export button does nothing when clicked; copy-paste works instead.",
    situational: 1.4764,
    degree: 0.5956,
  },
};

/**
 * Option-set size, with a known right answer: six unmistakable tickets, each run
 * against 4 / 10 / 20 / 21 / 30 candidate intents drawn from one pool, the right
 * one always present.
 *
 * Accuracy does not collapse here — this is a 30-label set, not Banking77's 77,
 * and the tickets name their own intent — but confidence climbs as the option set
 * grows, which is the opposite of what a reader would guess and the opposite of
 * what the card's own calibration story implies. The last column takes the fitted
 * temperature back out to show how much of that climb is the model and how much
 * is the calibration layer.
 */
export const optionSetSize = [
  { options: 4, correct: 4, of: 6, published: 0.692, untempered: 0.864, temperature: "1.760" },
  { options: 10, correct: 5, of: 6, published: 0.95, untempered: 0.95, temperature: "1.000" },
  { options: 20, correct: 5, of: 6, published: 0.949, untempered: 0.917, temperature: "0.5 (clamped)" },
  { options: 21, correct: 5, of: 6, published: 0.973, untempered: 0.931, temperature: "0.5 (clamped)" },
  { options: 30, correct: 5, of: 6, published: 0.959, untempered: 0.893, temperature: "0.5 (clamped)" },
];

/**
 * The temperature table that ships inside the checkpoint against the one the
 * library actually applies.
 *
 * `choice:11+` is 0.1006 in the artifact. A temperature below 1 multiplies the
 * logits, so that value would sharpen roughly tenfold; the library refuses it,
 * clamps to 0.5, and warns on load that confidence from that bucket is
 * uncalibrated. The consequence is concrete: the calibration the model card
 * advertises (mean ECE 0.466 → 0.081) is fitted per bucket, and for the one
 * bucket that governs every choice question with eleven or more options, the
 * value is not being used.
 */
export const temperatureClamp = {
  bucket: "choice:11+",
  shipped: 0.1006,
  applied: 0.5,
  warning:
    "this checkpoint ships invalid temperatures or values outside [0.5, 5]; using choice:11+=0.10058280825614929 -> 0.5. Treat confidence from the affected entries as uncalibrated.",
  otherBuckets: [
    { bucket: "choice:2", shipped: 1.9064, applied: 1.9064 },
    { bucket: "choice:3-5", shipped: 1.7602, applied: 1.7602 },
    { bucket: "choice:6-10", shipped: 1.0000, applied: 1.0000 },
    { bucket: "noul:2", shipped: 1.9834, applied: 1.9834 },
    { bucket: "score:3-5", shipped: 1.2514, applied: 1.2514 },
  ],
};

/**
 * The `noul` primitive, on the question the model card warns about.
 *
 * The card says `noul` can follow its own two level labels instead of the state,
 * "most strongly on this English checkpoint", and offers a two-option `choice`
 * with neutral keys as the workaround. It is not a subtle failure: on five
 * reviews — three glowing, two damning — the English checkpoint returned 0.000
 * with confidence 1.0 every time, which is the maximum-confidence version of
 * saying "no" to a positive review. The workaround works: with the same question
 * as a choice between "A: yes…" and "B: no…", all five came back on the right
 * side.
 */
export const noul = {
  question: "Is this review positive?",
  english: { calls: 5, saidPositive: 0, confidence: "1.0 on all five", value: 0 },
  multilingual: { calls: 3, correct: 2, miss: "a glowing review at 0.085 with confidence 0.915" },
  asChoice: { calls: 5, correct: 5, probabilities: "P(yes) 0.66–0.78 on the positive three, 0.004 and 0.0005 on the negative two" },
  /** The same English checkpoint on a different noul question: not degenerate. */
  controlRun: { question: "Is this ticket urgent?", value: 0.753, note: "from the determinism run — the failure is not every noul question" },
};

/**
 * Six tickets, twenty options, the same discriminative words in every label, and
 * a neutral sentence appended to each. The model card blames the high-cardinality
 * weakness on the fixed per-option token budget, so padding the labels is the
 * direct test of that explanation.
 *
 * It moved one item out of six. On six tickets that is noise, and it is written
 * here as noise rather than as a result — reproducing the card's 77-label
 * collapse would need the card's benchmark, not ours.
 */
export const padding = {
  shortLabels: { correct: 5, of: 6, meanConfidence: 0.949, words: "~2" },
  paddedLabels: { correct: 4, of: 6, meanConfidence: 0.941, words: "~27" },
  verdict: "inconclusive at this sample size",
};

/**
 * What the HTTP surface does that the raw checkpoint does not: it routes.
 *
 * The Chinese-state case is the one to read. Sent to the English checkpoint
 * directly, it answers `billing`; sent through `laya-serve`, the router detects
 * the script and answers from the multilingual checkpoint instead — `shipping`,
 * the same label Jev returned. Anyone benchmarking "Laya" against a specific
 * checkpoint is measuring a different thing from anyone calling the server.
 */
export const routing = {
  /** The English checkpoint, loaded by hand, answered this one `billing` at 0.34. */
  englishCheckpointOnChineseState: { label: "billing", confidence: 0.3397 },
  /** The same state through `laya-serve`: the router reads the script and switches. */
  served: {
    label: "shipping",
    confidence: 0.9974,
    probability: 0.9996,
    checkpoint: "multilingual",
    reason: "non-Latin script (han, 100% of letters); the English checkpoint cannot read it",
  },
};
