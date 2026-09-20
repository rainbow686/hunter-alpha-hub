/**
 * /jev-guide — field notes on how Jev is actually being used.
 *
 * Everything here was read on 2026-09-20 from the repositories themselves:
 * READMEs, `docs/performance.md`, the limits sections, and the benchmark buried
 * in a repository with no stars. We ran none of it, and the page says so.
 *
 * Two rules for this file:
 *   1. A star count is a snapshot with a date, never a live claim.
 *   2. A quote is verbatim, and it carries the URL of the file it came from.
 *      If a project later edits the sentence, the page is wrong and should be
 *      updated — which is the honest failure mode, not a silent one.
 */

export const JEV_GUIDE_READ_AS_OF = "2026-09-20";

export interface Repo {
  name: string;
  url: string;
  stars: number;
  what: string;
  note?: string;
}

/**
 * A GitHub search for the obvious terms (`jev typesafe OR jev ultrafast`)
 * returns twelve repositories. `jkudish/jev-browser` — 146 stars, the
 * second-highest here — is not one of them: its description says "TypeSafe's
 * Jev", and the tokeniser does not match that against `typesafe`. It was found
 * in a comparison table inside another repository. That is the whole argument
 * for reading a field rather than querying it.
 */
export const repositories: Repo[] = [
  {
    name: "browser-use/jev-ultrafast",
    url: "https://github.com/browser-use/jev-ultrafast",
    stars: 8457,
    what: "The one that started it. Browser Use's own ultrafast agent.",
    note: "Description is three words: “i. am. speed.”",
  },
  {
    name: "jkudish/jev-browser",
    url: "https://github.com/jkudish/jev-browser",
    stars: 146,
    what: "A headless browser driven through an MCP server, a CLI, or a library.",
    note: "Missing from the obvious GitHub search — see the note above.",
  },
  {
    name: "jiawei686/jev-ultrafast-mcp",
    url: "https://github.com/jiawei686/jev-ultrafast-mcp",
    stars: 4,
    what: "An MCP server, so your existing agent hands the browser work off.",
    note: "Ships a screenshot of an OpenRouter bill: one cent for a whole day.",
  },
  {
    name: "chy4pro/jev-for-chrome",
    url: "https://github.com/chy4pro/jev-for-chrome",
    stars: 2,
    what: "A Chrome extension that drives the tab you are looking at.",
    note: "An explicit port of Browser Use's policy: same observation format, same questions, same execution rules.",
  },
  {
    name: "Nainish-Rai/jev-frontend-qa",
    url: "https://github.com/Nainish-Rai/jev-frontend-qa",
    stars: 2,
    what: "Frontend QA: contract runs and exploratory runs against a real browser.",
    note: "The clearest statement of the model's boundary that I found anywhere.",
  },
  {
    name: "jgridifier/jev-research-eval",
    url: "https://github.com/jgridifier/jev-research-eval",
    stars: 2,
    what: "An evaluation harness over someone else's research-browser session.",
    note: "Not a fork: it pins one upstream commit and regenerates a report from it.",
  },
  {
    name: "charleeagni/JevPiano",
    url: "https://github.com/charleeagni/JevPiano",
    stars: 1,
    what: "Two decision models, one per hand, playing a web piano in real time.",
    note: "Hides the model's latency by asking about a note half a second before it is due.",
  },
  {
    name: "authrain-cloud-abdullahformuli/jev-ultrafast",
    url: "https://github.com/authrain-cloud-abdullahformuli/jev-ultrafast",
    stars: 1,
    what: "Another ultrafast browser agent, with dynamic indexed action spaces.",
    note: "No README found at read time beyond the description.",
  },
  {
    name: "dairui1/jev-lab",
    url: "https://github.com/dairui1/jev-lab",
    stars: 0,
    what: "The only head-to-head measurement of Jev against an LLM that I could find.",
    note: "Zero stars. It is the most useful repository in this list.",
  },
  {
    name: "Clueless-Creations/jev-ios-ultrafast",
    url: "https://github.com/Clueless-Creations/jev-ios-ultrafast",
    stars: 0,
    what: "Runs iOS Simulator goals with Jev, and replays the decisions.",
    note: "Pushes the same pattern out of the browser entirely.",
  },
  {
    name: "leisc/laya-jev-ultrafast",
    url: "https://github.com/leisc/laya-jev-ultrafast",
    stars: 0,
    what: "No description and no README at read time.",
    note: "Listed for completeness: a search returns twelve, and not all twelve are projects.",
  },
];

export interface BoundaryQuote {
  project: string;
  quote: string;
  url: string;
}

/**
 * Five projects, five authors who do not know each other, one boundary drawn in
 * the same place. This is the finding the page is built on, so every line is
 * verbatim and linked.
 */
