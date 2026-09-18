/**
 * Site FAQ — single source for both the visible list and the FAQPage JSON-LD.
 *
 * Why this file exists: until 2026-09-18 the FAQ page shipped two different
 * answer sets. The client component told readers the maker was unknown and the
 * model was free; the JSON-LD in page.tsx said it was Xiaomi's mimo-v2. Google
 * read one version and visitors read the other, and both pointed at an Evidence
 * Wall that had been retired. One array, two consumers.
 *
 * Editorial rules for anything added here:
 *   - facts must be re-checkable (catalogue fields, published pricing, our own
 *     dated records); anything else is written as a claim with its source;
 *   - no links to retired pages;
 *   - every answer stands alone — it may be quoted as a snippet without context.
 */

export interface SiteFaq {
  category: "General" | "The Alpha line" | "Access & pricing" | "Method";
  question: string;
  answer: string;
  links?: { href: string; label: string }[];
}

export const siteFaqs: SiteFaq[] = [
  {
    category: "General",
    question: "What is Hunter Alpha?",
    answer:
      "Hunter Alpha was the anonymous codename for the model now sold as Xiaomi MiMo-V2.5. It appeared on OpenRouter in March 2026 with a 1M-token context window and no maker attached, and Xiaomi confirmed the identity that same month. The codename is retired; the model page carries the current facts.",
    links: [
      { href: "/openrouter-models/mimo-v2.5", label: "Xiaomi MiMo-V2.5 details" },
      { href: "/hunter-alpha", label: "Hunter Alpha archive" },
    ],
  },
  {
    category: "General",
    question: "Who created Hunter Alpha?",
    answer:
      "Xiaomi. The release was anonymous at launch — OpenRouter listed no vendor — and Xiaomi confirmed it as their MiMo model line in March 2026. That reveal is the pattern every Alpha-line release has followed since.",
  },
  {
    category: "The Alpha line",
    question: "What are the Alpha models?",
    answer:
      "Alpha is the naming pattern for anonymous models published to OpenRouter as free previews, then claimed and renamed by their maker. Three have now run their course: Hunter Alpha (became Xiaomi MiMo-V2.5), OX Alpha (became Z.ai GLM 5.3 Flash) and Union Alpha (became Unbiased Pareto on 2026-09-18, two days after it appeared). None of the three is anonymous or free any more.",
    links: [
      { href: "/stealth-models", label: "Register of every stealth release" },
      { href: "/alpha-models", label: "How the line works" },
    ],
  },
  {
    category: "The Alpha line",
    question: "Which stealth model is live right now?",
    answer:
      "Union Alpha, as of 2026-09-18: 262,144 tokens of context, up to 131,072 tokens of output, text and image input, and $0 pricing on OpenRouter. Stealth endpoints can be delisted or repriced without notice, so the tracker re-reads the catalogue live rather than trusting a snapshot.",
    links: [
      { href: "/union-alpha", label: "Union Alpha tracker" },
      { href: "/api/union-alpha/status", label: "Live status endpoint" },
    ],
  },
  {
    category: "Access & pricing",
    question: "Is Hunter Alpha still free?",
    answer:
      "No. Hunter Alpha was free while it was anonymous. Once Xiaomi claimed it and it became MiMo-V2.5, it turned into a normal paid model on OpenRouter with published per-million pricing. Free previews on this line have ended every time so far.",
    links: [{ href: "/openrouter-models/mimo-v2.5", label: "Current MiMo-V2.5 pricing" }],
  },
  {
    category: "Access & pricing",
    question: "Is Union Alpha free, and for how long?",
    answer:
      "It bills $0 per million tokens today, verified against the public catalogue. How long that lasts is unknown: the maker is anonymous, no notice period has ever been published for this line, and material published for the model itself lists an anticipated paid price of about $0.50 input / $1.50 output per million once the preview ends.",
    links: [
      { href: "/union-alpha-free", label: "The free window explained" },
      { href: "/union-alpha-opencode", label: "Using it through OpenCode" },
    ],
  },
  {
    category: "Access & pricing",
    question: "Does Hunter Alpha support images?",
    answer:
      "The current catalogue entry for Xiaomi MiMo-V2.5 lists text, vision, audio and video input. The anonymous preview was described as text-only at the time, so treat modality as something to re-check on the model page rather than something fixed for the life of the codename.",
    links: [{ href: "/openrouter-models/mimo-v2.5", label: "MiMo-V2.5 catalogue facts" }],
  },
  {
    category: "General",
    question: "What happens when a stealth model is revealed?",
    answer:
      "Three things, in order: the maker claims it, the codename is retired and the model is renamed to a product name, and the free preview becomes ordinary paid pricing. The old codename usually disappears from the catalogue, which is why our register keeps the history instead of relying on a listing that will not last.",
    links: [{ href: "/stealth-models", label: "What each release became" }],
  },
  {
    category: "Method",
    question: "How do you decide what counts as a fact here?",
    answer:
      "Fields you can re-read — context window, output cap, modalities, tool support, price — are reported as facts with a source and a date. Everything else, including parameter counts, architecture claims and identity theories, is labelled as a claim with whoever said it. We would rather publish a shorter page than a confident-sounding guess.",
    links: [{ href: "/comparison", label: "Compare the models we track" }],
  },
  {
    category: "Method",
    question: "Where do the community discussions happen?",
    answer:
      "Hacker News, Reddit's r/LocalLLaMA and the OpenRouter Discord are where testers compare notes on a new release. The tracker paraphrases what they report and marks it as a claim, never as a specification, and links the original where we can.",
    links: [{ href: "/union-alpha-not-working", label: "Reported failure modes" }],
  },
];
