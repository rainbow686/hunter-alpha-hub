import { NextResponse } from "next/server";
import { UNION_ALPHA_MODEL_ID } from "@/lib/union-alpha";

/**
 * GET /api/union-alpha/status
 *
 * Live status for the Union Alpha stealth model, read from the OpenRouter public
 * catalog. Stealth models can be delisted without notice, so the tracker page checks
 * this endpoint instead of trusting a build-time snapshot.
 */
export const dynamic = "force-dynamic";

interface CatalogModel {
  id?: string;
  name?: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
  architecture?: {
    modality?: string;
    input_modalities?: string[];
    output_modalities?: string[];
  };
  top_provider?: {
    context_length?: number;
    max_completion_tokens?: number;
    is_moderated?: boolean;
  };
}

export async function GET() {
  const checkedAt = new Date().toISOString();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { online: null, checkedAt, error: `OpenRouter returned ${response.status}` },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as { data?: CatalogModel[] };
    const model = (payload.data ?? []).find((entry) => entry.id === UNION_ALPHA_MODEL_ID);

    if (!model) {
      return NextResponse.json({
        online: false,
        checkedAt,
        modelId: UNION_ALPHA_MODEL_ID,
        note: "No longer listed in the OpenRouter catalog.",
      });
    }

    const prompt = Number(model.pricing?.prompt ?? 0);
    const completion = Number(model.pricing?.completion ?? 0);

    return NextResponse.json({
      online: true,
      checkedAt,
      modelId: model.id,
      name: model.name,
      contextWindow: model.context_length ?? model.top_provider?.context_length ?? null,
      maxOutput: model.top_provider?.max_completion_tokens ?? null,
      inputModalities: model.architecture?.input_modalities ?? [],
      outputModalities: model.architecture?.output_modalities ?? [],
      free: prompt === 0 && completion === 0,
      pricingPerMillion: { input: prompt * 1_000_000, output: completion * 1_000_000 },
    });
  } catch (error) {
    return NextResponse.json(
      {
        online: null,
        checkedAt,
        error: error instanceof Error ? error.message : "Unknown fetch failure",
      },
      { status: 502 },
    );
  }
}
