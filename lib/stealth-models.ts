import type { HubModel } from "./openrouter-models";

/**
 * Non-curated models that we still want on comparison pages.
 *
 * Deliberately kept OUT of `openrouterModels` (the curated snapshot): stealth
 * models are repriced or delisted without notice, and the daily
 * `npm run sync-models` drift check treats a missing curated model as a failure.
 * Keeping them here means comparisons work without turning that check red.
 */
export const stealthModels: HubModel[] = [
  {
    id: "stealth/union-alpha",
    slug: "union-alpha",
    name: "Union Alpha",
    vendor: "Undisclosed (stealth)",
    contextWindow: 262_144,
    maxOutput: 131_072,
    inputPricePerMillion: 0,
    outputPricePerMillion: 0,
    modalities: ["Text", "Vision"],
    bestFor: ["Agents", "Long Context", "Multimodal", "Free"],
    strengths: [
      "Free while the stealth preview lasts",
      "262K context with a 128K output cap",
      "Accepts images as well as text",
      "Tool calling and response_format supported",
    ],
    limitations: [
      "Maker is anonymous — no privacy or data-retention policy",
      "Pricing and availability can change without notice",
      "Behaviour is inconsistent between sessions, which suggests an orchestrated system rather than one model",
      "Not for production or sensitive data",
    ],
    dataAsOf: "2026-09-17",
  },
];

export function getStealthModelBySlug(slug: string): HubModel | undefined {
  return stealthModels.find((model) => model.slug === slug);
}
