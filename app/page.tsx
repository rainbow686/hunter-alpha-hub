import Link from "next/link";
import { Metadata } from "next";
import { Card } from "@/components/card";
import { WebSiteSchema, BreadcrumbListSchema } from "@/components/structured-data";
import {
  defaultScenarios,
  modelHubDataAsOf,
  modelsForScenario,
} from "@/lib/openrouter-models";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "OpenRouter Model Hub — Compare AI Models: Pricing, Context & Benchmarks",
  description:
    "Compare 15+ AI models on OpenRouter side-by-side. Pricing, context windows, modality support and practical recommendations for coding, long context, agents and budget workloads.",
  keywords: [
    "openrouter models comparison",
    "best openrouter models",
    "openrouter pricing calculator",
    "openrouter free models",
    "ai model comparison",
    "openrouter model hub",
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "OpenRouter Model Hub — Compare AI Models",
    description:
      "Compare OpenRouter models by pricing, context window, modality and best-use case.",
    siteName: "OpenRouter Model Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpenRouter Model Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenRouter Model Hub — Compare AI Models",
    description:
      "Compare OpenRouter models by pricing, context window, modality and best-use case.",
  },
};

const featuredModels = [
  ...modelsForScenario("Overall", 2),
  ...modelsForScenario("Budget", 2),
].slice(0, 4);

export default function Home() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Find the Right AI Model</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl mb-8" style={{ color: "var(--muted)" }}>
            Compare 15+ AI models on OpenRouter side-by-side. Pricing, context windows, modality
            support and practical recommendations — updated monthly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/comparison"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Compare models
            </Link>
            <Link
              href="/best-openrouter-models"
              className="px-8 py-4 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium hover:bg-violet-500/20 transition-colors"
            >
              See best picks
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-4 mb-16">
          {defaultScenarios.slice(0, 4).map((scenario) => {
            const model = modelsForScenario(scenario.scenario, 1)[0];
            if (!model) return null;
            return (
              <Card key={scenario.title} className="p-6">
                <p className="text-xs font-medium text-violet-300">{scenario.title}</p>
                <p className="text-lg font-bold mt-2" style={{ color: "var(--foreground)" }}>
                  {model.name}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  {model.formerAlias ? `formerly ${model.formerAlias}` : model.vendor}
                </p>
              </Card>
            );
          })}
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Compare every important field</h2>
            <p className="mb-6" style={{ color: "var(--muted)" }}>
              See context window, input/output pricing per 1M tokens, modality support and the
              workloads each model is actually good for.
            </p>
            <Link
              href="/comparison"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              Open comparison →
            </Link>
          </Card>
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Estimate your monthly cost</h2>
            <p className="mb-6" style={{ color: "var(--muted)" }}>
              Set token volume and input/output mix to estimate monthly spend across several
              models at once.
            </p>
            <Link
              href="/openrouter-pricing-calculator"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              Open calculator →
            </Link>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mb-16">
          {featuredModels.map((model) => (
            <Card key={model.id} className="p-6">
              <h3 className="font-semibold mb-2">{model.name}</h3>
              <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                {model.bestFor.join(" · ")}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {model.formerAlias ? `formerly ${model.formerAlias}` : model.vendor}
              </p>
            </Card>
          ))}
        </section>

        <section className="rounded-xl border p-6" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}>
          <h2 className="text-xl font-bold mb-3">Latest model snapshot</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Model pricing and limits are based on a {modelHubDataAsOf} snapshot. We use this to keep
            the comparison page consistent and easy to read.
          </p>
        </section>
      </div>

      <WebSiteSchema
        name="OpenRouter Model Hub"
        url={baseUrl}
        description="Compare AI models on OpenRouter by pricing, context window, modality and best-use case."
      />
      <BreadcrumbListSchema items={[{ name: "Home", url: baseUrl }]} />
    </>
  );
}
