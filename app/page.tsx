import Link from "next/link";
import { Metadata } from "next";
import { Card } from "@/components/card";
import { WebSiteSchema, BreadcrumbListSchema } from "@/components/structured-data";
import {
  defaultScenarios,
  formatContextWindow,
  formatPrice,
  getModelBySlug,
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

/**
 * Hunter Alpha is the reason this domain has any search traffic: the page below
 * ranks around position 2.8 for "hunter alpha ai" and 6.9 for "hunter alpha
 * openrouter" on the strength of the domain name — the homepage never actually
 * mentioned the model. The section answers that query in words, and reads its
 * numbers from the catalogue entry it became, so they cannot drift.
 */
const hunterAlpha = getModelBySlug("mimo-v2.5");

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

        <section className="mb-12">
          <Link href="/union-alpha" className="block">
            <Card className="p-6 hover:border-violet-500/50 transition-colors">
              <div className="flex flex-wrap items-center gap-4">
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                  New stealth model
                </span>
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                  Union Alpha just landed on OpenRouter
                </span>
                <span className="text-sm" style={{ color: "var(--muted)" }}>
                  256K context · free · image input · maker anonymous
                </span>
                <span className="ml-auto text-sm text-violet-400">Follow the tracker →</span>
              </div>
            </Card>
          </Link>
        </section>

        {/*
          The three-tier entry point from ADR-0012: one live codename, the register
          that grows with every release, and the comparison hub. Everything else on
          the site hangs off these.
        */}
        <section className="grid md:grid-cols-3 gap-4 mb-16">
          <Link href="/union-alpha" className="block">
            <Card className="p-5 h-full hover:border-violet-500/50 transition-colors">
              <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                Union Alpha <span className="text-xs text-emerald-400 align-middle">live now</span>
              </div>
              <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
                The anonymous release that is free today: verified specs, live status, and what is
                still only a claim.
              </p>
            </Card>
          </Link>
          <Link href="/stealth-models" className="block">
            <Card className="p-5 h-full hover:border-violet-500/50 transition-colors">
              <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                Every stealth release
              </div>
              <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
                The register: each anonymous model, what it turned out to be, and what it costs after
                the reveal.
              </p>
            </Card>
          </Link>
          <Link href="/comparison" className="block">
            <Card className="p-5 h-full hover:border-violet-500/50 transition-colors">
              <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                Compare before you commit
              </div>
              <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
                Price, context window and modality side by side, including what the free anonymous
                model looks like next to paid ones.
              </p>
            </Card>
          </Link>
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

        {hunterAlpha && (
          <section
            className="rounded-xl border p-6 mb-16"
            style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}
          >
            <h2 className="text-2xl font-bold mb-3">Hunter Alpha on OpenRouter</h2>
            <p className="text-sm leading-relaxed mb-4 max-w-3xl" style={{ color: "var(--muted)" }}>
              Hunter Alpha was the anonymous model that appeared on OpenRouter in March 2026 with a
              1M-token context window and no maker attached. It did not stay anonymous: it was
              confirmed as <strong style={{ color: "var(--foreground)" }}>{hunterAlpha.name}</strong>{" "}
              in the same month, and it is now a normal paid model on OpenRouter at{" "}
              {formatPrice(hunterAlpha.inputPricePerMillion)} in /{" "}
              {formatPrice(hunterAlpha.outputPricePerMillion)} out per million tokens with a{" "}
              {formatContextWindow(hunterAlpha.contextWindow)} window. If you came here looking for
              the codename, that is the model you want.
            </p>
            <p className="text-sm leading-relaxed mb-4 max-w-3xl" style={{ color: "var(--muted)" }}>
              The codename still circulates in a few spellings — <em>alpha hunter</em>,{" "}
              <em>hunteralpha</em>, <em>Hunter-Alpha</em> — and it also lives on as history: this site
              started as a tracker for it. The line it belonged to is still running, and the current
              anonymous release is <Link href="/union-alpha" className="text-violet-400 hover:underline">Union Alpha</Link>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/openrouter-models/${hunterAlpha.slug}`}
                className="px-5 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
              >
                {hunterAlpha.name} details →
              </Link>
              <Link
                href="/hunter-alpha"
                className="px-5 py-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-semibold hover:bg-violet-500/20 transition-colors"
              >
                Hunter Alpha archive
              </Link>
              <Link
                href="/stealth-models"
                className="px-5 py-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-semibold hover:bg-violet-500/20 transition-colors"
              >
                Every stealth release
              </Link>
            </div>
          </section>
        )}

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
