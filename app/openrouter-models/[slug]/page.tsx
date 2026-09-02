import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/components/card";
import { OutboundOpenRouterLink } from "@/components/outbound-openrouter-link";
import { ArticleSchema, BreadcrumbListSchema } from "@/components/structured-data";
import {
  defaultScenarios,
  formatContextWindow,
  formatPrice,
  getModelBySlug,
  openrouterModels,
  openrouterModelUrl,
} from "@/lib/openrouter-models";

const baseUrl = "https://www.hunteralphahub.com";

interface ModelPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return openrouterModels.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({
  params,
}: ModelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = getModelBySlug(slug);

  if (!model) {
    return {
      title: "Model not found | OpenRouter Model Hub",
      robots: { index: false, follow: false },
    };
  }

  const title = `${model.name} on OpenRouter: Pricing, Context & Best Uses`;
  const description = `${model.name} costs ${formatPrice(model.inputPricePerMillion)} input and ${formatPrice(model.outputPricePerMillion)} output per 1M tokens, with ${formatContextWindow(model.contextWindow)} context. See strengths, limitations and best-fit workloads.`;

  return {
    title,
    description,
    keywords: [
      model.name,
      `${model.name} pricing`,
      `${model.name} context window`,
      `${model.name} OpenRouter`,
      ...(model.formerAlias ? [`${model.formerAlias} revealed`] : []),
    ],
    alternates: {
      canonical: `${baseUrl}/openrouter-models/${model.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/openrouter-models/${model.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function OpenRouterModelPage({ params }: ModelPageProps) {
  const { slug } = await params;
  const model = getModelBySlug(slug);

  if (!model) {
    notFound();
  }

  const pageUrl = `${baseUrl}/openrouter-models/${model.slug}`;

  const relatedModels = openrouterModels
    .filter(
      (candidate) =>
        candidate.slug !== model.slug &&
        candidate.bestFor.some((scenario) => model.bestFor.includes(scenario)),
    )
    .slice(0, 3);

  const scenarioCopy = defaultScenarios.filter((scenario) =>
    model.bestFor.includes(scenario.scenario),
  );

  const costWorkloads = [
    { name: "Quick test", inputTokens: 20_000, outputTokens: 5_000 },
    { name: "Product chat month", inputTokens: 500_000, outputTokens: 125_000 },
    { name: "Document batch", inputTokens: 5_000_000, outputTokens: 1_000_000 },
  ].map((workload) => ({
    ...workload,
    cost:
      (workload.inputTokens / 1_000_000) * model.inputPricePerMillion +
      (workload.outputTokens / 1_000_000) * model.outputPricePerMillion,
  }));

  const curlCommand = [
    'curl https://openrouter.ai/api/v1/chat/completions \\',
    '  -H "Authorization: Bearer $OPENROUTER_API_KEY" \\',
    '  -H "Content-Type: application/json" \\',
    '  -d \'{\'',
    '    "model": "' + model.id + '",',
    '    "messages": [{ "role": "user", "content": "Summarize this document in five bullet points." }],',
    '    "max_tokens": 500',
    '  }\'',
  ].join("\n");

  const javascriptCommand = [
    'const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {',
    '  method: "POST",',
    '  headers: {',
    '    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,',
    '    "Content-Type": "application/json",',
    '  },',
    '  body: JSON.stringify({',
    '    model: "' + model.id + '",',
    '    messages: [{ role: "user", content: "Summarize this document in five bullet points." }],',
    '    max_tokens: 500,',
    '  }),',
    '});',
    '',
    'const data = await response.json();',
    'console.log(data.choices[0].message.content);',
  ].join("\n");

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <nav className="text-sm mb-6 flex items-center gap-2" style={{ color: "var(--muted)" }}>
          <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/openrouter-models" className="hover:text-violet-400 transition-colors">
            OpenRouter Models
          </Link>
          <span>/</span>
          <span className="text-violet-400">{model.slug}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">{model.name}</span>
          </h1>
          <p className="max-w-3xl text-lg" style={{ color: "var(--muted)" }}>
            {model.name} is served by {model.vendor} through OpenRouter. It provides{" "}
            {formatContextWindow(model.contextWindow)} of context and supports{" "}
            {model.modalities.join(", ").toLowerCase()} inputs.
          </p>
          {model.formerAlias && (
            <p className="mt-4 text-sm px-4 py-2 rounded-lg inline-block border border-amber-500/30 bg-amber-500/10 text-amber-300">
              Formerly known as {model.formerAlias}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card className="p-6">
            <p className="text-xs font-medium text-violet-300">Context window</p>
            <p className="text-2xl font-bold mt-2">{formatContextWindow(model.contextWindow)}</p>
          </Card>
          <Card className="p-6">
            <p className="text-xs font-medium text-violet-300">Input / 1M tokens</p>
            <p className="text-2xl font-bold mt-2">{formatPrice(model.inputPricePerMillion)}</p>
          </Card>
          <Card className="p-6">
            <p className="text-xs font-medium text-violet-300">Output / 1M tokens</p>
            <p className="text-2xl font-bold mt-2">{formatPrice(model.outputPricePerMillion)}</p>
          </Card>
        </div>

        <Card className="p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold mb-5">Key facts</h2>
          <dl className="grid md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-semibold mb-1">Provider</dt>
              <dd className="text-sm" style={{ color: "var(--muted)" }}>{model.vendor}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold mb-1">OpenRouter ID</dt>
              <dd className="text-sm font-mono" style={{ color: "var(--muted)" }}>{model.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold mb-1">Modalities</dt>
              <dd className="text-sm" style={{ color: "var(--muted)" }}>{model.modalities.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold mb-1">Best for</dt>
              <dd className="text-sm" style={{ color: "var(--muted)" }}>{model.bestFor.join(", ")}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6 md:p-8 mb-12">
          <h2 className="text-xl font-bold mb-5">Best-fit workloads</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {scenarioCopy.map((scenario) => (
              <div
                key={scenario.scenario}
                className="rounded-lg border p-4"
                style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}
              >
                <p className="font-medium" style={{ color: "var(--foreground)" }}>{scenario.title}</p>
                <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>{scenario.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold mb-2">Cost estimates</h2>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            These examples use the {model.dataAsOf} input and output prices. Cache discounts,
            provider surcharges and tool fees are excluded.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: "var(--card-border)" }}>
              <thead>
                <tr>
                  {["Workload", "Input", "Output", "Estimated cost"].map((heading) => (
                    <th key={heading} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
                {costWorkloads.map((workload) => (
                  <tr key={workload.name}>
                    <td className="px-3 py-4 text-sm font-medium" style={{ color: "var(--foreground)" }}>{workload.name}</td>
                    <td className="px-3 py-4 text-sm font-mono" style={{ color: "var(--muted)" }}>{workload.inputTokens.toLocaleString()}</td>
                    <td className="px-3 py-4 text-sm font-mono" style={{ color: "var(--muted)" }}>{workload.outputTokens.toLocaleString()}</td>
                    <td className="px-3 py-4 text-sm font-bold" style={{ color: "var(--foreground)" }}>{formatPrice(workload.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Strengths</h2>
            <ul className="space-y-3">
              {model.strengths.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Limitations</h2>
            <ul className="space-y-3">
              {model.limitations.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">!</span>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-6 md:p-8 mb-12">
          <h2 className="text-xl font-bold mb-2">OpenRouter API quickstart</h2>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            Run these examples from your server or edge function. Keep the OpenRouter API key private
            and do not expose it in browser code.
          </p>
          <h3 className="font-semibold mb-3">cURL</h3>
          <pre className="overflow-x-auto rounded-lg p-4 text-xs leading-relaxed mb-6" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)", border: "1px solid" }}>
            <code>{curlCommand}</code>
          </pre>
          <h3 className="font-semibold mb-3">JavaScript / TypeScript</h3>
          <pre className="overflow-x-auto rounded-lg p-4 text-xs leading-relaxed" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)", border: "1px solid" }}>
            <code>{javascriptCommand}</code>
          </pre>
        </Card>

        <Card className="p-6 md:p-8 mb-12">
          <h2 className="text-xl font-bold mb-4">How to evaluate {model.name}</h2>
          <ol className="space-y-3 text-sm" style={{ color: "var(--muted)" }}>
            <li>1. Run five real tasks from your product, not generic demo prompts.</li>
            <li>2. Record token usage, latency and output quality.</li>
            <li>3. Estimate cost using your real input/output mix.</li>
            <li>4. Compare it against one model with a similar price and one stronger model.</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/comparison"
              className="px-5 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Compare models
            </Link>
            <OutboundOpenRouterLink
              href={openrouterModelUrl(model.id)}
              target="_blank"
              rel="noopener noreferrer"
              modelId={model.id}
              trackingLocation="model_detail_cta"
              className="px-5 py-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium hover:bg-violet-500/20 transition-colors"
            >
              View on OpenRouter
            </OutboundOpenRouterLink>
          </div>
        </Card>

        {relatedModels.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Related models</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedModels.map((candidate) => (
                <Link
                  key={candidate.id}
                  href={`/openrouter-models/${candidate.slug}`}
                  className="block"
                >
                  <Card className="p-4 h-full hover:border-violet-500/50 transition-colors">
                    <p className="font-medium" style={{ color: "var(--foreground)" }}>
                      {candidate.name}
                    </p>
                    <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                      {formatContextWindow(candidate.contextWindow)} · {formatPrice(candidate.inputPricePerMillion)} input
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Pricing and context data are based on a {model.dataAsOf} snapshot. Provider limits can
          change; always verify on OpenRouter before production.
        </p>
      </div>

      <ArticleSchema
        title={`${model.name} on OpenRouter`}
        description={`${model.name} pricing, context window, strengths, limitations and best-use cases.`}
        url={pageUrl}
        publishedAt={model.dataAsOf}
        updatedAt={model.dataAsOf}
      />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "OpenRouter Models", url: `${baseUrl}/openrouter-models` },
          { name: model.name, url: pageUrl },
        ]}
      />
    </>
  );
}
