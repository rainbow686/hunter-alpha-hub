import { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { ArticleSchema, BreadcrumbListSchema, ItemListSchema } from "@/components/structured-data";
import {
  defaultScenarios,
  modelHubDataAsOf,
  modelsForScenario,
} from "@/lib/openrouter-models";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/best-openrouter-models`;

export const metadata: Metadata = {
  title: "Best OpenRouter Models for Coding, Long Context & Budget (2026)",
  description:
    "A practical list of the best OpenRouter models by scenario: coding, long context, budget, multimodal work and agents. Updated with current pricing and context windows.",
  keywords: [
    "best openrouter models",
    "openrouter models for coding",
    "openrouter long context models",
    "openrouter budget models",
    "openrouter multimodal models",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Best OpenRouter Models for Coding, Long Context & Budget",
    description: "A practical list of the best OpenRouter models by scenario.",
    url: pageUrl,
    type: "website",
  },
};

export default function BestOpenRouterModelsPage() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Best OpenRouter Models</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg" style={{ color: "var(--muted)" }}>
            Not one universal winner — a practical list by workload. Use these picks for coding,
            long documents, high-volume extraction, multimodal work and agents.
          </p>
          <p className="mt-4 text-sm px-4 py-2 rounded-lg inline-block border border-violet-500/30 bg-violet-500/10 text-violet-300">
            Data snapshot: {modelHubDataAsOf}
          </p>
        </div>

        <div className="space-y-8">
          {defaultScenarios.map((scenario) => (
            <Card key={scenario.title} className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{scenario.title}</h2>
                  <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                    {scenario.description}
                  </p>
                </div>
                <Link
                  href="/comparison"
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Full comparison →
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {modelsForScenario(scenario.scenario, 3).map((model, index) => (
                  <div
                    key={model.id}
                    className="rounded-lg p-4 border"
                    style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}
                  >
                    <p className="text-xs text-violet-300">#{index + 1} pick</p>
                    <Link href={`/openrouter-models/${model.slug}`} className="font-semibold mt-2 inline-block hover:text-violet-400 transition-colors">{model.name}</Link>
                    <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
                      {model.strengths[0]}
                    </p>
                    <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
                      {model.formerAlias ? `formerly ${model.formerAlias}` : model.vendor}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ArticleSchema
        title="Best OpenRouter Models for Coding, Long Context & Budget"
        image={`${baseUrl}/og-image.png`}
        description="A practical list of the best OpenRouter models by scenario, with current pricing and context windows."
        url={pageUrl}
      />
      <ItemListSchema
        name="Best OpenRouter models by scenario"
        items={defaultScenarios.flatMap((scenario) =>
          modelsForScenario(scenario.scenario, 1).map((model) => ({
            name: `${scenario.title}: ${model.name}`,
            url: `${baseUrl}/openrouter-models/${model.slug}`,
          })),
        )}
      />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Best OpenRouter Models", url: pageUrl },
        ]}
      />
    </>
  );
}
