/**
 * Laya (Convai Innovations) — reference data for /laya.
 *
 * Everything here was read from a primary source on 2026-09-24: the model card
 * and the files that ship with it (we downloaded `convaiinnovations/laya` and
 * opened them), the repository's own evaluation output (`eval/results.md`), the
 * published benchmark tables, and the model card's own "Honest Limits" section.
 * Nothing is taken from the coverage; where a number is the publisher's we say
 * so, and where it is Jev's we say whose it is.
 *
 * The one thing this file is careful about: the model card's headline comparison
 * table mixes two kinds of number. Columns for Laya are the publisher's own
 * measurements; columns for Jev are third-party figures the publisher has never
 * reproduced (the card says so in the line above the table). Both are labelled.
 */

export const LAYA_READ_ON = "2026-09-24";

export const LAYA_GITHUB_URL = "https://github.com/NandhaKishorM/laya";
export const LAYA_HF_URL = "https://huggingface.co/convaiinnovations/laya";
export const LAYA_PYPI_URL = "https://pypi.org/project/laya/";
export const LAYA_LICENSE = "Apache-2.0";
export const LAYA_MAKER = "Convai Innovations";

/** PyPI's newest release the day we installed it; the 0.3.x line is the current one. */
export const LAYA_PACKAGE_VERSION = "0.3.11";

export interface LayaCheckpoint {
  repo: string;
  name: string;
  backbone: string;
  params: string;
  context: string;
  /** The state budget left after the options take their share (max_len − head_max_len). */
  stateBudget: string;
  bestAt: string;
}

/**
 * The three checkpoints, as the model card lists them. `stateBudget` is the part
 * that surprises people: on the English checkpoint the 512-token window is split,
 * so a long ticket is truncated at roughly 320 tokens even though the model page
 * says 512.
 */
export const checkpoints: LayaCheckpoint[] = [
  {
    repo: "convaiinnovations/laya",
    name: "laya",
    backbone: "ModernBERT-large",
    params: "421M",
    context: "512",
    stateBudget: "~320 tokens",
    bestAt: "English text, guardrails, email triage",
  },
  {
    repo: "convaiinnovations/laya-multilingual",
    name: "laya-multilingual",
    backbone: "mmBERT-base",
    params: "322M",
    context: "1,024",
    stateBudget: "~768 tokens",
    bestAt: "100+ languages; about 2.2× the English one",
  },
  {
    repo: "convaiinnovations/laya-typed-decisions",
    name: "laya-typed-decisions",
    backbone: "ModernBERT-large",
    params: "421M",
    context: "1,024",
    stateBudget: "~768 tokens",
    bestAt: "the four typed-decision workflows the card benchmarks",
  },
];

/** What the package ships beyond the weights, read from the model card on 2026-09-24. */
export const shippedWith = [
  "An HTTP server that speaks TypeSafe's wire protocol — `pip install \"laya[serve]\"`, then `laya-serve`, which answers `POST /v1/systemone`.",
  "A TypeScript package (`laya-ts`) for Node and the browser, documented as returning the same answers as the Python one.",
  "An MCP server, and LangChain / LangGraph integrations, as optional extras.",
  "`Router()`, which detects the script of the incoming state and picks a checkpoint for you.",
];

/**
 * The publisher's own comparison table, both directions.
 *
 * Read this as two tables stapled together: `laya` numbers are the publisher's,
 * `jev` numbers are third-party and were, in the publisher's words, never
 * measured by them. The rows where the publisher loses are kept, because a
 * comparison that only prints the winning side is marketing.
 */
export interface PublishedComparison {
  metric: string;
  jev: string;
  laya: string;
  note?: string;
  /** True when Jev leads, so the page can stop pretending the table is one colour. */
  jevLeads?: boolean;
}

export const publishedComparison: PublishedComparison[] = [
  { metric: "typed-decisions, 2,000 decisions", jev: "0.727", laya: "0.766", note: "above the 0.735 teacher self-agreement ceiling" },
  { metric: "AG News, 4 labels", jev: "0.910", laya: "0.950" },
  { metric: "DAIR Emotion, 6 labels", jev: "0.480", laya: "0.595", note: "on the same set, Jev gave the true label zero probability on 16% of items" },
  { metric: "Banking77 (72 vs 77 labels)", jev: "0.870", laya: "0.425", jevLeads: true, note: "the publisher's explanation is a fixed per-option token budget — see below" },
  { metric: "Soft distribution match", jev: "0.580", laya: "0.471", jevLeads: true },
  { metric: "ECE, lower is better", jev: "0.246", laya: "0.081", note: "after one temperature per question type and option count is fitted" },
  { metric: "p50 latency, 1 question", jev: "236–276 ms", laya: "32.8 ms", note: "Jev's figure is third-party; the publisher states it never had API access" },
];

