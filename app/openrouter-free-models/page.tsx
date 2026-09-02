import { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { ArticleSchema, BreadcrumbListSchema, ItemListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/openrouter-free-models`;

const freeModels = [
  {
    id: "nvidia/nemotron-3.5-lightning:free",
    name: "NVIDIA Nemotron 3.5 Lightning",
    context: "1M tokens",
    bestFor: "Long-context testing",
  },
  {
    id: "thinkingmachines/inkling:free",
    name: "Thinking Machines Inkling",
    context: "1M tokens",
    bestFor: "General experimentation",
  },
  {
    id: "minimax/minimax-m3:free",
    name: "MiniMax M3",
    context: "1M tokens",
    bestFor: "Large-context experiments",
  },
  {
    id: "z-ai/glm-5.2:free",
    name: "Z.ai GLM 5.2",
    context: "256K tokens",
    bestFor: "Light multimodal work",
  },
  {
    id: "openrouter/free",
    name: "Free Models Router",
    context: "200K tokens",
    bestFor: "Simple free-tier routing",
  },
];

export const metadata: Metadata = {
  title: "OpenRouter Free Models: Practical Guide & Limits",
  description:
    "A practical guide to OpenRouter free models: what is available, context limits, best-fit workloads and when to upgrade to a paid route.",
  keywords: [
    "openrouter free models",
    "openrouter free tier",
    "free ai models",
    "free 1m context model",
    "openrouter free limit",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "OpenRouter Free Models",
    description: "A practical guide to OpenRouter free models and limits.",
    url: pageUrl,
    type: "website",
  },
};

export default function FreeModelsPage() {
  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">OpenRouter Free Models</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg" style={{ color: "var(--muted)" }}>
            Free routes are useful for testing, small projects and low-volume workloads. But they
            often have rate limits, context limits and variable provider capacity.
          </p>
        </div>

        <Card className="p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Notable free options</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: "var(--card-border)" }}>
              <thead>
                <tr>
                  {["Model", "Context", "Best for"].map((heading) => (
                    <th
                      key={heading}
                      className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "var(--muted)" }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
                {freeModels.map((model) => (
                  <tr key={model.id}>
                    <td className="px-3 py-4">
                      <p className="font-medium">{model.name}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {model.id}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-sm">{model.context}</td>
                    <td className="px-3 py-4 text-sm" style={{ color: "var(--muted)" }}>
                      {model.bestFor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/comparison"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Compare paid models
          </Link>
          <Link
            href="/openrouter-pricing-calculator"
            className="px-6 py-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium hover:bg-violet-500/20 transition-colors"
          >
            Estimate paid cost
          </Link>
        </div>
      </div>

      <ArticleSchema
        title="OpenRouter Free Models: Practical Guide & Limits"
        image={`${baseUrl}/og-image.png`}
        description="A practical guide to OpenRouter free models, including context limits, rate limits and best-fit workloads."
        url={pageUrl}
      />
      <ItemListSchema
        name="OpenRouter free models"
        items={freeModels.map((model) => ({
          name: model.name,
          url: `https://openrouter.ai/${model.id}`,
        }))}
      />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "OpenRouter Free Models", url: pageUrl },
        ]}
      />
    </>
  );
}