export const boundaryQuotes: BoundaryQuote[] = [
  {
    project: "browser-use/jev-ultrafast",
    quote: "A small LLM writes text only when the operation is `TYPE_TEXT`.",
    url: "https://github.com/browser-use/jev-ultrafast",
  },
  {
    project: "jkudish/jev-browser",
    quote: "Code owns the loop: budgets, recovery, stop gates.",
    url: "https://github.com/jkudish/jev-browser",
  },
  {
    project: "Nainish-Rai/jev-frontend-qa",
    quote: "Jev is the action selector, not the test author or the correctness judge.",
    url: "https://github.com/Nainish-Rai/jev-frontend-qa",
  },
  {
    project: "jiawei686/jev-ultrafast-mcp",
    quote: "It never invents a target: it picks from what the page actually has, and the server refuses rather than guesses.",
    url: "https://github.com/jiawei686/jev-ultrafast-mcp",
  },
  {
    project: "charleeagni/JevPiano",
    quote: "Jev answers with option ids from the list the page offered, never a key name or a coordinate.",
    url: "https://github.com/charleeagni/JevPiano",
  },
];

export interface Measurement {
  label: string;
  value: string;
  source: string;
}

/** Numbers, each with the file it came out of. */
export const measurements: Measurement[] = [
  {
    label: "The shared demo, as the author measured it",
    value: "9.450 s → 7.092 s, median of three alternating pairs",
    source: "browser-use/jev-ultrafast · docs/performance.md",
  },
  {
    label: "What the author says about that sample",
    value: "“Three pairs are too few for a strong statistical claim (two-sided sign-test p = 0.25)”",
    source: "same file",
  },
  {
    label: "Where the speed actually came from",
    value: "browser protocol calls 1,092 → 101",
    source: "same file, “Where the time went”",
  },
  {
    label: "The commit that produced the famous demo",
    value: "“Reduce browser round trips and record a 7-second Flights demo”",
    source: "upstream commit 452c1ad, pinned by jgridifier/jev-research-eval",
  },
  {
    label: "Decision latency, as measured in two separate projects",
    value: "median 178 ms (Browser Use) · ~431 ms API-only (dairui1/jev-lab)",
    source: "docs/performance.md · dairui1/jev-lab README",
  },
  {
    label: "Piano project's workaround for that latency",
    value: "asks about a note ~500 ms before it is due, several requests in flight",
    source: "charleeagni/JevPiano README",
  },
  {
    label: "Cheapest observed cost for a real task",
    value: "$0.0016 for a Wikipedia navigation, about four seconds",
    source: "jkudish/jev-browser README",
  },
  {
    label: "A whole day of MCP browser work",
    value: "$0.01, with a screenshot of the billing dashboard",
    source: "jiawei686/jev-ultrafast-mcp README",
  },
];

export interface CalibrationRow {
  task: string;
  jev: string;
  llm: string;
}

/**
 * dairui1/jev-lab: 120 synthetic support tickets, three judgements each,
 * Jev against Claude Haiku 4.5 with thinking off. Reproduced verbatim because
 * this is the only independent test of the vendor's calibration claim that I
 * could find, and it lives in a repository nobody has starred.
 */
export const calibration: CalibrationRow[] = [
  { task: "urgency accuracy", jev: "91%", llm: "79%" },
  { task: "frustration accuracy", jev: "79%", llm: "65%" },
  { task: "department", jev: "tie", llm: "tie" },
  { task: "latency, API only", jev: "~431 ms", llm: "~1536 ms" },
  { task: "observed price", jev: "≈ $0.037 / M blended", llm: "—" },
];

export const calibrationNote =
  "Jev's p(urgent) is well calibrated (bucket hit-rates 0 / 21 / 41 / 75 / 100%), so the workflow can route 0.35–0.65 to human_review instead of guessing.";

export interface LimitQuote {
  project: string;
  quote: string;
}

/** The limits sections, quoted, because almost nobody reads them. */
export const limits: LimitQuote[] = [
  {
    project: "browser-use/jev-ultrafast",
    quote:
      "Canvas, uploads, new tabs, nested scrolling, and arbitrary keyboard widgets remain unsupported. A valid operation can still be wrong, and DONE is never independent evidence of success.",
  },
  {
    project: "browser-use/jev-ultrafast",
    quote: "This DOM reader supports common HTML and ARIA controls; it does not implement the full accessible-name algorithm or traverse shadow roots/frames.",
  },
  {
    project: "jkudish/jev-browser",
    quote: "This is early software. Expect rough edges on harder sites.",
  },
  {
    project: "Nainish-Rai/jev-frontend-qa",
    quote: "Exploration never implies a contract PASS.",
  },
];
