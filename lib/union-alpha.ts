/**
 * Union Alpha — live stealth-model tracker data (single source for page + API).
 *
 * Two kinds of content live here and must never be mixed in the UI:
 * - verifiedSpecs / timeline entries marked as spec: read from the OpenRouter public
 *   catalog and re-checkable at any time.
 * - communityClaims: unverified public discussion, paraphrased and attributed.
 *   Never present these as facts.
 *
 * Verified: 2026-09-17 (catalog read: 262144 ctx, $0/$0, text+image, provider "Stealth")
 */

export const UNION_ALPHA_MODEL_ID = "stealth/union-alpha";
export const UNION_ALPHA_DATA_AS_OF = "2026-09-17";
export const UNION_ALPHA_ADDED_AT_UTC = "2026-09-16T14:42:03Z";
export const UNION_ALPHA_OPENROUTER_URL = "https://openrouter.ai/stealth/union-alpha";

export interface VerifiedSpec {
  label: string;
  value: string;
  note?: string;
}

/** Facts taken straight from OpenRouter's public model catalog. */
export const verifiedSpecs: VerifiedSpec[] = [
  {
    label: "OpenRouter ID",
    value: UNION_ALPHA_MODEL_ID,
    note: "Listed under the anonymous stealth namespace.",
  },
  {
    label: "Maker",
    value: "Undisclosed",
    note: 'Provider shown as "Stealth". No lab has publicly claimed it.',
  },
  {
    label: "Context window",
    value: "262,144 tokens (256K)",
    note: "A quarter of the 1M window of the earlier Alpha models.",
  },
  {
    label: "Max output",
    value: "131,072 tokens (128K)",
    note: "Reported by the single serving endpoint.",
  },
  {
    label: "Modality",
    value: "Text + image in, text out",
    note: "First Alpha-line stealth model that accepts images; Hunter Alpha and OX Alpha were text-only.",
  },
  {
    label: "Pricing",
    value: "Free — $0 in / $0 out",
    note: "Free stealth previews have historically been repriced or delisted without notice.",
  },
  {
    label: "Supported parameters",
    value: "tools, tool_choice (auto), response_format, temperature, top_p, max_tokens",
    note: "Tool calling is enabled — the feature agent builders need.",
  },
  {
    label: "Reported uptime",
    value: "~100% (last 5 min and 24 h)",
    note: "Single endpoint, provider tag stealth.",
  },
  {
    label: "Added to OpenRouter",
    value: "2026-09-16 14:42 UTC",
    note: "Unix timestamp 1789569723.",
  },
  {
    label: "Architecture claim (third-party)",
    value: "Model orchestrator, not a single model",
    note: "A public landing page for the model describes it as running multiple LLMs in parallel and synthesising one answer. Matches the router theory testers raised on day one. Not confirmed by OpenRouter or the maker.",
  },
  {
    label: "Expected paid pricing (third-party)",
    value: "$0.50 in / $1.50 out per million tokens",
    note: "Same public landing page lists this as anticipated pricing after the free preview. Today the OpenRouter endpoint still bills $0.",
  },
];

export interface CommunityClaim {
  claim: string;
  evidence: string;
  confidence: "Medium" | "Low";
}

/**
 * Public speculation, paraphrased and attributed. Kept separate from verified specs
 * on purpose so the page never blurs the two.
 */
export const communityClaims: CommunityClaim[] = [
  {
    claim: "Union Alpha may be a router over several models rather than one model.",
    evidence:
      "Testers in the launch discussion on Hacker News reported inconsistent behaviour between sessions and argued that the name points at an ensemble or routing layer. The model's own answers about its identity are not reliable evidence either way.",
    confidence: "Medium",
  },
  {
    claim: "The routing layer may include a GLM-family model.",
    evidence:
      "The same discussion claimed one underlying model comes from the GLM family (Z.ai), with no reproducible test published. Unverified.",
    confidence: "Low",
  },
  {
    claim: "Tool-use quirks that reminded testers of Gemini.",
    evidence:
      "One tester reported the model looping on an interactive-editor command during a git rebase, a failure mode they associated with Gemini models. Single anecdote.",
    confidence: "Low",
  },
  {
    claim: "A system prompt may tell the model to stay anonymous.",
    evidence:
      "A commenter described an alleged injected instruction telling the model to answer Union Alpha and call its maker anonymous when asked. The claim cannot be verified from outside and may itself be a hallucination.",
    confidence: "Low",
  },
];

