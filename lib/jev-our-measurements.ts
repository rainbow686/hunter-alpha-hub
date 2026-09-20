/**
 * What we measured ourselves, on 2026-09-20, with a key we own.
 *
 * This is the first first-hand data on the site. Everything else Jev-related
 * here is either read from a catalogue or quoted from someone else's repository;
 * these numbers came out of our own terminal, and the method is written down so
 * they can be argued with.
 *
 * Method, in full:
 *   - 20 calls, byte-identical request body, no `uid` (the top-level `uid` that
 *     TypeSafe's own self-consistency cookbooks send is rejected by the current
 *     API with HTTP 400 "Invalid request" — tested 2026-09-20, top level only).
 *   - one state (a support ticket about a failing Stripe connection),
 *     three questions at once — one Noul, one Choice, one Score.
 *   - measured from a single machine in Asia; wall time includes TLS, DNS and
 *     network, so it is not comparable to the vendor's 70–500 ms figure, which
 *     is quoted from their own machines.
 *
 * The finding that matters: the label never moved, and the confidence moved
 * across the vendor's own three-band guidance. That is a routing bug waiting in
 * anybody's integration, and it is the reason this file exists.
 */

export const JEV_OURS_MEASURED_ON = "2026-09-20";
export const JEV_OURS_SAMPLES = 20;

export interface OurSpread {
  signal: string;
  min: number;
  max: number;
  sd: number;
  digits: number;
}

export const oursSpread: OurSpread[] = [
  { signal: "Noul — P(urgency)", min: 0.98, max: 0.98, sd: 0.0, digits: 3 },
  { signal: "Score — frustration level", min: 1.03, max: 1.04, sd: 0.005, digits: 3 },
  { signal: "Choice — P(technical)", min: 0.59, max: 0.73, sd: 0.034, digits: 2 },
  { signal: "Choice — confidence", min: 0.38, max: 0.58, sd: 0.05, digits: 2 },
];

export const oursLatency = {
  median: 783,
  min: 647,
  max: 1030,
  note: "wall time per call, one machine in Asia, TLS and network included",
};

export const oursUsage = {
  inputTokens: 420,
  outputTokens: 71,
  /** $0.042 per million input tokens, output free — the price the catalogue lists. */
  costPerCallUsd: (420 / 1_000_000) * 0.042,
  costForExperimentUsd: (420 * JEV_OURS_SAMPLES / 1_000_000) * 0.042,
};

/** The label the model chose, in all 20 runs. It never once changed. */
export const oursLabelStability = { label: "technical", runs: 20, of: 20 };

/**
 * The raw shape of one answer, as returned — trimmed to the three answers and
 * the usage block, and reproduced exactly. This is the part of the response
 * nobody publishes: it shows that a Noul carries no confidence field, that a
 * Score returns a fractional position rather than a level index, and that a
 * Choice's confidence can sit far below its top probability.
 */
export const oursSampleResponse = {
  model: "jev-1.13.0",
  answers: {
    urgency: { type: "noul", noul: 0.98 },
    department: {
      type: "choice",
      choice: "technical",
      confidence: 0.38,
      probabilities: { sales: 0.0, technical: 0.59, billing: 0.41 },
    },
    frustration: {
      type: "score",
      score: 1.04,
      confidence: 0.94,
      legend: { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      probabilities: { "0": 0.0, "1": 0.96, "2": 0.04 },
    },
  },
  usage: { input_tokens: 420, output_tokens: 71 },
} as const;

/**
 * What we ran locally, at no cost, on 2026-09-20.
 *
 * Cloning and testing a repository is the cheapest check there is, and it
 * answers a question the page could not otherwise answer: does this thing even
 * build? Thirty-one green tests is a modest claim and we are making exactly that
 * claim — offline tests, not a live run.
 */
export const oursOffline = {
  repo: "browser-use/jev-ultrafast",
  repoUrl: "https://github.com/browser-use/jev-ultrafast",
  tests: 31,
  seconds: 0.44,
  command: "uv sync && uv run pytest -q",
  ranOn: "2026-09-20",
  /**
   * Stated rather than glossed: the live agent was not run. Its browser harness
   * needs a daemon attached to a real Chrome, and the live path wants a
   * text-helper key on a second account. Neither is worth spending on a claim
   * the page does not need.
   */
  liveRunNotAttempted:
    "the live browser agent — its harness daemon was not running here, and the live path wants a second API key we chose not to spend",
} as const;
