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
    /*
     * Rewritten 2026-09-22, when the drift check found both had been repriced and
     * they had swapped places: DeepSeek V4 Flash is now the cheaper one to *read*
     * ($0.04 in) and the expensive one to *write* ($0.64 out, 5.3x its old price),
     * while GLM 5.3 Flash moved to $0.15 / $0.50. The old copy called DeepSeek
     * "slightly cheaper" on both, which was true on 2026-09-18 and is now wrong in
     * one direction and right in the other.
     */
    keyDifference:
      "GLM 5.3 Flash adds vision and video input at $0.15 in / $0.50 out per million. DeepSeek V4 Flash is text-only, with the cheaper input of the two ($0.04) and the dearer output ($0.64). Both declare the same 1.31M-token window, so the window is not the tiebreaker it looks like.",
    quickVerdict:
      "Since the 2026-09-22 repricing this is a read-versus-write decision rather than a cheaper-versus-dearer one. DeepSeek V4 Flash wins on anything that reads a lot and writes a little; GLM 5.3 Flash wins on mixed-media input and on generation.",
    chooseAIf: [
      "Your workload is text-only",
      "You send far more input than you expect back — classification, extraction, retrieval, log triage",
      "You want the lowest input price in the snapshot at $0.04 per million",
    ],
    chooseBIf: [
      "You need image or video input",
      "The job writes a lot: GLM's output costs $0.50 against DeepSeek's $0.64",
      "You want one model for mixed-media extraction across a 1.31M-token window",
    ],
  },
  {
    slug: "mimo-v2.5-vs-deepseek-v4-flash",
    aSlug: "mimo-v2.5",
    bSlug: "deepseek-v4-flash",
    keyDifference:
      "Xiaomi MiMo-V2.5 supports multimodal input at $0.14 in / $0.28 out per million. DeepSeek V4 Flash is text-only, cheaper to read at $0.04 in and dearer to write at $0.64 out since its 2026-09-22 repricing.",
    quickVerdict:
      "MiMo-V2.5 is the one to test for mixed-media input, and it is the cheaper model per output token. DeepSeek V4 Flash is the better fit for pure-text work whose output is short — the two swap places as soon as the job starts generating.",
    chooseAIf: [
      "You need image, audio or video input",
      "You want one model across mixed-media analysis",
      "Your tests show strong long-context retention for MiMo",
    ],
    chooseBIf: [
      "Your workload is text-only and high-volume",
      "You expect far more input tokens than output tokens — summarization, extraction, log triage",
      "You are building pipelines where the answer is a label, not a paragraph",
    ],
  },
  {
    slug: "mimo-v2.5-vs-glm-5.3-flash",
    aSlug: "mimo-v2.5",
    bSlug: "glm-5.3-flash",
    keyDifference:
      "GLM 5.3 Flash has the larger context window (1.31M against 1.05M) and now the higher price after its 2026-09-22 repricing ($0.15 in / $0.50 out per million). MiMo-V2.5 adds audio input at $0.14 in / $0.28 out.",
    quickVerdict:
      "GLM 5.3 Flash is still the pick when the document genuinely needs more than a million tokens of window. MiMo-V2.5 is now the cheaper of the two for everything else, and the only one of the pair that takes audio.",
    chooseAIf: [
      "You need audio plus image or video input",
      "Your real documents favor MiMo's retrieval behavior",
      "You want the cheaper of the two per token, output included",
    ],
    chooseBIf: [
      "You want the larger context window: 1.31M tokens",
      "Your workload is bulk media extraction, images and video rather than audio",
      "Your documents run past the 1.05M line",
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
      "Both are revealed stealth models — Union Alpha is Unbiased Pareto (256K, image input, revealed 2026-09-18) and GLM 5.3 Flash is Z.ai's model that was OX Alpha. The practical difference is input type and price: Pareto takes images at $2.50 in / $7.50 out per million, GLM 5.3 Flash takes images and video too at $0.15 in / $0.50 out.",
    quickVerdict:
      "Pick Pareto only when something else about it wins your evaluation — it is roughly fifteen times the price per token, and since the 2026-09-22 repricing GLM 5.3 Flash is cheaper on both directions than it was. Both now have a named vendor, so the anonymity that made Union Alpha hard to recommend is gone.",
    chooseAIf: [
      "Your prompt includes screenshots, charts or diagrams",
      "You want the Alpha line's newest reveal rather than its oldest",
      "256K of context is enough for the document you are sending",
    ],
    chooseBIf: [
      "Cost per token matters: GLM is about a fifteenth of the price",
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
      "Union Alpha is now Unbiased Pareto — a paid multimodal model (256K, images in, $2.50 in / $7.50 out per million) revealed on 2026-09-18. DeepSeek V4 Flash is a text-only model at $0.04 in / $0.64 out with a 1.3M-token window, repriced on 2026-09-22.",
    quickVerdict:
      "Pareto is the pick when the input is an image, which V4 Flash cannot take at all. For text the gap is uneven rather than uniform: V4 Flash costs about a sixty-second of Pareto's input price and about a twelfth of its output price, with a five-times-larger window — the old 'Union Alpha is free' reasoning disappeared with the reveal, and the arithmetic on the other side moved on 2026-09-22.",
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
  /*
   * The MiMo-V2.6 line, added 2026-09-22 — the day after the three entries
   * appeared in the catalogue. These are the comparisons a reader has to make
   * before choosing inside one release: which tier, and whether the speed
   * edition's 10x price is worth it.
   */
  {
    slug: "mimo-v2.6-flash-vs-mimo-v2.6-pro",
    aSlug: "mimo-v2.6-flash",
    bSlug: "mimo-v2.6-pro",
    keyDifference:
      "Same release, same 1.05M-token window and the same four input modalities. Flash is $0.14 in / $0.28 out per million; Pro is $0.435 in / $0.87 out — 3.1x the price.",
    quickVerdict:
      "Start on Flash and keep it unless your own evaluation shows Pro winning on the work you actually do. The only published number separating them is Pro's Artificial Analysis intelligence index of 46.3, and the catalogue carries no equivalent for Flash — so the tier difference is currently asserted rather than measured.",
    chooseAIf: [
      "Cost per token is the constraint, which it is for anything running at volume",
      "Your task is classification, extraction, routing or summarization rather than open-ended generation",
      "You want the cheaper cached input: $0.0028 per million against Pro's $0.0036",
    ],
    chooseBIf: [
      "You have evaluated both on your own prompts and Pro wins",
      "The workload is the flagship one: long agent traces, hard reasoning, low tolerance for a wrong answer",
      "A 3.1x price difference is small next to the cost of the failure you are preventing",
    ],
  },
  {
    slug: "mimo-v2.6-flash-vs-deepseek-v4-flash",
    aSlug: "mimo-v2.6-flash",
    bSlug: "deepseek-v4-flash",
    keyDifference:
      "The two cheapest tiers in the snapshot, read differently. MiMo-V2.6-Flash costs $0.14 / $0.28 per million and takes image, audio and video. DeepSeek V4 Flash costs $0.04 to read and $0.64 to write, and takes text only — both around a 1M-token window.",
    quickVerdict:
      "DeepSeek V4 Flash is cheaper to read and much dearer to write; since the repricing its output costs 16x its input, which makes it a reading model. MiMo-V2.6-Flash is the safer default because the two directions are priced within a factor of two of each other and it accepts media, so a workload that changes shape does not force a migration.",
    chooseAIf: [
      "You want one cheap model for whatever arrives: text, screenshots, audio or clips",
      "Your input-to-output ratio is uncertain or changes with the features you ship",
      "You want a working output price: $0.28 per million against $0.64",
    ],
    chooseBIf: [
      "You are certain the workload reads far more than it writes",
      "You want the cheapest input in the snapshot at $0.04 per million",
      "Text-only is acceptable and the window is the part that matters",
    ],
  },
  {
    slug: "mimo-v2.6-pro-vs-mimo-v2.6-pro-ultraspeed",
    aSlug: "mimo-v2.6-pro",
    bSlug: "mimo-v2.6-pro-ultraspeed",
    keyDifference:
      "The catalogue describes both as the same 1T MiMo-V2.6-Pro checkpoint and says UltraSpeed matches Pro's quality. UltraSpeed costs exactly 10x more: $4.35 in / $8.70 out per million against $0.435 / $0.87.",
    quickVerdict:
      "This is a speed purchase, and the catalogue does not publish the speed number — no latency or throughput figure appears for either entry. Buy UltraSpeed only after measuring it against Pro on your own path; otherwise the 10x is a premium paid on faith, and at $8.70 per million output tokens it is the most expensive entry in the snapshot.",
    chooseAIf: [
      "You have not measured the latency difference on your own workload",
      "The job is a batch, an overnight run or anything a user is not waiting on",
      "You would rather spend the 10x on more attempts at the cheaper tier",
    ],
    chooseBIf: [
      "A human is waiting on each call and you have measured the gap yourself",
      "The workload is an interactive control loop — an agent picking its next action, a live UI",
      "Pro's latency is the thing that fails your product, not its quality",
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
