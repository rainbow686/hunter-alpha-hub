/**
 * Validates the curated OpenRouter Model Hub snapshot against OpenRouter's
 * public model catalog.
 *
 * Usage:
 *   npm run sync-models
 *
 * Exit codes:
 *   0 = every curated model exists and factual fields match
 *   1 = the catalog is unreachable or the snapshot has drifted
 */

import { openrouterModels, type HubModel } from "../lib/openrouter-models.ts";

const CATALOG_URL = "https://openrouter.ai/api/v1/models";
const PRICE_EPSILON = 0.000_001;

interface OpenRouterPricing {
  prompt?: string;
  completion?: string;
}

interface OpenRouterModel {
  id?: string;
  name?: string;
  context_length?: number;
  pricing?: OpenRouterPricing;
  architecture?: {
    input_modalities?: string[];
    modality?: string;
  };
}

interface SnapshotDrift {
  field: string;
  expected: string;
  actual: string;
}

function mapModalities(model: HubModel): string[] {
  return model.modalities.map((modality) => modality.toLowerCase());
}

function mapOpenRouterModalities(remote: OpenRouterModel): string[] {
  const inputModalities = remote.architecture?.input_modalities;

  if (inputModalities?.length) {
    return inputModalities.map((modality) =>
      modality === "image" ? "vision" : modality === "file" ? "files" : modality,
    );
  }

  return (remote.architecture?.modality ?? "")
    .split("->")[0]
    .split("+")
    .filter(Boolean)
    .map((modality) =>
      modality === "image" ? "vision" : modality === "file" ? "files" : modality,
    );
}

function hasDrift(expected: string[], actual: string[]): boolean {
  return expected.length !== actual.length || expected.some((value) => !actual.includes(value));
}

async function main() {
  let response: Response;

  try {
    response = await fetch(CATALOG_URL, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Unable to reach OpenRouter catalog: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }

  if (!response.ok) {
    console.error(`OpenRouter catalog returned ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const payload = (await response.json()) as { data?: OpenRouterModel[] };
  const remoteById = new Map((payload.data ?? []).map((model) => [model.id, model]));
  const missing: string[] = [];
  const drifted: Array<{ id: string; drift: SnapshotDrift[] }> = [];

  for (const model of openrouterModels) {
    const remote = remoteById.get(model.id);

    if (!remote) {
      missing.push(model.id);
      continue;
    }

    const drift: SnapshotDrift[] = [];

    if (typeof remote.context_length === "number" && remote.context_length !== model.contextWindow) {
      drift.push({
        field: "contextWindow",
        expected: model.contextWindow.toLocaleString(),
        actual: remote.context_length.toLocaleString(),
      });
    }

    const remoteInputPrice = Number.parseFloat(remote.pricing?.prompt ?? "");
    const remoteOutputPrice = Number.parseFloat(remote.pricing?.completion ?? "");

    if (Number.isFinite(remoteInputPrice)) {
      const actual = remoteInputPrice * 1_000_000;
      if (Math.abs(actual - model.inputPricePerMillion) > PRICE_EPSILON) {
        drift.push({
          field: "inputPricePerMillion",
          expected: model.inputPricePerMillion.toFixed(6),
          actual: actual.toFixed(6),
        });
      }
    }

    if (Number.isFinite(remoteOutputPrice)) {
      const actual = remoteOutputPrice * 1_000_000;
      if (Math.abs(actual - model.outputPricePerMillion) > PRICE_EPSILON) {
        drift.push({
          field: "outputPricePerMillion",
          expected: model.outputPricePerMillion.toFixed(6),
          actual: actual.toFixed(6),
        });
      }
    }

    const expectedModalities = mapModalities(model).sort();
    const actualModalities = mapOpenRouterModalities(remote).sort();

    if (hasDrift(expectedModalities, actualModalities)) {
      drift.push({
        field: "modalities",
        expected: expectedModalities.join("+"),
        actual: actualModalities.join("+"),
      });
    }

    if (drift.length > 0) {
      drifted.push({ id: model.id, drift });
    }
  }

  const report = {
    checkedAt: new Date().toISOString(),
    source: CATALOG_URL,
    curatedCount: openrouterModels.length,
    catalogCount: remoteById.size,
    missing,
    drifted,
  };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(
      `Checked ${openrouterModels.length} curated models against ${remoteById.size} OpenRouter models.`,
    );

    for (const id of missing) {
      console.error(`MISSING: ${id}`);
    }

    for (const item of drifted) {
      console.error(`DRIFTED: ${item.id}`);
      for (const change of item.drift) {
        console.error(`  ${change.field}: snapshot=${change.expected}, catalog=${change.actual}`);
      }
    }
  }

  if (missing.length > 0 || drifted.length > 0) {
    process.exit(1);
  }

  if (!process.argv.includes("--json")) {
    console.log("No factual drift found.");
  }
}

await main();
