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
  modalities: ModelModality[];
  bestFor: ModelScenario[];
  strengths: string[];
  limitations: string[];
  formerAlias?: string;
  dataAsOf: string;
}

const DATA_AS_OF = "2026-09-05";

export const openrouterModels: HubModel[] = [
  {
    id: "xiaomi/mimo-v2.5",
    slug: "mimo-v2.5",
    name: "Xiaomi MiMo-V2.5",
    vendor: "Xiaomi",
    contextWindow: 1_050_000,
    inputPricePerMillion: 0.14,
    outputPricePerMillion: 0.28,
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
    id: "z-ai/glm-5.3-flash",
    slug: "glm-5.3-flash",
    name: "Z.ai GLM 5.3 Flash",
    vendor: "Z.ai",
    contextWindow: 1_310_720,
    inputPricePerMillion: 0.075,
    outputPricePerMillion: 0.25,
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
    inputPricePerMillion: 0.065,
    outputPricePerMillion: 0.18,
    modalities: ["Text"],
    bestFor: ["Budget", "Long Context"],
    strengths: [
      "Extremely low input and output cost",
      "Very large context window for text-heavy workloads",
      "Good default for high-volume summarization",
    ],
    limitations: [
      "Text-only",
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
    inputPricePerMillion: 0.57948,
    outputPricePerMillion: 1.73844,
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
    inputPricePerMillion: 0.2,
    outputPricePerMillion: 0.696,
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
