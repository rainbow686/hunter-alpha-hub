import Link from "next/link";
import { Metadata } from "next";
import { Card } from "@/components/card";
import { ModelTable } from "@/components/model-table";
import {
  FAQSchema,
  BreadcrumbListSchema,
  ArticleSchema,
} from "@/components/structured-data";
import {
  openrouterModels,
  modelHubDataAsOf,
  modelsForScenario,
} from "@/lib/openrouter-models";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/comparison`;

const faqs = [
  {
    question: "What is the best model on OpenRouter for coding?",
    answer:
      "Claude Sonnet 5, Claude Opus 5 and GPT-5.6 Sol are strong general-purpose choices for coding. Sonnet 5 is often the best price/quality default; Opus 5 is better for difficult architecture or debugging work.",
  },
  {
    question: "Which OpenRouter model has the largest context window?",
    answer:
      "In the current snapshot, DeepSeek V4 Flash and GLM 5.3 Flash offer about 1.31M tokens, with several other models around 1M tokens. Always verify provider-specific limits before long-context production use.",
  },
  {
    question: "What is the cheapest model on OpenRouter?",
    answer:
      "DeepSeek V4 Flash, GLM 5.3 Flash and Llama 4 Maverick are among the lowest-cost options. For free routes, see our free models page; some free models have rate limits and smaller context windows.",
  },
  {
    question: "Are there free models on OpenRouter?",
    answer:
      "Yes. OpenRouter exposes some models with a :free suffix. These are useful for testing and low-volume workloads, but rate limits, context limits and quality vary significantly.",
  },
  {
    question: "What happened to Hunter Alpha and OX Alpha?",
    answer:
      "Hunter Alpha is now known as Xiaomi MiMo-V2.5 and OX Alpha was revealed as GLM 5.3 Flash. We keep those names as historical aliases, but no longer treat them as primary SEO targets.",
  },
  {
    question: "How do OpenRouter models compare to ChatGPT?",
    answer:
      "OpenRouter is not a single model; it is a model router and marketplace. The best comparison depends on the model you choose, the input modality, context length and pricing tier.",
  },
];

export const metadata: Metadata = {
  title: "OpenRouter Models Comparison 2026: Pricing, Context & Best Picks",
  description:
    "Compare major AI models on OpenRouter side-by-side: pricing per million tokens, context window, modality, and best-use recommendations for coding, long context, agents and budget workloads.",
  keywords: [
    "openrouter models comparison",
    "best openrouter models",
    "openrouter pricing calculator",
    "openrouter model comparison 2026",
    "openrouter free models",
    "ai model comparison",
    "mimo-v2.5 comparison",
    "glm 5.3 flash comparison",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "OpenRouter Models Comparison 2026",
    description:
      "Compare OpenRouter models by pricing, context window, modality and best-use case.",
    url: pageUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenRouter Models Comparison 2026",
    description: "Compare OpenRouter models by pricing, context window, modality and best-use case.",
  },
};

export default function ComparisonPage() {
  const scenarios = [
    { name: "Best overall", scenario: "Overall" as const },
    { name: "Best for coding", scenario: "Coding" as const },
    { name: "Best for long context", scenario: "Long Context" as const },
    { name: "Best for budget", scenario: "Budget" as const },
    { name: "Best multimodal", scenario: "Multimodal" as const },
    { name: "Best for agents", scenario: "Agents" as const },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">OpenRouter Models Compared</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg" style={{ color: "var(--muted)" }}>
            Which AI model should you use? Compare context windows, pricing per million tokens,
            modality support and best-fit workloads across the OpenRouter ecosystem.
          </p>
          <p className="mt-4 text-sm px-4 py-2 rounded-lg inline-block border border-violet-500/30 bg-violet-500/10 text-violet-300">
            Updated: {modelHubDataAsOf}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {scenarios.map((item) => {
            const model = modelsForScenario(item.scenario, 1)[0];
            if (!model) return null;
            return (
              <Card key={item.name} className="p-5">
                <p className="text-xs font-medium text-violet-300">{item.name}</p>
                <p className="text-lg font-bold mt-2" style={{ color: "var(--foreground)" }}>
                  {model.name}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  {model.formerAlias ? `formerly ${model.formerAlias}` : model.vendor}
                </p>
              </Card>
            );
          })}
        </div>

        <section id="all-models" className="mb-16">
          <h2 className="text-2xl font-bold mb-6">All models in this comparison</h2>
          <Card className="p-4 md:p-6">
            <ModelTable models={openrouterModels} linkToModelPages />
          </Card>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            Pricing is shown as input/output per 1M tokens and is based on a {modelHubDataAsOf} snapshot.
            Provider limits and surcharges can change.
          </p>
        </section>

        <section id="best-picks" className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Best picks by workload</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {scenarios.map((item) => (
              <Card key={item.name} className="p-6">
                <h3 className="text-lg font-semibold mb-3">{item.name}</h3>
                <ul className="space-y-3">
                  {modelsForScenario(item.scenario, 3).map((model, index) => (
                    <li key={model.id} className="flex items-start gap-3">
                      <span className="text-violet-400 font-bold">{index + 1}.</span>
                      <div>
                        <p className="font-medium" style={{ color: "var(--foreground)" }}>
                          {model.name}
                        </p>
                        <p className="text-sm" style={{ color: "var(--muted)" }}>
                          {model.strengths[0]}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/openrouter-pricing-calculator"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Estimate monthly cost
          </Link>
          <Link
            href="/best-openrouter-models"
            className="px-6 py-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium hover:bg-violet-500/20 transition-colors"
          >
            See best picks
          </Link>
        </div>
      </div>

      <ArticleSchema
        title="OpenRouter Models Comparison 2026"
        image={`${baseUrl}/og-image.png`}
        description="Compare major AI models on OpenRouter by pricing, context window, modality and best-use case."
        url={pageUrl}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "OpenRouter Models Comparison", url: pageUrl },
        ]}
      />
    </>
  );
}
