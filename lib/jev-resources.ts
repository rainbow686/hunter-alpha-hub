/**
 * /typesafe-jev/resources — the resource index for Jev.
 *
 * This is the first second-level column of the Jev topic (roadmap/jev-topic-columns.md),
 * and it is deliberately the cheapest one: every row is a public artefact somebody
 * else made, so there is nothing to generate and nothing to guess. What we add is
 * the part a link dump never has — **numbers read from the source on a stated date**
 * plus a line saying what the thing is for.
 *
 * Discipline, and the reason this file carries a date at all:
 *   - every URL here was fetched on `JEV_RESOURCES_READ_ON` and returned 200; a
 *     dead link is removed rather than left in place with a caveat;
 *   - `stars` and `lastPush` were read from the GitHub API on the same day, in one
 *     pass, so the column is internally consistent. They are the one kind of field
 *     on this page that goes stale by the hour, which is why the read date is
 *     printed above the table rather than buried in a footnote;
 *   - **a repository with no description is listed with that fact in the description
 *     column, not dropped and not guessed at.** vinnylarouge/jevlike and
 *     droidrun/mobile-jev both rank in the top 25 by stars and neither publishes a
 *     summary we could verify; omitting a thousand-star project from a resource
 *     index is a bigger error than writing "we have not read this";
 *   - `ourNote` is only present where we actually have something to say. Empty is
 *     the honest state for a repository we have not opened.
 */

export type ResourceKind = "official" | "collection" | "tool";

export interface JevResource {
  name: string;
  url: string;
  kind: ResourceKind;
  /** Who publishes it, in the form a reader can check. */
  by: string;
  /** Read from the GitHub API on JEV_RESOURCES_READ_ON. Absent for non-repo rows. */
  stars?: number;
  /** Last push to the default branch, same read. */
  lastPush?: string;
  /** What it is, in one line. */
  what: string;
  /** What we took from it. Only where we have something real to say. */
  ourNote?: string;
}

/** Every link below was fetched and every star count read on this date. */
export const JEV_RESOURCES_READ_ON = "2026-09-22";

