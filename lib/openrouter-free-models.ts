/**
 * Curated free routes on OpenRouter, for /openrouter-free-models.
 *
 * Why this file exists (2026-09-18): the page used to hold its list inline, and
 * an inline list is a list nobody watches. Read it against the live catalogue
 * that day and two of six entries were wrong:
 *   - minimax/minimax-m3:free no longer existed — the model still does, its
 *     `:free` route does not, so the page listed a model you cannot call;
 *   - z-ai/glm-5.2:free was described as 256K context; the catalogue says
 *     32,768 — wrong by roughly 8x.
 * Neither was visible from the page, which is exactly the problem: a hardcoded
 * field cannot be checked by reading the page. `npm run sync-models` now
 * validates every entry here against the catalogue, so the next drift is a
 * failing CI run rather than a quiet falsehood.
 *
 * Only `:free` routes are included. A model that happens to be cheap is not a
 * free route, and the difference is the whole point of the page.
 */

export interface FreeModel {
  id: string;
  name: string;
  contextWindow: number;
  bestFor: string;
}

/** Date every field below was read from the public catalogue. */
export const FREE_MODELS_DATA_AS_OF = "2026-09-18";

export const freeModels: FreeModel[] = [
  {
    id: "stealth/union-alpha",
    name: "Union Alpha",
    contextWindow: 262_144,
    bestFor: "Agentic + vision experiments · maker still anonymous",
  },
  {
    id: "nvidia/nemotron-3.5-lightning:free",
    name: "NVIDIA Nemotron 3.5 Lightning",
    contextWindow: 1_000_000,
    bestFor: "Long-context testing",
  },
  {
    id: "thinkingmachines/inkling:free",
    name: "Thinking Machines Inkling",
    contextWindow: 1_048_576,
    bestFor: "General experimentation",
  },
  {
    id: "z-ai/glm-5.2:free",
    name: "Z.ai GLM 5.2",
    contextWindow: 32_768,
    bestFor: "Light multimodal work (small window — check before long inputs)",
  },
  {
    id: "openrouter/free",
    name: "Free Models Router",
    contextWindow: 200_000,
    bestFor: "Simple free-tier routing",
  },
];

export function getFreeModel(id: string): FreeModel | undefined {
  return freeModels.find((model) => model.id === id);
}
