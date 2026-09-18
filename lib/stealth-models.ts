import type { HubModel } from "./openrouter-models";

/**
 * Codename models that comparison pages link to by their codename slug.
 *
 * Deliberately kept OUT of `openrouterModels` (the curated snapshot): a codename
 * is not a catalogue entry, and the daily `npm run sync-models` drift check treats
 * a curated model that has vanished as a failure. Union Alpha is the worked
 * example — on 2026-09-18 it was revealed as `unbiased/pareto` and the stealth
 * route was delisted, and the checks stayed green because nothing here claims to
 * be a live catalog row.
 *
 * The fields below are the post-reveal facts. If you add an entry, re-read it
 * against the catalogue the same day: `id` should be the ID that actually
 * resolves, even when the name is a retired codename.
 */
export const stealthModels: HubModel[] = [
  {
    id: "unbiased/pareto",
    slug: "union-alpha",
    name: "Union Alpha",
    vendor: "Unbiased",
    contextWindow: 262_144,
    maxOutput: 131_072,
    inputPricePerMillion: 2.5,
    outputPricePerMillion: 7.5,
    modalities: ["Text", "Vision"],
    bestFor: ["Agents", "Long Context", "Multimodal"],
    strengths: [
      "The third Alpha-line codename, revealed as Unbiased Pareto on 2026-09-18",
      "262K context with a 128K output cap",
      "Accepts images as well as text",
      "Tool calling and response_format supported",
    ],
    limitations: [
      "No longer free: the stealth window lasted two days (16–18 September 2026)",
      "The stealth ID does not resolve — call unbiased/pareto instead",
      "Costs roughly 20–40x the budget tier of this comparison set per token",
      "Community testing suggested an orchestrated system rather than one model; unproven either way",
    ],
    dataAsOf: "2026-09-18",
  },
];

export function getStealthModelBySlug(slug: string): HubModel | undefined {
  return stealthModels.find((model) => model.slug === slug);
}
