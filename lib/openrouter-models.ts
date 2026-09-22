export type ModelModality = "Text" | "Vision" | "Audio" | "Video" | "Files";

export type ModelScenario =
  | "Overall"
  | "Coding"
  | "Long Context"
  | "Budget"
  | "Free"
  | "Multimodal"
  | "Agents";

export interface HubModel {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  contextWindow: number;
  maxOutput?: number;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  /**
   * What OpenRouter charges for a cache *read*, i.e. re-sending a prefix it has
   * already seen. Absent when the catalogue declares no `input_cache_read` for
   * the model — which is 3 of our 15, and a real difference rather than a gap in
   * our data. Validated against the live catalogue by `npm run sync-models`.
   */
  cachedInputPricePerMillion?: number;
  modalities: ModelModality[];
  bestFor: ModelScenario[];
  strengths: string[];
  limitations: string[];
  formerAlias?: string;
  dataAsOf: string;
}

/**
 * Bumped to 2026-09-22 for the Xiaomi MiMo-V2.6 line and two repricings: every
 * entry in this array was re-checked against the public catalogue by
 * `npm run sync-models` that day, which is what the date is claiming.
 *
 * The drift check is the reason the date moved rather than the announcement: on
 * this day it reported that Z.ai GLM 5.3 Flash and DeepSeek V4 Flash had both
 * been repriced since the previous read, and a price we publish is a claim about
 * the catalogue, not about the day we last felt like looking. See the two entries
 * for what moved.
 */
export const DATA_AS_OF = "2026-09-22";