/** The card's own list of where it does not work, in the card's own terms. */
export const honestLimits = [
  "The base checkpoints are near chance on typed-decisions zero-shot: 0.362 (English) and 0.352 (multilingual) against a 0.318 random and a 0.461 majority-class baseline. The 0.766 belongs to the checkpoint fine-tuned on that benchmark's own training split.",
  "Options share a fixed token budget, so 77 options get about three to four tokens each. The card calls this out, reports the 0.425 that results, and suggests raising `head_max_len` or splitting into a coarse-to-fine choice.",
  "An ordinal `score` question is the weakest of the three primitives — 0.372 on SST-5, in the card's numbers.",
  "`noul` can follow its two level labels instead of the state. The card names the issue (#156), scopes it to the English checkpoint, and offers a two-option `choice` as the workaround.",
  "`action.act_probability` carries no usable signal: 1.0 for almost every input, AUROC 0.30 against correctness on 396 labelled decisions (#185). The card says to gate on `confidence` instead.",
  "It ships over-confident. Fitting one temperature per question type and option count moves mean ECE from 0.466 to 0.081 — which is where the headline calibration number comes from, and the card says to refit on your own data before trusting it.",
];

/**
 * The training configuration that ships in the checkpoint (`rl_agent_config.json`).
 *
 * Read straight out of the downloaded artifact rather than the paper trail: the
 * scale of the fine-tune is the most useful thing on this page for judging what
 * the weights are, and it is not in the marketing table.
 */
export const trainingConfig = {
  encoder: "answerdotai/ModernBERT-large",
  headLayers: 2,
  updates: 7313,
  epochs: 1,
  hours: 1.96,
  worldSize: 1,
  point:
    "A two-layer head on a frozen-in-place encoder, 7,313 updates over one epoch in about two hours on one machine.",
};

/**
 * The ecosystem, checked 2026-09-24.
 *
 * The star count is read off the repository page rather than the REST API, which
 * answered 403 for us on the day (rate limit). It is also the one number on this
 * page that moves fast: it was 19,196 when the research note was written on
 * 2026-09-23, and 20,346 the next morning. Both figures are dated in the places
 * they appear — a star count without a date is not a fact, it is a feeling.
 */
export const ecosystem = {
  created: "2026-09-18",
  stars: 20346,
  /** Read from the API on 2026-09-23; the page does not publish a fork count. */
  forks: 1632,
  contributors: 40,
  commits: 125,
  /** The star *history* could not be corroborated: GitHub's timeline endpoint 404s for this repo. */
  starsUnverified: true,
  ports: [
    "An MLX port for Apple silicon.",
    "A Lambda + SnapStart port, so the same weights answer from a cold serverless start.",
    "`laya-ts`, for Node and the browser.",
  ],
};

export interface LayaFaq {
  question: string;
  answer: string;
}

export const layaFaqs: LayaFaq[] = [
  {
    question: "What is Laya?",
    answer:
      "An open-weight decision model: a state and a set of typed questions go in, and one forward pass returns typed answers with probabilities. It does not generate text, and it is the same three question types Jev uses — choice, score and noul. The English checkpoint is a 421M-parameter ModernBERT-large with a two-layer head, published under Apache-2.0.",
  },
  {
    question: "Is Laya a drop-in replacement for Jev?",
    answer:
      "Its server speaks TypeSafe's wire protocol, and a client written for Jev parses the responses — we pointed our own Jev probe at it and all thirteen adversarial cases came back as valid answers. The envelope carries extra fields a strict client would reject, and the answer to a non-Latin state comes from a different checkpoint than the one the request named.",
  },
  {
    question: "Can I run Laya without a GPU?",
    answer:
      "Yes. On one CPU core set we measured a 1-question call at 0.30 s median, ten questions at 2.09 s and fifty at 10.4 s — about 0.21 s per question, flat. The weights download is roughly 1.2 GB including the encoder.",
  },
  {
    question: "Is Laya free for commercial use?",
    answer:
      "The model card's frontmatter says apache-2.0, for the checkpoints and for the code, and the card lists commercial use among its tags. What that does not cover is the training data or the benchmark suites the card reports against; those are the publisher's, and the numbers are theirs to defend.",
  },
  {
    question: "Is Laya better than Jev?",
    answer:
      "On the publisher's own benchmarks it wins the accuracy rows it printed and loses the high-cardinality one, and the Jev side of that table was never measured by them. We ran the two models through the same thirteen adversarial cases and they returned the same label on eleven of them. Anyone claiming a winner from those numbers is claiming it from two different rulers.",
  },
];