export const jevResources: JevResource[] = [
  /* ------------------------------------------------------------------ official */
  {
    name: "Introducing System One models and Jev",
    url: "https://typesafe.ai/blog/introducing-system-one-models-and-jev",
    kind: "official",
    by: "TypeSafe",
    what: "The launch post: what a System One model is, why the output is a typed decision rather than text, and the two headline ranges (70–500 ms, 40×–200× cheaper) the product is sold on.",
    ourNote:
      "every cost and latency figure on our model page that is not labelled as ours comes from this page, and is labelled with it",
  },
  {
    name: "Quickstart",
    url: "https://docs.typesafe.ai/introduction/quickstart",
    kind: "official",
    by: "TypeSafe",
    what: "The request shape: a state, a set of named questions, and the three answer types (Noul, Choice, Score).",
    ourNote: "the shape our own twenty identical calls were sent in, byte for byte",
  },
  {
    name: "TypeSafe evaluations",
    url: "https://evals.typesafe.ai",
    kind: "official",
    by: "TypeSafe",
    what: "The vendor's own evaluation pages, including the self-consistency study we compare our measured spread against.",
    ourNote:
      "we quote their 0.0102 mean standard deviation and say plainly that it comes from a different rubric on different machines",
  },
  {
    name: "Jev on OpenRouter",
    url: "https://openrouter.ai/typesafe/jev-1.13",
    kind: "official",
    by: "OpenRouter",
    what: "The listing our snapshot reads: $0.042 per million input tokens, output free, 32K context.",
    ourNote: "the source for every price and window on this site, re-checked daily by our drift check",
  },
  {
    name: "Jev on Cloudflare Workers AI",
    url: "https://developers.cloudflare.com/ai/models/typesafe/jev/",
    kind: "official",
    by: "Cloudflare",
    what: "The second place Jev is listed, with the question-type table in Cloudflare's own words.",
    ourNote: "where the question-type table on our model page was read from, rather than from the vendor",
  },
  {
    name: "typesafe-ai/skills",
    url: "https://github.com/typesafe-ai/skills",
    kind: "official",
    by: "TypeSafe",
    what: "The vendor's own agent skills, installed with `npx skills add typesafe-ai/skills`.",
    ourNote: "the only row on this page that TypeSafe maintains as a product rather than as documentation",
  },

  /* ---------------------------------------------------------------- collections */
  {
    name: "yibie/awesome-jev",
    url: "https://github.com/yibie/awesome-jev",
    kind: "collection",
    by: "yibie",
    stars: 1070,
    lastPush: "2026-09-21",
    what: "Public projects, integrations and discussion threads. The largest of the community collections by stars.",
  },
  {
    name: "Anil-matcha/awesome-jev-by-typesafe",
    url: "https://github.com/Anil-matcha/awesome-jev-by-typesafe",
    kind: "collection",
    by: "Anil Matcha",
    stars: 774,
    lastPush: "2026-09-20",
    what: "Use cases, patterns, prompts and starter code, each tied to a source.",
  },
  {
    name: "v-modal/awesome-jev-tools",
    url: "https://github.com/v-modal/awesome-jev-tools",
    kind: "collection",
    by: "v-modal",
    stars: 629,
    lastPush: "2026-09-19",
    what: "Tools only, no use cases: the narrowest of the collections and the fastest to scan.",
  },
  {
    name: "AbdelStark/awesome-typesafe-jev",
    url: "https://github.com/AbdelStark/awesome-typesafe-jev",
    kind: "collection",
    by: "Abdel Stark",
    stars: 431,
    lastPush: "2026-09-21",
    what: "A source-backed field guide to TypeSafe's System One line.",
  },
  {
    name: "wuyoscar/jev-skill",
    url: "https://github.com/wuyoscar/jev-skill",
    kind: "collection",
    by: "wuyoscar",
    stars: 389,
    lastPush: "2026-09-21",
    what: "Use cases, workflows and agent skills, written to be installed rather than only read.",
  },
  {
    name: "logicrw/awesome-jev-projects",
    url: "https://github.com/logicrw/awesome-jev-projects",
    kind: "collection",
    by: "logicrw",
    stars: 336,
    lastPush: "2026-09-22",
    what: "An ecosystem radar of open-source projects, with each entry sourced.",
  },
  {
    name: "cobanov/awesome-jev",
    url: "https://github.com/cobanov/awesome-jev",
    kind: "collection",
    by: "cobanov",
    stars: 318,
    lastPush: "2026-09-22",
    what: "Projects built with Jev, each one linked to its source.",
  },
  {
    name: "AnotiaWang/awesome-jev",
    url: "https://github.com/AnotiaWang/awesome-jev",
    kind: "collection",
    by: "AnotiaWang",
    stars: 268,
    lastPush: "2026-09-22",
    what: "Applications and integrations for Jev and the System One line.",
  },

  /* ---------------------------------------------------------------------- tools */
  {
    name: "browser-use/jev-ultrafast",
    url: "https://github.com/browser-use/jev-ultrafast",
    kind: "tool",
    by: "Browser Use",
    stars: 16545,
    lastPush: "2026-09-18",
    what: "A browser agent that uses a small LLM to write text and Jev to choose what to do next: a flight search in about seven seconds for about $0.004.",
    ourNote:
      "the one we read line by line — see the field notes for the loop, the stop gates and what it refuses to guess",
  },
  {
    name: "tamaratran/fast-jev-compaction",
    url: "https://github.com/tamaratran/fast-jev-compaction",
    kind: "tool",
    by: "tamaratran",
    stars: 6063,
    lastPush: "2026-09-18",
    what: "A Claude Code plugin that replaces the compaction summary with Jev decisions about what is worth keeping.",
  },
  {
    name: "jarrodwatts/jev-trader",
    url: "https://github.com/jarrodwatts/jev-trader",
    kind: "tool",
    by: "Jarrod Watts",
    stars: 1896,
    lastPush: "2026-09-17",
    what: "One trade decision per block on Monad, with Jev reading the order book rather than a model writing prose about it.",
  },
  {
    name: "TianyuCodings/NanoJev",
    url: "https://github.com/TianyuCodings/NanoJev",
    kind: "tool",
    by: "TianyuCodings",
    stars: 1870,
    lastPush: "2026-09-21",
    what: "A small open reimplementation of the idea: parallel decisions over dynamic candidates, as a readable recipe.",
    ourNote:
      "the interesting part is that somebody reimplemented the *pattern* rather than calling the API, which is the clearest sign the pattern itself is the product",
  },
  {
    name: "vinnylarouge/jevlike",
    url: "https://github.com/vinnylarouge/jevlike",
    kind: "tool",
    by: "vinnylarouge",
    stars: 1175,
    lastPush: "2026-09-16",
    what: "No description is published on the repository and we have not read it, so this row records the absence rather than guessing at the contents.",
  },
  {
    name: "droidrun/mobile-jev",
    url: "https://github.com/droidrun/mobile-jev",
    kind: "tool",
    by: "Droidrun",
    stars: 329,
    lastPush: "2026-09-17",
    what: "Same as the row above: a large early project whose repository publishes no description, recorded as unknown rather than described.",
  },
  {
    name: "devagrawal09/jev-review",
    url: "https://github.com/devagrawal09/jev-review",
    kind: "tool",
    by: "Dev Agrawal",
    stars: 505,
    lastPush: "2026-09-17",
    what: "A staged code-review workflow and local dashboard, with Jev making the keep-or-drop calls between stages.",
  },
  {
    name: "featherless-ai/simple-jev",
    url: "https://github.com/featherless-ai/simple-jev",
    kind: "tool",
    by: "Featherless AI",
    stars: 460,
    lastPush: "2026-09-21",
    what: "Turns any open model into a Jev-shaped classifier endpoint — the cheapest way to test the pattern without buying the API.",
    ourNote: "the one to read if you want to know how much of the value is the model and how much is the output contract",
  },
  {
    name: "kerpopule/hermes-jev-skills",
    url: "https://github.com/kerpopule/hermes-jev-skills",
    kind: "tool",
    by: "kerpopule",
    stars: 404,
    lastPush: "2026-09-22",
    what: "Routing, memory, compaction and skill selection: the agent's small decisions moved out of the model that writes.",
  },
  {
    name: "superagents-lab/jev-search",
    url: "https://github.com/superagents-lab/jev-search",
    kind: "tool",
    by: "Superagents Lab",
    stars: 387,
    lastPush: "2026-09-20",
    what: "Web search where Jev picks the sources and the query shape, and a writing model does the answering.",
  },
  {
    name: "wy-coliney/jev-browser-use",
    url: "https://github.com/wy-coliney/jev-browser-use",
    kind: "tool",
    by: "wy-coliney",
    stars: 336,
    lastPush: "2026-09-19",
    what: "The split written the other way round: Jev clicks, a larger model thinks between clicks.",
  },
  {
    name: "gargpratyush/jev-router",
    url: "https://github.com/gargpratyush/jev-router",
    kind: "tool",
    by: "Garg Pratyush",
    stars: 317,
    lastPush: "2026-09-19",
    what: "Routes each request to the cheapest model that can do the job, using Jev to classify the request first.",
  },
  {
    name: "realZachi/pg-jev",
    url: "https://github.com/realZachi/pg-jev",
    kind: "tool",
    by: "realZachi",
    stars: 289,
    lastPush: "2026-09-18",
    what: "Plain-language questions over Postgres tables, with Jev deciding which of the available queries to run.",
  },
  {
    name: "sutro-sh/jev-align",
    url: "https://github.com/sutro-sh/jev-align",
    kind: "tool",
    by: "Sutro",
    stars: 271,
    lastPush: "2026-09-20",
    what: "Builds calibrated decision functions from human feedback, using Jev where a threshold has to be learned rather than chosen.",
  },
];

export function resourcesByKind(kind: ResourceKind): JevResource[] {
  return jevResources.filter((resource) => resource.kind === kind);
}

/** Rows per kind, used for the page's own counts so they cannot drift. */
export const jevResourceCounts = {
  official: resourcesByKind("official").length,
  collection: resourcesByKind("collection").length,
  tool: resourcesByKind("tool").length,
  total: jevResources.length,
};
