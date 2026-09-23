/**
 * The nine jobs people hand to Jev, for the use-case article.
 *
 * Structure copied from the reference site's `/jev-use-cases` (read on 2026-09-23): an
 * "In short" box of real numbers, a one-row-per-job table, then a section per job with
 * real cards in the prose, then "by the work you do" pointing at the facet pages. What is
 * ours: every job below is grounded in rows we actually catalogued, and each one names the
 * row that shows it. None of the nine is here because the taxonomy looked tidy.
 *
 * `examples` are queue ids, resolved through `jevItemById` so a page cannot cite a row that
 * was rejected later — a missing id throws at build time instead of rendering a dead card.
 */
export interface JevJob {
  slug: string;
  /** The job in the imperative, the way a reader would say it. */
  title: string;
  /** One line under the heading. */
  lede: string;
  /** Two or three sentences of our own. No numbers here — the numbers are in the rows. */
  body: string;
  examples: string[];
}

export const jevJobs: JevJob[] = [
  {
    slug: "sort-and-triage",
    title: "Sort a pile that is too big to read",
    lede: "Classification, at a volume where reading each item was never on the table.",
    body:
      "This is the job the model was built for and the one most of this topic's rows land in: " +
      "a corpus, a queue or an inbox where a wrong answer is recoverable and a slow answer is not. " +
      "The pattern that keeps working is small questions with named answers, decided in parallel, " +
      "with the rule for combining them kept in code you can read.",
    examples: ["yt:X117w2Rark8", "gh:TianyuCodings/NanoJev", "x:2100859307671855113"],
  },
  {
    slug: "pick-the-next-step",
    title: "Pick the next step in an agent loop",
    lede: "The decision that used to be a chat completion, once per click.",
    body:
      "An agent loop asks the same question all day: of everything on this screen, what is the next " +
      "thing to do? Answering it with a chat model means paying for prose nobody reads. Answering it " +
      "with a decision model means the loop gets an operation and a target, and the program decides " +
      "what to do when it is unsure.",
    examples: ["gh:browser-use/jev-ultrafast", "gh:awlevin/typesafe-computer-use", "gh:Sac-Y/Jev-cu"],
  },
  {
    slug: "shrink-the-context",
    title: "Shrink what the model has to read",
    lede: "Deletion instead of paraphrase, so a file path cannot be summarised away.",
    body:
      "Context windows get filled by tool calls and their output, most of which stops mattering within " +
      "minutes. Scoring each item and dropping the stale ones keeps the exact text of everything that " +
      "stays — which is a different promise from a summary, and a better one when the cost of losing " +
      "one exact string is a wrong answer twenty turns later.",
    examples: ["gh:tamaratran/fast-jev-compaction", "gh:TianyuCodings/NanoJev"],
  },
  {
    slug: "judge-every-row",
    title: "Judge every row where the data already is",
    lede: "Evaluation, moderation, labelling: the same decision, run on the whole table.",
    body:
      "Judging with a chat model costs a generation per row, which is why teams judge a sample and hope. " +
      "When the judgement is a handful of bounded choices, the whole table becomes affordable — and the " +
      "judgements become reviewable, because each one is a label with a confidence rather than a paragraph.",
    examples: ["hn:49780849", "x:2102087107410002345", "gh:devagrawal09/jev-review"],
  },
  {
    slug: "check-before-ship",
    title: "Check the work before it ships",
    lede: "A decision model above the agent, asking whether the agent is actually finished.",
    body:
      "The most consistent pattern in the field notes: the team that builds the thing is not the team " +
      "that checks it. A decision model is a cheap second opinion — complete or not, requirements met or " +
      "not, test sufficient or not — and it can run on every change rather than at the end of a sprint.",
    examples: ["gh:reticlehq/reticle", "gh:thruwire/foreman", "hn:49757757"],
  },
  {
    slug: "block-the-risky-step",
    title: "Block the step you should not take",
    lede: "A gate in front of the action, not a paragraph warning about it.",
    body:
      "A typed decision is easy to enforce: if the answer is high risk, the program stops. That is a " +
      "different kind of safety from asking a model to be careful, because the model is never the thing " +
      "that decides whether to proceed — it only grades what it was shown.",
    examples: ["gh:Sac-Y/Jev-cu", "x:2100362415187833048"],
  },
  {
    slug: "decide-in-a-loop",
    title: "Decide inside a frame",
    lede: "Real-time loops, where the model has tens of milliseconds and one action.",
    body:
      "Games and robotics are the honest stress test of the whole idea: the decision is small, the clock " +
      "is merciless, and the result is either a working run or a recording of one. The open models in this " +
      "column give up accuracy against the hosted one and win on latency and cost, which is the trade to " +
      "make explicitly rather than by accident.",
    examples: ["gh:wfzyx/von", "gh:rmalde/minecraft-agent"],
  },
  {
    slug: "decide-with-money",
    title: "Decide with money on a clock",
    lede: "Buy or sell, every block, with the consequence attached.",
    body:
      "Trading is where a decision model earns its keep if it earns it anywhere: the cadence is fixed, " +
      "the answer is binary, and nobody wants a paragraph in the loop. The repositories here are careful " +
      "about the distinction that matters — the model chooses, the program prices and sends, and the " +
      "default is a dry run.",
    examples: ["gh:jarrodwatts/jev-trader", "gh:OpenByteInc/QuantDinger"],
  },
  {
    slug: "choose-what-to-show",
    title: "Choose what to show someone",
    lede: "Ranking and selection: which sources, which rows, which result.",
    body:
      "Search and recommendation are the same decision as routing — pick from a candidate set, show your " +
      "reasoning as a score — and they are the version a reader can check by using it, because a search " +
      "result is right or wrong in front of them.",
    examples: ["gh:superagents-lab/jev-search", "gh:featherless-ai/simple-jev"],
  },
];
