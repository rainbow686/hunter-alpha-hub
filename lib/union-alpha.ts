/**
 * Union Alpha — live stealth-model tracker data (single source for page + API).
 *
 * Two kinds of content live here and must never be mixed in the UI:
 * - verifiedSpecs / timeline entries marked as spec: read from the OpenRouter public
 *   catalog and re-checkable at any time.
 * - communityClaims: unverified public discussion, paraphrased and attributed.
 *   Never present these as facts.
 *
 * Verified: 2026-09-18 — the codename is over. OpenRouter's stealth page says the
 * model "was developed and operated by Unbiased, revealed to be Unbiased Pareto",
 * `stealth/union-alpha` is gone from the catalog (404 on the single-model endpoint)
 * and `unbiased/pareto` is listed at 262,144 context with paid pricing. The rows
 * below keep the anonymous-era facts *and* the post-reveal facts, labelled, because
 * the whole point of this page is the before/after.
 */

export const UNION_ALPHA_MODEL_ID = "stealth/union-alpha";
export const UNION_ALPHA_DATA_AS_OF = "2026-09-18";
export const UNION_ALPHA_ADDED_AT_UTC = "2026-09-16T14:42:03Z";
export const UNION_ALPHA_OPENROUTER_URL = "https://openrouter.ai/stealth/union-alpha";

/**
 * The reveal. Facts, all re-checkable:
 *   - the stealth page states the developer and the real name;
 *   - `unbiased/pareto` is in the catalog with the same 262K window;
 *   - pricing is $0.0000025 in / $0.0000075 out per token = $2.50 / $7.50 per 1M.
 */
export const UNION_ALPHA_REVEALED_AT = "2026-09-18";
export const UNION_ALPHA_REVEAL = {
  vendor: "Unbiased",
  name: "Unbiased Pareto",
  modelId: "unbiased/pareto",
  contextWindow: 262144,
  inputPricePerMillion: 2.5,
  outputPricePerMillion: 7.5,
  source: "https://openrouter.ai/stealth/union-alpha",
} as const;

/**
 * The one-sentence version of the reveal. Four pages in the cluster have to
 * state it (what is it, is it free, how do I use it, why is it failing) and both
 * apps render those four pages — eight copies of a dated sentence is eight
 * chances to be stale, so the sentence lives here once.
 */
export const UNION_ALPHA_REVEAL_SENTENCE =
  `Union Alpha was ${UNION_ALPHA_REVEAL.name} (${UNION_ALPHA_REVEAL.modelId}), by ${UNION_ALPHA_REVEAL.vendor}. ` +
  `The free stealth/union-alpha route is gone from OpenRouter's catalogue, and the same model — same ` +
  `${UNION_ALPHA_REVEAL.contextWindow.toLocaleString("en-US")} context window — is now billed at ` +
  `$${UNION_ALPHA_REVEAL.inputPricePerMillion.toFixed(2)} in / $${UNION_ALPHA_REVEAL.outputPricePerMillion.toFixed(2)} out per million tokens.`;

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
    note: "The stealth route — no longer served; the catalog answers 404 for it.",
  },
  {
    label: "Maker",
    value: "Unbiased",
    note: 'Revealed 2026-09-18: OpenRouter\'s stealth page says the model was "developed and operated by Unbiased".',
  },
  {
    label: "Revealed as",
    value: `${UNION_ALPHA_REVEAL.name} (${UNION_ALPHA_REVEAL.modelId})`,
    note: "Same 262,144-token window; now billed rather than free.",
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
    label: "Also served through",
    value: "OpenCode free tier",
    note: "Third-party reports (including a Japanese write-up and the model's own landing page) say the same anonymous model is reachable from OpenCode's free tier as well as OpenRouter. Same weights, different front door — verify before relying on it.",
  },
  {
    label: "Reported early usage",
    value: "~2B tokens in the first day",
    note: "A third-party news digest cited roughly 2 billion tokens consumed within 24 hours of launch. Directional evidence that the free window is genuinely popular, not a precise figure.",
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
  {
    date: "2026-09-18",
    title: "Revealed: it is Unbiased Pareto",
    detail:
      "OpenRouter's stealth page now states the model was developed and operated by Unbiased, revealed to be Unbiased Pareto. The catalog lists unbiased/pareto with the same 262,144-token window, priced $2.50 in / $7.50 out per 1M tokens.",
  },
  {
    date: "2026-09-18",
    title: "The stealth route disappears",
    detail:
      "stealth/union-alpha is removed from the catalog — the single-model endpoint answers 404 and no stealth namespace is listed any more. The free window is over for good; the product continues under its real name.",
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
      "Union Alpha was the anonymous codename for an OpenRouter stealth model listed on 2026-09-16. It was revealed on 2026-09-18 as Unbiased Pareto, made by Unbiased — the third Alpha-line codename to be disclosed, after Hunter Alpha (Xiaomi MiMo-V2.5) and OX Alpha (Z.ai GLM 5.3 Flash).",
  },
  {
    question: "Is Union Alpha free?",
    answer:
      "It was, for the two days of the stealth window. The stealth route is gone from the catalog and the revealed model, unbiased/pareto, is billed at $2.50 per 1M input tokens and $7.50 per 1M output tokens. If you are looking for the free endpoint, it no longer exists.",
  },
  {
    question: "Who made Union Alpha?",
    answer:
      "Unbiased. OpenRouter's stealth page states the model was developed and operated by Unbiased and revealed as Unbiased Pareto, and unbiased/pareto is listed in the public catalog.",
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
      "You cannot — stealth/union-alpha is no longer served. Use unbiased/pareto on OpenRouter instead; it is the same model with the same 262,144-token context window, now billed.",
  },
  {
    question: "Will Union Alpha be revealed like Hunter Alpha and OX Alpha were?",
    answer:
      "It already was: on 2026-09-18, two days after it appeared. The pattern held a third time — Hunter Alpha → Xiaomi MiMo-V2.5, OX Alpha → Z.ai GLM 5.3 Flash, Union Alpha → Unbiased Pareto.",
  },
  {
    question: "Should I trust Union Alpha with sensitive data?",
    answer:
      "The stealth endpoint is gone, so the question is now about Unbiased Pareto: the provider is named instead of anonymous, and the stealth terms noted that prompts and completions may have been retained by the provider but not used for training. Treat any preview model as unvetted for production secrets.",
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
