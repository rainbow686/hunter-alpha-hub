import Link from "next/link";
import { Metadata } from "next";
import { Card } from "@/components/card";
import { BreadcrumbListSchema, ItemListSchema } from "@/components/structured-data";
import {
  formatContextWindow,
  formatPrice,
  modelHubDataAsOf,
  openrouterModels,
} from "@/lib/openrouter-models";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/openrouter-models`;

export const metadata: Metadata = {
  title: "OpenRouter Models Directory: Pricing, Context & Use Cases",
  description:
    "Browse a curated directory of OpenRouter models with context windows, input/output pricing, modalities and practical use-case guidance.",
  keywords: [
    "openrouter models",
    "openrouter model directory",
    "openrouter pricing",
    "openrouter context window",
    "ai model directory",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "OpenRouter Models Directory",
    description:
      "Browse curated OpenRouter models by pricing, context window, modality and use case.",
    url: pageUrl,
    type: "website",
  },
};

export default function OpenRouterModelsDirectoryPage() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">OpenRouter Models Directory</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg" style={{ color: "var(--muted)" }}>
            A curated view of models on OpenRouter. Each page includes pricing, context limits,
            strengths, limitations and practical recommendations.
          </p>
          <p className="mt-4 text-sm px-4 py-2 rounded-lg inline-block border border-violet-500/30 bg-violet-500/10 text-violet-300">
            Snapshot: {modelHubDataAsOf}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {openrouterModels.map((model) => (
            <Card key={model.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                    {model.name}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                    {model.vendor} · {model.id}
                  </p>
                </div>
                {model.formerAlias && (
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-300">
                    formerly {model.formerAlias}
                  </span>
                )}
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs" style={{ color: "var(--muted)" }}>Context</dt>
                  <dd className="font-medium">{formatContextWindow(model.contextWindow)}</dd>
                </div>
                <div>
                  <dt className="text-xs" style={{ color: "var(--muted)" }}>Input / Output / 1M</dt>
                  <dd className="font-medium">
                    {formatPrice(model.inputPricePerMillion)} / {formatPrice(model.outputPricePerMillion)}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                {model.strengths[0]}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <Link
                  href={`/openrouter-models/${model.slug}`}
                  className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
                >
                  View model page →
                </Link>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {model.bestFor.join(", ")}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ItemListSchema
        name="OpenRouter models directory"
        items={openrouterModels.map((model) => ({
          name: model.name,
          url: `${pageUrl}/${model.slug}`,
        }))}
      />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "OpenRouter Models", url: pageUrl },
        ]}
      />
    </>
  );
}
