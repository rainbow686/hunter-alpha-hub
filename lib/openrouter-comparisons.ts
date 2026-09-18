import {
  getModelBySlug,
  type HubModel,
} from "./openrouter-models";
import { getStealthModelBySlug } from "./stealth-models";

/** Curated models first; stealth (non-curated) models as a fallback. */
function resolveModel(slug: string): HubModel | undefined {
  return getModelBySlug(slug) ?? getStealthModelBySlug(slug);
}

export interface ComparisonPair {
  slug: string;
  aSlug: string;
  bSlug: string;
  keyDifference: string;
  quickVerdict: string;
  chooseAIf: string[];
  chooseBIf: string[];
}

export interface ResolvedComparison {
  pair: ComparisonPair;
  a: HubModel;
  b: HubModel;
}

export const comparisonPairs: ComparisonPair[] = [
  {
    slug: "claude-sonnet-5-vs-gpt-5.6-sol",
    aSlug: "claude-sonnet-5",
    bSlug: "gpt-5.6-sol",
    keyDifference:
      "Claude Sonnet 5 has a lower output price, while GPT-5.6 Sol is positioned as a balanced frontier option with strong tooling.",
    quickVerdict:
      "Claude Sonnet 5 is often the better price/quality default for production coding and writing. GPT-5.6 Sol is the stronger choice when you want OpenAI tooling, structured output behavior and broad product-work coverage.",
    chooseAIf: [
      "You want the lower output price at this quality tier",
      "Your workload is code review, technical writing or long-context reasoning",
      "You value reliable instruction following and agent behavior",
    ],
    chooseBIf: [
      "You prefer the OpenAI ecosystem and tool behavior",
      "You need a balanced model for mixed product workloads",
      "Your evaluation shows better output quality for your prompts",
    ],
  },
  {
    slug: "claude-opus-5-vs-gpt-5.6-terra",
    aSlug: "claude-opus-5",
    bSlug: "gpt-5.6-terra",
    keyDifference:
      "Claude Opus 5 has lower output pricing than GPT-5.6 Terra, while Terra emphasizes strong multimodal and file reasoning.",
    quickVerdict:
      "Claude Opus 5 is a strong choice for difficult reasoning, complex agent chains and high-stakes code. GPT-5.6 Terra is better when your workload leans heavily on multimodal input and long, file-heavy tasks.",
    chooseAIf: [
      "You need maximum reasoning depth",
      "You want complex agent workflows with strong instruction following",
      "Your evaluation favors Claude's output style",
    ],
    chooseBIf: [
      "Your prompts rely on images, files or mixed media",
      "You want a long-context multimodal workflow",
      "Your product already uses OpenAI tool interfaces",
    ],
  },
  {
    slug: "deepseek-v4-flash-vs-glm-5.3-flash",
    aSlug: "deepseek-v4-flash",
    bSlug: "glm-5.3-flash",
    keyDifference:
      "GLM 5.3 Flash adds vision and video input, while DeepSeek V4 Flash is text-only but slightly cheaper and still very large-context.",
    quickVerdict:
      "Use GLM 5.3 Flash when you need low-cost multimodal processing at more than 1M tokens. Use DeepSeek V4 Flash for pure-text batch work where cost and large context matter more than modality.",
    chooseAIf: [
      "Your workload is text-only",
      "You want the lowest possible input and output cost",
      "You process long documents, logs or transcripts in batches",
    ],
    chooseBIf: [
      "You need image or video input",
      "You want one large-context model for mixed media extraction",
      "Your benchmark shows GLM handles your document structure better",
    ],
  },
  {
    slug: "mimo-v2.5-vs-deepseek-v4-flash",
    aSlug: "mimo-v2.5",
    bSlug: "deepseek-v4-flash",
    keyDifference:
      "Xiaomi MiMo-V2.5 supports multimodal input; DeepSeek V4 Flash is text-only but has a lower price and comparable large-context reach.",
    quickVerdict:
      "MiMo-V2.5 is better for mixed-media long-context work. DeepSeek V4 Flash is the more cost-focused option for pure-text summarization and extraction.",
    chooseAIf: [
      "You need image, audio or video input",
      "You want one model across mixed-media analysis",
      "Your tests show strong long-context retention for MiMo",
    ],
    chooseBIf: [
      "Your workload is text-only and high-volume",
      "Cost is the primary constraint",
      "You are building document and log summarization pipelines",
    ],
  },
  {
    slug: "mimo-v2.5-vs-glm-5.3-flash",
    aSlug: "mimo-v2.5",
    bSlug: "glm-5.3-flash",
    keyDifference:
      "GLM 5.3 Flash has a larger context window and lower pricing; MiMo-V2.5 adds audio input and may perform differently on long-context quality.",
    quickVerdict:
      "GLM 5.3 Flash is the lower-cost choice for very long multimodal context. MiMo-V2.5 is worth testing when you need audio input or prefer its long-context behavior.",
    chooseAIf: [
      "You need audio plus image or video input",
      "Your real documents favor MiMo's retrieval behavior",
      "You want an alternative to the lowest-cost GLM route",
    ],
    chooseBIf: [
      "You want the larger context window and lower price",
      "Your workload is bulk media extraction",
      "You need cheap processing across very long documents",
    ],
  },
  {
    slug: "qwen3.8-flash-vs-gemini-3-7-flash",
    aSlug: "qwen3.8-flash",
    bSlug: "gemini-3-7-flash",
    keyDifference:
      "Qwen3.8 Flash is significantly cheaper and supports image/video, while Gemini 3.7 Flash adds audio and files with a broader multimodal surface.",
    quickVerdict:
      "Qwen3.8 Flash is a strong low-cost multimodal option for image/video intake. Gemini 3.7 Flash is better when audio, files and a polished multimodal stack matter more than token cost.",
    chooseAIf: [
      "Cost per million tokens is important",
      "Your workload is high-volume image or video classification",
      "You want a large-context model at a lower price",
    ],
    chooseBIf: [
      "You need audio and file inputs",
      "You prefer Google's multimodal stack",
      "Your benchmark favors Gemini on your media tasks",
    ],
  },
  {
    slug: "gemini-3-7-flash-vs-claude-sonnet-5",
    aSlug: "gemini-3-7-flash",
    bSlug: "claude-sonnet-5",
    keyDifference:
      "Gemini 3.7 Flash offers broader multimodal input at lower cost; Claude Sonnet 5 is usually stronger for code, writing and agent reliability.",
    quickVerdict:
      "Gemini 3.7 Flash is better for media, files and cost-sensitive multimodal work. Claude Sonnet 5 is the safer default for production coding, technical writing and agent workflows.",
    chooseAIf: [
      "You need audio, files, image or video input",
      "Cost per million tokens is a major factor",
      "Your task is media analysis or document extraction",
    ],
    chooseBIf: [
      "You need strong code generation and debugging",
      "Your agent needs reliable tool behavior",
      "Output quality matters more than token cost",
    ],
  },
  {
    slug: "deepseek-v4-pro-vs-claude-opus-5",
    aSlug: "deepseek-v4-pro",
    bSlug: "claude-opus-5",
    keyDifference:
      "Claude Opus 5 is the premium reasoning option, while DeepSeek V4 Pro offers a 1M-token text workflow at a much lower price.",
    quickVerdict:
      "DeepSeek V4 Pro is attractive for cost-sensitive long-document reasoning. Claude Opus 5 is better when the task is hard enough to justify premium reasoning and agent behavior.",
    chooseAIf: [
      "You need 1M-token text reasoning at a lower cost",
      "Your workload is research, extraction or document pipelines",
      "Cost limits prevent a premium model from being practical",
    ],
    chooseBIf: [
      "You need the strongest reasoning in this snapshot",
      "Your agents require complex multi-step reliability",
      "The cost is justified by task value",
    ],
  },
  {
    slug: "llama-4-maverick-vs-deepseek-v4-flash",
    aSlug: "llama-4-maverick",
    bSlug: "deepseek-v4-flash",
    keyDifference:
      "Both are low-cost large-context options; Llama 4 Maverick adds vision, while DeepSeek V4 Flash is text-only with lower output pricing.",
    quickVerdict:
      "Llama 4 Maverick is the better low-cost choice when image input matters. DeepSeek V4 Flash is the better pure-text batch choice when output cost dominates.",
    chooseAIf: [
      "You need image input at a low price",
      "You want a large-context open-weight-style option",
      "Your benchmark shows strong enough quality for the task",
    ],
    chooseBIf: [
      "Your workload is text-only",
      "You process very large volumes of documents",
      "Output token cost is the main constraint",
    ],
  },
  {
    slug: "gpt-5.6-luna-vs-qwen3.8-flash",
    aSlug: "gpt-5.6-luna",
    bSlug: "qwen3.8-flash",
    keyDifference:
      "GPT-5.6 Luna has a slight edge on context and tooling; Qwen3.8 Flash is cheaper and supports video input.",
    quickVerdict:
      "GPT-5.6 Luna is better for latency-sensitive agent and coding workflows. Qwen3.8 Flash is better for cost-sensitive multimodal and video intake.",
    chooseAIf: [
      "You want long context with strong tool support",
      "Your workload is lightweight agentic automation",
      "Your tests favor OpenAI output stability",
    ],
    chooseBIf: [
      "You need video or image intake at low cost",
      "Token volume is high and budget matters",
      "Qwen meets your quality threshold in evaluation",
    ],
  },
  {
    slug: "union-alpha-vs-glm-5.3-flash",
    aSlug: "union-alpha",
    bSlug: "glm-5.3-flash",
    keyDifference:
      "Both are revealed stealth models — Union Alpha is Unbiased Pareto (256K, image input, revealed 2026-09-18) and GLM 5.3 Flash is Z.ai's model that was OX Alpha. The practical difference is input type and price: Pareto takes images at $2.50 in / $7.50 out per million, GLM 5.3 Flash is text-only at $0.09 in / $0.30 out.",
    quickVerdict:
      "Pick Pareto when the prompt contains an image; pick GLM 5.3 Flash for text-only work at volume, where it costs roughly a twenty-fifth as much per token. Both now have a named vendor, so the anonymity that made Union Alpha hard to recommend is gone.",
    chooseAIf: [
      "Your prompt includes screenshots, charts or diagrams",
      "You want the Alpha line's newest reveal rather than its oldest",
      "256K of context is enough for the document you are sending",
    ],
    chooseBIf: [
      "The input is text and cost per token matters",
      "You want the longer 1M-class context window",
      "You want the vendor that has been shipping publicly the longest of the three",
    ],
  },
  {
    slug: "union-alpha-vs-mimo-v2.5",
    aSlug: "union-alpha",
    bSlug: "mimo-v2.5",
    keyDifference:
      "Both are Alpha-line stealth models that have since been revealed and billed: Union Alpha is Unbiased Pareto (256K, image input, revealed 2026-09-18, $2.50 in / $7.50 out per million) and MiMo-V2.5 is Xiaomi's (1M, text in, $0.14 in / $0.28 out).",
    quickVerdict:
      "Pareto is the only one of the two that takes images; MiMo-V2.5 is the only one that reaches 1M of context — and costs about a twentieth as much per token. With both codenames retired, the free-versus-known tradeoff that used to separate them no longer exists.",
    chooseAIf: [
      "You are sending images alongside text",
      "You want the newest of the three Alpha-line reveals",
      "You are comparing the Alpha line and want to see how the third one ended",
    ],
    chooseBIf: [
      "You need a 1M-token window rather than 256K",
      "The input is text and you want the cheaper per-token rate",
      "You want the Alpha-line model with the longest public track record",
    ],
  },
  {
    slug: "union-alpha-vs-deepseek-v4-flash",
    aSlug: "union-alpha",
    bSlug: "deepseek-v4-flash",
    keyDifference:
      "Union Alpha is now Unbiased Pareto — a paid multimodal model (256K, images in, $2.50 in / $7.50 out per million) revealed on 2026-09-18. DeepSeek V4 Flash is a text-only model at $0.06 in / $0.12 out with a 1.3M-token window.",
    quickVerdict:
      "Pareto is the pick when the input is an image, which V4 Flash cannot take at all. For text, V4 Flash is roughly forty times cheaper per token with a five-times-larger window — the old 'Union Alpha is free' reasoning disappeared with the reveal.",
    chooseAIf: [
      "You need vision input, which V4 Flash does not offer",
      "You want the model behind the Union Alpha codename specifically",
      "256K of context covers your use case",
    ],
    chooseBIf: [
      "Text-only is enough",
      "You are optimising spend per token at volume",
      "You need a window in the million-token range",
    ],
  },
];

function pairSlug(aSlug: string, bSlug: string) {
  return `${aSlug}-vs-${bSlug}`;
}

export function getComparisonBySlug(slug: string): ResolvedComparison | undefined {
  const pair = comparisonPairs.find((item) => item.slug === slug);
  if (!pair) return undefined;

  const a = resolveModel(pair.aSlug);
  const b = resolveModel(pair.bSlug);
  if (!a || !b) return undefined;

  return { pair, a, b };
}

export function getComparisonsForModel(modelSlug: string) {
  return comparisonPairs
    .filter((pair) => pair.aSlug === modelSlug || pair.bSlug === modelSlug)
    .map((pair) => {
      const a = resolveModel(pair.aSlug);
      const b = resolveModel(pair.bSlug);
      if (!a || !b) return undefined;
      return { pair, a, b } satisfies ResolvedComparison;
    })
    .filter((item): item is ResolvedComparison => Boolean(item));
}

export { pairSlug };