export interface TimelineEntry {
  date: string;
  title: string;
  detail: string;
}

export const timeline: TimelineEntry[] = [
  {
    date: "2026-09-16 14:42 UTC",
    title: "First listed on OpenRouter",
    detail:
      "stealth/union-alpha appears in the public catalog under the anonymous stealth namespace.",
  },
  {
    date: "2026-09-16 15:24 UTC",
    title: "Community picks it up",
    detail:
      "A Hacker News submission about the new stealth model starts collecting test reports within the hour.",
  },
  {
    date: "2026-09-16",
    title: "Identity guessing starts",
    detail:
      "Testers report inconsistent behaviour, fuelling a router/ensemble theory and a possible GLM link; others suspect a Gemini-family model.",
  },
  {
    date: "2026-09-17",
    title: "Specs re-verified against the catalog",
    detail:
      "256K context, 128K max output, free pricing, text+image input and tool support confirmed by a direct catalog read.",
  },
];

export interface TrackerFaq {
  question: string;
  answer: string;
}

export const unionAlphaFaqs: TrackerFaq[] = [
  {
    question: "What is Union Alpha?",
    answer:
      "Union Alpha is an anonymous AI model that appeared on OpenRouter on 2026-09-16 under the stealth namespace. OpenRouter describes it as a multimodal model built for research, coding and agentic workflows. The maker has not been disclosed.",
  },
  {
    question: "Is Union Alpha free?",
    answer:
      "Yes. It is currently listed at $0 per million input and output tokens. Free stealth previews are usually limited-time: earlier Alpha-line models were repriced or delisted after the maker was revealed, so do not build anything that depends on the free window.",
  },
  {
    question: "Who made Union Alpha?",
    answer:
      "Unknown. No lab has claimed it. Community discussion suggests it may be a router over several models rather than a single one, and that a GLM-family model might be involved, but none of that is verified.",
  },
  {
    question: "How much context does Union Alpha have?",
    answer:
      "262,144 tokens of context and up to 131,072 tokens of output — 256K in, 128K out. That is smaller than the 1M-token windows of Hunter Alpha and OX Alpha.",
  },
  {
    question: "Does Union Alpha support images and tool calling?",
    answer:
      "Yes to both. OpenRouter lists the modality as text+image input, and the endpoint declares tools, tool_choice (auto), response_format, temperature, top_p and max_tokens as supported parameters.",
  },
  {
    question: "How do I use Union Alpha?",
    answer:
      "Create an OpenRouter account, pick stealth/union-alpha in the model list, or call it through the OpenRouter API with that model ID. No separate key from the mystery maker is needed.",
  },
  {
    question: "Will Union Alpha be revealed like Hunter Alpha and OX Alpha were?",
    answer:
      "Probably, but there is no schedule. Hunter Alpha turned out to be Xiaomi MiMo-V2.5 and OX Alpha turned out to be Z.ai GLM 5.3 Flash; both were revealed after their free windows ended. Union Alpha is the third model in that line.",
  },
  {
    question: "Should I trust Union Alpha with sensitive data?",
    answer:
      "No. The provider is anonymous and there is no published privacy or data-retention policy. Treat it like any unvetted free endpoint: no production secrets, no customer data, no credentials in prompts.",
  },
  {
    question: "Is Union Alpha a single model or several models?",
    answer:
      "Evidence points to a single endpoint that orchestrates several models: testers reported inconsistent behaviour between sessions on day one, and a public landing page for the model describes it as running multiple LLMs in parallel and synthesising one answer. That would also explain why asking the model about its own identity gives unreliable answers. Neither OpenRouter nor the maker has confirmed it.",
  },
  {
    question: "How much will Union Alpha cost after the free preview?",
    answer:
      "Unconfirmed, but the model's public landing page lists anticipated pricing of $0.50 per million input tokens and $1.50 per million output tokens once the preview ends. Right now OpenRouter still bills $0 for it, and free stealth previews have historically ended without much warning.",
  },
  {
    question: "What are Union Alpha's benchmarks?",
    answer:
      "There is no peer-reviewed benchmark set. The numbers circulating — including a Terminal-Bench v4 style cost-per-task figure on the model's own landing page — are self-reported or estimated, not independently reproduced. Treat benchmark claims for an anonymous model as marketing until someone publishes a reproducible run.",
  },
];
