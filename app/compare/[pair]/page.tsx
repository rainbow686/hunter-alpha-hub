import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/components/card";
import {
  ArticleSchema,
  BreadcrumbListSchema,
  FAQSchema,
} from "@/components/structured-data";
import { OutboundOpenRouterLink } from "@/components/outbound-openrouter-link";
import {
  comparisonPairs,
  getComparisonBySlug,
} from "@/lib/openrouter-comparisons";
import {
  formatContextWindow,
  formatPrice,
  openrouterModelUrl,
} from "@/lib/openrouter-models";

const baseUrl = "https://www.hunteralphahub.com";

export const dynamicParams = false;

interface ComparePageProps {
  params: Promise<{ pair: string }>;
}

export function generateStaticParams() {
  return comparisonPairs.map((comparison) => ({ pair: comparison.slug }));
}

export async function generateMetadata({
  params,
}: ComparePageProps): Promise<Metadata> {
  const { pair } = await params;
  const comparison = getComparisonBySlug(pair);

  if (!comparison) {
    return {
      title: "Comparison not found | OpenRouter Model Hub",
      robots: { index: false, follow: false },
    };
  }

  const { a, b } = comparison;
  const title = `${a.name} vs ${b.name}: OpenRouter Pricing, Context & Best Fit`;
  const description = `Compare ${a.name} and ${b.name} on OpenRouter: context window, input/output pricing, modalities, strengths, limitations and which workload each model fits best.`;

  return {
    title,
    description,
    keywords: [
      `${a.name} vs ${b.name}`,
      `${a.slug} vs ${b.slug}`,
      "OpenRouter model comparison",
      `${a.name} pricing`,
      `${b.name} pricing`,
    ],
    alternates: {
      canonical: `${baseUrl}/compare/${comparison.pair.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/compare/${comparison.pair.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function workloadCost(model: { inputPricePerMillion: number; outputPricePerMillion: number }, inputTokens: number, outputTokens: number) {
  return (
    (inputTokens / 1_000_000) * model.inputPricePerMillion +
    (outputTokens / 1_000_000) * model.outputPricePerMillion
  );
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { pair } = await params;
  const comparison = getComparisonBySlug(pair);
  if (!comparison) notFound();

  const { a, b, pair: comparisonPair } = comparison;
  const pageUrl = `${baseUrl}/compare/${comparisonPair.slug}`;
  const workloads = [
    { name: "Quick test", inputTokens: 20_000, outputTokens: 5_000 },
    { name: "Product chat month", inputTokens: 500_000, outputTokens: 125_000 },
    { name: "Document batch", inputTokens: 5_000_000, outputTokens: 1_000_000 },
  ];

  const faqs = [
    {
      question: `Is ${a.name} cheaper than ${b.name}?`,
      answer: `${a.name} costs ${formatPrice(a.inputPricePerMillion)} input and ${formatPrice(a.outputPricePerMillion)} output per 1M tokens. ${b.name} costs ${formatPrice(b.inputPricePerMillion)} input and ${formatPrice(b.outputPricePerMillion)} output per 1M tokens.`,
    },
    {
      question: `Which model has the larger context window?`,
      answer: `${a.name} offers ${formatContextWindow(a.contextWindow)}; ${b.name} offers ${formatContextWindow(b.contextWindow)}. Provider-specific limits can vary by route.`,
    },
    {
      question: `Which one should I choose?`,
      answer: comparisonPair.quickVerdict,
    },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <nav className="text-sm mb-6 flex items-center gap-2 flex-wrap" style={{ color: "var(--muted)" }}>
          <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/comparison" className="hover:text-violet-400 transition-colors">Comparison</Link>
          <span>/</span>
          <span className="text-violet-400">{a.slug} vs {b.slug}</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{a.name} vs {b.name}</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg" style={{ color: "var(--muted)" }}>
            {comparisonPair.keyDifference}
          </p>
        </div>

        <Card className="p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick verdict</h2>
          <p className="text-lg" style={{ color: "var(--foreground)" }}>{comparisonPair.quickVerdict}</p>
        </Card>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Side-by-side comparison</h2>
          <Card className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y" style={{ borderColor: "var(--card-border)" }}>
                <thead>
                  <tr>
                    {["Field", a.name, b.name].map((heading) => (
                      <th key={heading} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
                  <tr>
                    <td className="px-3 py-4 text-sm font-semibold">Provider</td>
                    <td className="px-3 py-4 text-sm">{a.vendor}</td>
                    <td className="px-3 py-4 text-sm">{b.vendor}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-4 text-sm font-semibold">Context window</td>
                    <td className="px-3 py-4 text-sm">{formatContextWindow(a.contextWindow)}</td>
                    <td className="px-3 py-4 text-sm">{formatContextWindow(b.contextWindow)}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-4 text-sm font-semibold">Input / 1M</td>
                    <td className="px-3 py-4 text-sm">{formatPrice(a.inputPricePerMillion)}</td>
                    <td className="px-3 py-4 text-sm">{formatPrice(b.inputPricePerMillion)}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-4 text-sm font-semibold">Output / 1M</td>
                    <td className="px-3 py-4 text-sm">{formatPrice(a.outputPricePerMillion)}</td>
                    <td className="px-3 py-4 text-sm">{formatPrice(b.outputPricePerMillion)}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-4 text-sm font-semibold">Modalities</td>
                    <td className="px-3 py-4 text-sm">{a.modalities.join(", ")}</td>
                    <td className="px-3 py-4 text-sm">{b.modalities.join(", ")}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-4 text-sm font-semibold">Best for</td>
                    <td className="px-3 py-4 text-sm">{a.bestFor.join(", ")}</td>
                    <td className="px-3 py-4 text-sm">{b.bestFor.join(", ")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Cost estimates</h2>
          <Card className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y" style={{ borderColor: "var(--card-border)" }}>
                <thead>
                  <tr>
                    {["Workload", "Input", "Output", a.name, b.name].map((heading) => (
                      <th key={heading} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
                  {workloads.map((workload) => (
                    <tr key={workload.name}>
                      <td className="px-3 py-4 text-sm font-medium">{workload.name}</td>
                      <td className="px-3 py-4 text-sm font-mono">{workload.inputTokens.toLocaleString()}</td>
                      <td className="px-3 py-4 text-sm font-mono">{workload.outputTokens.toLocaleString()}</td>
                      <td className="px-3 py-4 text-sm font-bold">{formatPrice(workloadCost(a, workload.inputTokens, workload.outputTokens))}</td>
                      <td className="px-3 py-4 text-sm font-bold">{formatPrice(workloadCost(b, workload.inputTokens, workload.outputTokens))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            Estimates use list input/output prices and exclude cache discounts, provider surcharges and tool fees.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Choose {a.name} if</h2>
            <ul className="space-y-3">
              {comparisonPair.chooseAIf.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>{item}</span>
                </li>
              ))}
            </ul>
            <OutboundOpenRouterLink
              href={openrouterModelUrl(a.id)}
              target="_blank"
              rel="noopener noreferrer"
              modelId={a.id}
              trackingLocation="compare_page_a_cta"
              className="mt-6 inline-flex px-5 py-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium hover:bg-violet-500/20 transition-colors"
            >
              View {a.name} on OpenRouter
            </OutboundOpenRouterLink>
          </Card>
          <Card className="p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Choose {b.name} if</h2>
            <ul className="space-y-3">
              {comparisonPair.chooseBIf.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>{item}</span>
                </li>
              ))}
            </ul>
            <OutboundOpenRouterLink
              href={openrouterModelUrl(b.id)}
              target="_blank"
              rel="noopener noreferrer"
              modelId={b.id}
              trackingLocation="compare_page_b_cta"
              className="mt-6 inline-flex px-5 py-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium hover:bg-violet-500/20 transition-colors"
            >
              View {b.name} on OpenRouter
            </OutboundOpenRouterLink>
          </Card>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href={`/openrouter-models/${a.slug}`} className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity">
            {a.name} details
          </Link>
          <Link href={`/openrouter-models/${b.slug}`} className="px-6 py-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium hover:bg-violet-500/20 transition-colors">
            {b.name} details
          </Link>
          <Link href="/openrouter-pricing-calculator" className="px-6 py-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium hover:bg-violet-500/20 transition-colors">
            Estimate monthly cost
          </Link>
        </div>

        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Pricing and context data are based on a {a.dataAsOf} snapshot. Provider limits and pricing can change; verify on OpenRouter before production.
        </p>
      </div>

      <ArticleSchema
        title={`${a.name} vs ${b.name}`}
        description={`Compare ${a.name} and ${b.name} by pricing, context window, modalities and best-fit workloads.`}
        url={pageUrl}
        image={`${baseUrl}/og-image.png`}
        publishedAt={a.dataAsOf}
        updatedAt={a.dataAsOf}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Comparison", url: `${baseUrl}/comparison` },
          { name: `${a.name} vs ${b.name}`, url: pageUrl },
        ]}
      />
    </>
  );
}