export const openrouterModels: HubModel[] = [
  {
    id: "xiaomi/mimo-v2.5",
    slug: "mimo-v2.5",
    name: "Xiaomi MiMo-V2.5",
    vendor: "Xiaomi",
    contextWindow: 1_050_000,
    inputPricePerMillion: 0.14,
    outputPricePerMillion: 0.28,
    cachedInputPricePerMillion: 0.0028,
    modalities: ["Text", "Vision", "Audio", "Video"],
    bestFor: ["Long Context", "Budget", "Multimodal"],
    strengths: [
      "1.05M-token context window at a very low price",
      "Strong long-document and mixed-media processing",
      "Good value for long-context agents and analysis",
    ],
    limitations: [
      "No tooling guarantees around agent workflows",
      "Less benchmark coverage than Claude and Gemini",
    ],
    formerAlias: "Hunter Alpha",
    dataAsOf: DATA_AS_OF,
  },
  {
    /*
     * Listed in the catalogue 2026-09-21 20:07 UTC, i.e. the morning of the 22nd
     * in this timezone. Read the same day.
     *
     * The price is the point: Flash costs exactly what MiMo-V2.5 costs ($0.14 /
     * $0.28 per million, $0.0028 cached) on a newer generation, so it is the
     * straight replacement in the budget tier rather than a third option beside
     * it. The window is 1,048,576 tokens against V2.5's 1,050,000 — 1,424 tokens
     * narrower, which is worth writing down precisely so nobody has to trust a
     * rounded "about a million" for both.
     */
    id: "xiaomi/mimo-v2.6-flash",
    slug: "mimo-v2.6-flash",
    name: "Xiaomi MiMo-V2.6-Flash",
    vendor: "Xiaomi",
    contextWindow: 1_048_576,
    maxOutput: 131_072,
    inputPricePerMillion: 0.14,
    outputPricePerMillion: 0.28,
    cachedInputPricePerMillion: 0.0028,
    modalities: ["Text", "Vision", "Audio", "Video"],
    /*
     * No "Long Context" tag, deliberately. It has the same 1.05M window class as
     * MiMo-V2.5 above it and the same price, so tagging it for the same workload
     * would put two near-identical models in the long-context scenario while the
     * homepage's four workload cards — which take the *first* unused model per
     * scenario — would spend the long-context card on the newer twin and then
     * have nothing but the older one left for budget. The budget card is where a
     * same-price, newer generation actually changes the recommendation.
     */
    bestFor: ["Budget", "Multimodal"],
    strengths: [
      "Same price as MiMo-V2.5 on a newer generation — the catalogue lists both at $0.14 in / $0.28 out per million",
      "1.05M-token window with image, audio and video input",
      "The catalogue describes it as an open mixture-of-experts model, 309B parameters total with 15B active per token",
      "Cached input at $0.0028 per million, a hundredth of the fresh-input price",
    ],
    limitations: [
      "Listed 2026-09-21 and read 2026-09-22: no independent evaluation of it exists yet, and nothing here is a benchmark",
      "Output costs twice the input price per token, so long-form generation is where the bill lands",
      "The parameter count and architecture come from the vendor's own catalogue description",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "xiaomi/mimo-v2.6-pro",
    slug: "mimo-v2.6-pro",
    name: "Xiaomi MiMo-V2.6-Pro",
    vendor: "Xiaomi",
    contextWindow: 1_048_576,
    maxOutput: 131_072,
    inputPricePerMillion: 0.435,
    outputPricePerMillion: 0.87,
    cachedInputPricePerMillion: 0.0036,
    modalities: ["Text", "Vision", "Audio", "Video"],
    bestFor: ["Overall", "Agents", "Long Context", "Multimodal"],
    strengths: [
      "Xiaomi's flagship tier: the catalogue describes it as built at a scale of over 1T parameters",
      "Carries an Artificial Analysis intelligence index of 46.3 in the catalogue — the only third-party number on the V2.6 line so far",
      "Three times the Flash price for the top tier, on the same 1.05M window and the same input modalities",
      "Reasoning and structured output are both declared supported",
    ],
    limitations: [
      "The catalogue's coding and agentic indices for it are empty, so the one benchmark number published is a single composite",
      "3.1x the input price of MiMo-V2.6-Flash for a difference no public benchmark on this page can quantify",
      "Vendor parameter claims, not verified independently",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    /*
     * The tier nobody asks for and everybody should know exists: same checkpoint
     * as Pro, exactly 10x the price, sold on speed. Worth a page because a reader
     * comparing three Xiaomi entries with two near-identical names will otherwise
     * assume the cheap one is the crippled one.
     */
    id: "xiaomi/mimo-v2.6-pro-ultraspeed",
    slug: "mimo-v2.6-pro-ultraspeed",
    name: "Xiaomi MiMo-V2.6-Pro-UltraSpeed",
    vendor: "Xiaomi",
    contextWindow: 1_048_576,
    maxOutput: 131_072,
    inputPricePerMillion: 4.35,
    outputPricePerMillion: 8.7,
    cachedInputPricePerMillion: 0.036,
    modalities: ["Text", "Vision", "Audio", "Video"],
    bestFor: ["Agents"],
    strengths: [
      "The catalogue describes it as built from the same 1T MiMo-V2.6-Pro checkpoint and matching that model's quality",
      "Sold on speed, for the latency-bound path rather than the batch path",
      "Same 1.05M window and the same omnimodal input as the rest of the line",
    ],
    limitations: [
      "Exactly 10x MiMo-V2.6-Pro per token ($4.35 vs $0.435 in, $8.70 vs $0.87 out) for a speed claim the catalogue does not put a number on",
      "At $8.70 per million output tokens it is the most expensive entry in this snapshot",
      "No published latency figure to compare against Pro, so the 10x is a price you pay in advance of evidence",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "z-ai/glm-5.3-flash",
    slug: "glm-5.3-flash",
    name: "Z.ai GLM 5.3 Flash",
    vendor: "Z.ai",
    contextWindow: 1_310_720,
    /*
     * Repriced since the previous read: $0.09 / $0.30 / $0.018 on 2026-09-18,
     * $0.15 / $0.50 / $0.05 on 2026-09-22. Input up 67%, output up 67%, cached
     * input up 178%. Source: `npm run sync-models`, which fails on any mismatch.
     */
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.5,
    cachedInputPricePerMillion: 0.05,
    modalities: ["Text", "Vision", "Video"],
    bestFor: ["Budget", "Long Context", "Multimodal"],
    strengths: [
      "Very low input and output pricing",
      "Largest context window in the current hub snapshot",
      "Useful for bulk document processing and multimodal extraction",
    ],
    limitations: [
      "Reasoning depth may trail frontier models",
      "Vendor-specific tool behavior should be tested before production",
    ],
    formerAlias: "OX Alpha",
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "deepseek/deepseek-v4-flash-0731",
    slug: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    vendor: "DeepSeek",
    contextWindow: 1_310_720,
    /*
     * Repriced since the previous read, and not symmetrically: input fell from
     * $0.06 to $0.04 while output rose from $0.12 to $0.64, a 5.3x increase on
     * the number that dominates any generation workload. Cached input $0.012 →
     * $0.016. Read 2026-09-22; the previous figures were read 2026-09-18.
     */
    inputPricePerMillion: 0.04,
    outputPricePerMillion: 0.64,
    cachedInputPricePerMillion: 0.016,
    modalities: ["Text"],
    bestFor: ["Budget", "Long Context"],
    strengths: [
      "The cheapest input price in this snapshot at $0.04 per million tokens",
      "Very large context window for text-heavy workloads",
      "Good default for workloads that read a lot and write a little",
    ],
    limitations: [
      "Text-only",
      "Output costs 16x its input after the 2026-09-22 repricing: at $0.64 per million it is no longer a budget model for generation",
      "Requires careful evaluation for complex reasoning tasks",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "deepseek/deepseek-v4-pro-0813",
    slug: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    vendor: "DeepSeek",
    contextWindow: 1_048_576,
    // Caught twice by `npm run sync-models` on 2026-09-18: the catalogue reads
    // $0.66 / $1.98 per 1M for this id, and an earlier read that day returned
    // $0.57948 / $1.73844 — an 0.878x multiplier on both numbers, i.e. a
    // promotional price on the same route. Only one of those can be published at
    // a time, so publish the undiscounted read and let the daily check tell us
    // when it moves again.
    inputPricePerMillion: 0.66,
    outputPricePerMillion: 1.98,
    cachedInputPricePerMillion: 0.022,
    modalities: ["Text"],
    bestFor: ["Long Context", "Budget", "Agents"],
    strengths: [
      "Balanced cost/performance for long-form reasoning",
      "1M-token context window",
      "Good fit for research and document pipelines",
    ],
    limitations: [
      "Text-only",
      "Complex tool use may require additional evaluation",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "qwen/qwen3.8-flash",
    slug: "qwen3.8-flash",
    name: "Qwen3.8 Flash",
    vendor: "Alibaba",
    contextWindow: 1_000_000,
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.47,
    cachedInputPricePerMillion: 0.016,
    modalities: ["Text", "Vision", "Video"],
    bestFor: ["Budget", "Long Context", "Multimodal"],
    strengths: [
      "Low-latency multimodal processing",
      "Good default for high-volume classification",
      "Strong value for image and video intake",
    ],
    limitations: [
      "Less suitable for deep multi-step agent planning",
      "Complex code generation may trail larger models",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "qwen/qwen3.8-max-0902",
    slug: "qwen3.8-max",
    name: "Qwen3.8 Max (0902)",
    vendor: "Alibaba",
    contextWindow: 1_000_000,
    inputPricePerMillion: 2.0,
    outputPricePerMillion: 6.0,
    cachedInputPricePerMillion: 0.25,
    modalities: ["Text", "Vision", "Video"],
    bestFor: ["Overall", "Multimodal", "Long Context"],
    strengths: [
      "Broad multimodal coverage",
      "More capable reasoning than the Flash tier",
      "Large context window for enterprise document tasks",
    ],
    limitations: [
      "Higher cost than open-weight alternatives",
      "Model-specific latency varies by provider",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "google/gemini-3.7-flash",
    slug: "gemini-3-7-flash",
    name: "Google Gemini 3.7 Flash",
    vendor: "Google",
    contextWindow: 1_048_576,
    inputPricePerMillion: 0.75,
    outputPricePerMillion: 3.75,
    cachedInputPricePerMillion: 0.075,
    modalities: ["Text", "Vision", "Audio", "Video", "Files"],
    bestFor: ["Multimodal", "Overall", "Long Context"],
    strengths: [
      "Very broad multimodal input support",
      "Good balance of speed, price and reasoning",
      "Strong fit for media analysis and document extraction",
    ],
    limitations: [
      "Output cost is higher than open-weight models",
      "Model-specific file and audio limits vary by provider",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "anthropic/claude-sonnet-5",
    slug: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    vendor: "Anthropic",
    contextWindow: 1_000_000,
    inputPricePerMillion: 2.0,
    outputPricePerMillion: 10.0,
    cachedInputPricePerMillion: 0.2,
    modalities: ["Text", "Vision", "Files"],
    bestFor: ["Overall", "Coding", "Agents"],
    strengths: [
      "Strong coding, writing and long-context reasoning",
      "Reliable tool-use and agent behavior",
      "Good default for production product work",
    ],
    limitations: [
      "Output cost is high for very large workloads",
      "Not the cheapest option for bulk classification",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "anthropic/claude-opus-5",
    slug: "claude-opus-5",
    name: "Claude Opus 5",
    vendor: "Anthropic",
    contextWindow: 1_000_000,
    maxOutput: 128_000,
    inputPricePerMillion: 5.0,
    outputPricePerMillion: 25.0,
    cachedInputPricePerMillion: 0.5,
    modalities: ["Text", "Vision", "Files"],
    bestFor: ["Overall", "Agents", "Coding"],
    strengths: [
      "Highest reasoning quality in the snapshot",
      "Best fit for difficult analysis and complex agent chains",
      "Large context window with strong instruction following",
    ],
    limitations: [
      "Most expensive option in the snapshot",
      "Overkill for simple extraction or classification",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "openai/gpt-5.6-luna",
    slug: "gpt-5.6-luna",
    name: "OpenAI GPT-5.6 Luna",
    vendor: "OpenAI",
    contextWindow: 1_050_000,
    maxOutput: 128_000,
    inputPricePerMillion: 0.2,
    outputPricePerMillion: 1.2,
    cachedInputPricePerMillion: 0.02,
    modalities: ["Text", "Vision", "Files"],
    bestFor: ["Budget", "Coding", "Agents"],
    strengths: [
      "Fast, cost-efficient reasoning",
      "Good fit for high-volume agentic workflows",
      "Long context with strong tool support",
    ],
    limitations: [
      "Not the strongest frontier model for hard reasoning",
      "Large prompts may move to a higher price tier",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "openai/gpt-5.6-sol",
    slug: "gpt-5.6-sol",
    name: "OpenAI GPT-5.6 Sol",
    vendor: "OpenAI",
    contextWindow: 1_050_000,
    maxOutput: 128_000,
    inputPricePerMillion: 2.0,
    outputPricePerMillion: 10.0,
    cachedInputPricePerMillion: 0.2,
    modalities: ["Text", "Vision", "Files"],
    bestFor: ["Overall", "Coding", "Agents"],
    strengths: [
      "Balanced quality/cost for product work",
      "Good tool-use and structured output support",
      "Large context window",
    ],
    limitations: [
      "More expensive than open-weight alternatives",
      "Large-prompt surcharges can affect cost predictability",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "openai/gpt-5.6-terra",
    slug: "gpt-5.6-terra",
    name: "OpenAI GPT-5.6 Terra",
    vendor: "OpenAI",
    contextWindow: 1_050_000,
    maxOutput: 128_000,
    inputPricePerMillion: 2.0,
    outputPricePerMillion: 12.0,
    cachedInputPricePerMillion: 0.2,
    modalities: ["Text", "Vision", "Files"],
    bestFor: ["Overall", "Multimodal", "Agents"],
    strengths: [
      "Strong multimodal and file reasoning",
      "Good fit for complex product assistants",
      "Long-context and tooling support",
    ],
    limitations: [
      "High output cost",
      "Large-prompt pricing tiers require cost testing",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "mistralai/mistral-medium-3-5",
    slug: "mistral-medium-3-5",
    name: "Mistral Medium 3.5",
    vendor: "Mistral AI",
    contextWindow: 262_144,
    inputPricePerMillion: 1.5,
    outputPricePerMillion: 7.5,
    modalities: ["Text", "Vision", "Files"],
    bestFor: ["Overall", "Coding"],
    strengths: [
      "Strong European/general-purpose option",
      "Good fit for product feature work",
      "Competitive quality in the mid-price tier",
    ],
    limitations: [
      "Smaller context window than leading long-context models",
      "Not ideal for very large document batches",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "meta-llama/llama-4-maverick",
    slug: "llama-4-maverick",
    name: "Meta Llama 4 Maverick",
    vendor: "Meta",
    contextWindow: 1_048_576,
    inputPricePerMillion: 0.1875,
    outputPricePerMillion: 0.6525,
    modalities: ["Text", "Vision"],
    bestFor: ["Budget", "Long Context", "Multimodal"],
    strengths: [
      "Low-cost open-weight family",
      "Good default for self-hostable or flexible deployments",
      "Large context window",
    ],
    limitations: [
      "Not as strong as frontier proprietary models",
      "Open-weight behavior varies by hosted provider",
    ],
    dataAsOf: DATA_AS_OF,
  },
  {
    id: "cohere/command-a",
    slug: "command-a",
    name: "Cohere Command A",
    vendor: "Cohere",
    contextWindow: 256_000,
    inputPricePerMillion: 2.5,
    outputPricePerMillion: 10.0,
    modalities: ["Text"],
    bestFor: ["Agents", "Coding"],
    strengths: [
      "Strong enterprise search and RAG workflows",
      "Good instruction following",
      "Predictable output style",
    ],
    limitations: [
      "Smaller context window",
      "Higher cost than many open-weight options",
    ],
    dataAsOf: DATA_AS_OF,
  },
];

export const modelHubDataAsOf = DATA_AS_OF;

export function getModelBySlug(slug: string): HubModel | undefined {
  return openrouterModels.find((model) => model.slug === slug);
}

export function formatContextWindow(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(tokens % 1_000_000 === 0 ? 0 : 2)}M tokens`;
  }
  return `${(tokens / 1_000).toFixed(0)}K tokens`;
}

export function formatPrice(value: number): string {
  if (value === 0) return "$0";
  return `$${value.toFixed(value < 1 ? 3 : 2)}`;
}

export function openrouterModelUrl(id: string): string {
  return `https://openrouter.ai/${id}`;
}

/**
 * Where a model's own page lives on this site.
 *
 * Needed because stealth models are deliberately kept out of the curated
 * snapshot (lib/stealth-models.ts explains why) — so they have no
 * /openrouter-models/<slug> page, and building that URL for them produces a
 * 404. The comparison pages can show a stealth model (Union Alpha appears in
 * three pairs), which is how that 404 shipped: `/openrouter-models/union-alpha`
 * was linked from three /compare pages until the link audit caught it on
 * 2026-09-18.
 *
 * One helper rather than a conditional at each call site, for the same reason
 * the events and the FAQ have one source: the second copy is the one that rots.
 */
export function modelPageHref(model: { slug: string }): string {
  return openrouterModels.some((candidate) => candidate.slug === model.slug)
    ? `/openrouter-models/${model.slug}`
    : `/${model.slug}`;
}

export interface Scenario {
  title: string;
  description: string;
  scenario: ModelScenario;
  count?: number;
}

export const defaultScenarios: Scenario[] = [
  {
    title: "Best overall",
    description: "Strong reasoning, tooling and production reliability.",
    scenario: "Overall",
  },
  {
    title: "Best for coding",
    description: "Good code quality, debugging and technical explanation.",
    scenario: "Coding",
  },
  {
    title: "Best for long context",
    description: "Large context window for documents and transcripts.",
    scenario: "Long Context",
  },
  {
    title: "Best for budget",
    description: "Low input/output cost for high-volume workloads.",
    scenario: "Budget",
  },
  {
    title: "Best multimodal",
    description: "Handles images, files, audio or video inputs.",
    scenario: "Multimodal",
  },
  {
    title: "Best for agents",
    description: "Tool use, structured output and multi-step reasoning.",
    scenario: "Agents",
  },
];

export function modelsForScenario(scenario: ModelScenario, count = 3): HubModel[] {
  return openrouterModels
    .filter((model) => model.bestFor.includes(scenario))
    .slice(0, count);
}
