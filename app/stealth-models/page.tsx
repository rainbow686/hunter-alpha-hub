import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { ArticleSchema, BreadcrumbListSchema, FAQSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/stealth-models`;

export const metadata: Metadata = {
  title: "Stealth Models on OpenRouter: Every Anonymous Release (Index)",
  description:
    "An index of anonymous stealth models on OpenRouter — Hunter Alpha, OX Alpha and Union Alpha — with what each turned out to be, how the releases are staged, and how to evaluate the next one safely.",
  keywords: [
    "stealth models",
    "stealth model openrouter",
    "anonymous ai model",
    "anonymous model openrouter",
    "stealth ai release",
    "unreleased model codename",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Stealth Models on OpenRouter: Every Anonymous Release",
    description: "Index of anonymous OpenRouter models, what they became, and how to judge the next drop.",
    url: pageUrl,
    type: "article",
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: "Stealth models index" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stealth Models on OpenRouter",
    description: "Every anonymous OpenRouter release we can verify, and what each one became.",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

/** Only entries we can point at a verifiable listing for. */
const index = [
  {
    codename: "Hunter Alpha",
    listed: "2026-03-12",
    href: "/hunter-alpha",
    turnedOutToBe: "Xiaomi MiMo-V2.5",
    verified: "Yes — maker disclosed, model renamed and repriced",
  },
  {
    codename: "OX Alpha",
    listed: "2026-08-20",
    href: "/ox-alpha",
    turnedOutToBe: "Z.ai GLM 5.3 Flash",
    verified: "Yes — maker disclosed, model renamed and repriced",
  },
  {
    codename: "Union Alpha",
    listed: "2026-09-16",
    href: "/union-alpha",
    turnedOutToBe: "Unclaimed",
    verified: "No — live now, maker anonymous",
  },
];

/**
 * The accumulating table — the reason this page exists. Every column is either
 * read from a public catalogue (see the per-model pages) or is this site's own
 * record, and the two are never mixed: a field we cannot re-check is marked.
 *
 * When the next codename drops, add one row here first; the page is the asset,
 * the individual codename pages come and go.
 */
const line = [
  {
    codename: "Hunter Alpha",
    href: "/hunter-alpha",
    listed: "2026-03-12",
    context: "1M",
    modality: "Text only",
    priceWhileAnonymous: "Free",
    revealedAs: "Xiaomi MiMo-V2.5",
    priceAfter: "$0.14 in / $0.28 out per M",
  },
  {
    codename: "OX Alpha",
    href: "/ox-alpha",
    listed: "2026-08-20",
    context: "1M",
    modality: "Text only",
    priceWhileAnonymous: "Free",
    revealedAs: "Z.ai GLM 5.3 Flash",
    priceAfter: "$0.09 in / $0.30 out per M",
  },
  {
    codename: "Union Alpha",
    href: "/union-alpha",
    listed: "2026-09-16",
    context: "256K",
    modality: "Text + image in",
    priceWhileAnonymous: "Free",
    revealedAs: "Unclaimed",
    priceAfter: "Unknown — reported ≈$0.50 / $1.50 per M",
  },
];

/**
 * What the reveal actually did to the two models we can follow all the way
 * through, in the currency a reader cares about: what you pay afterwards.
 */
const revealEffect = [
  {
    codename: "Hunter Alpha",
    became: "Xiaomi MiMo-V2.5",
    took: "11 days",
    detail:
      "Free preview ended with the reveal; the model reappeared as a Xiaomi product with published pricing and a 1.05M-token window.",
  },
  {
    codename: "OX Alpha",
    became: "Z.ai GLM 5.3 Flash",
    took: "Weeks",
    detail:
      "Z.ai claimed it as GLM 5.3 Flash and folded it into the vendor line at list price, with the largest window on this site at 1.31M tokens.",
  },
];

/** The checklist for the next drop — deliberately short enough to actually run. */
const checklist = [
  {
    step: "Confirm it is in the catalogue",
    detail:
      "A codename has to resolve to a real listing before it means anything. Ours is a live read, not a screenshot: /api/union-alpha/status is the shape to copy.",
  },
  {
    step: "Check what the endpoint declares",
    detail:
      "Context window, output cap, modalities and tool support come from the catalogue and can be re-read in seconds. Everything else is commentary.",
  },
  {
    step: "Read the price as a countdown",
    detail:
      "While it is free, the model is in a trial. The day the price stops being $0 is the day the reveal is either done or imminent.",
  },
  {
    step: "Separate the community's claims from the listing",
    detail:
      "Identity theories are worth reading and worthless as evidence. Keep them in a separate column or a separate section — never blended into a spec table.",
  },
  {
    step: "Decide before the window closes, not after",
    detail:
      "If you evaluate a stealth endpoint, evaluate it in days and keep a fallback configured. The two reveals we documented both ended the free window with no notice.",
  },
];

const faqs = [
  {
    question: "What is a stealth model?",
    answer:
      "A model published to a public catalogue — most often OpenRouter — with no announcement, no maker name and usually no price while it is in preview. The codename is temporary: if the release goes well the maker claims it and renames it to a product name.",
  },
  {
    question: "How long does a stealth model stay anonymous?",
    answer:
      "In the cases we can verify, weeks rather than months. Hunter Alpha was revealed as Xiaomi MiMo-V2.5 and OX Alpha as Z.ai GLM 5.3 Flash; both kept their free window only until the reveal, then were repriced. Treat the anonymous phase as a trial period, not a stable endpoint.",
  },
  {
    question: "Are there other stealth codenames besides the three listed here?",
    answer:
      "Codenames appear in forums that we cannot verify against a public listing — and once a model is revealed, the old codename usually disappears from the catalogue entirely, which is why this index only lists releases we can document. If a codename is not in the table, we have no evidence for it.",
  },
  {
    question: "Is it safe to build on a stealth model?",
    answer:
      "No. There is no named provider, usually no published privacy or data-retention policy, and the endpoint can be repriced or withdrawn without notice. Use stealth endpoints for evaluation with non-sensitive data, and keep production on models with a disclosed vendor.",
  },
  {
    question: "How many stealth models has OpenRouter had?",
    answer:
      "We can document three: Hunter Alpha (March 2026), OX Alpha (August 2026) and Union Alpha (September 2026). The list is short on purpose — a codename that cannot be tied to a public listing is not included, and folk names circulating in forums are exactly the kind of thing this index refuses to guess at.",
  },
  {
    question: "What is the difference between /stealth-models and /alpha-models?",
    answer:
      "This page is the index: every documented release, with the fields you can re-check. /alpha-models is the explainer: why the releases are staged this way, what the codenames have in common, and what tends to happen at the reveal. Same subject, different question.",
  },
];

export default function StealthModelsPage() {
  return (
    <>
      <ArticleSchema
        title="Stealth Models on OpenRouter: Every Anonymous Release"
        description="Index of anonymous stealth models on OpenRouter and what each one turned out to be."
        publishedAt="2026-09-17"
        updatedAt="2026-09-17"
        image={`${baseUrl}/og-image.png`}
        url={pageUrl}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Stealth Models", url: pageUrl },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: "var(--foreground)" }}>
          Stealth models on OpenRouter
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Anonymous releases we can point at a public listing — nothing rumoured, nothing unverifiable.
          Last verified 2026-09-17. Live entry:{" "}
          <Link href="/union-alpha" className="text-violet-400 hover:underline">
            Union Alpha
          </Link>
          .
        </p>

        <p className="text-lg mb-10 leading-relaxed" style={{ color: "var(--muted)" }}>
          A stealth model is a frontier-class model published anonymously as a free preview, then claimed
          and renamed once the maker is ready to talk about it. Three of them have followed that script on
          OpenRouter since March 2026. This page is the index; the narrative version, with the staging
          pattern and how to judge the next drop, is on the{" "}
          <Link href="/alpha-models" className="text-violet-400 hover:underline">
            Alpha models line
          </Link>
          .
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
            Index of documented stealth releases
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  {["Codename", "First listed", "Turned out to be", "Status"].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--foreground)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {index.map((row) => (
                  <tr key={row.codename} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td className="py-3 pr-4 font-medium">
                      <Link href={row.href} className="text-violet-400 hover:underline">
                        {row.codename}
                      </Link>
                    </td>
                    <td className="py-3 pr-4" style={{ color: "var(--muted)" }}>
                      {row.listed}
                    </td>
                    <td className="py-3 pr-4" style={{ color: "var(--muted)" }}>
                      {row.turnedOutToBe}
                    </td>
                    <td className="py-3 pr-4 text-xs" style={{ color: "var(--muted)" }}>
                      {row.verified}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>
            Why the list is short: when a stealth model is revealed, the codename normally vanishes from the
            catalogue. Anything we cannot tie to a listing is left out rather than guessed at.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            The line, side by side
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>
            This is the table we extend every time a codename appears. While a model is anonymous the fields
            come from a catalogue read; after the reveal they come from the product page it became. The two
            sources are labelled, because they are not the same kind of fact.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  {["Codename", "First listed", "Context", "Input", "While anonymous", "Revealed as", "Price after"].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--foreground)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {line.map((row) => (
                  <tr key={row.codename} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td className="py-3 pr-4 font-medium">
                      <Link href={row.href} className="text-violet-400 hover:underline">
                        {row.codename}
                      </Link>
                    </td>
                    <td className="py-3 pr-4" style={{ color: "var(--muted)" }}>{row.listed}</td>
                    <td className="py-3 pr-4" style={{ color: "var(--muted)" }}>{row.context}</td>
                    <td className="py-3 pr-4" style={{ color: "var(--muted)" }}>{row.modality}</td>
                    <td className="py-3 pr-4 text-emerald-400">{row.priceWhileAnonymous}</td>
                    <td className="py-3 pr-4" style={{ color: "var(--muted)" }}>{row.revealedAs}</td>
                    <td className="py-3 pr-4" style={{ color: "var(--muted)" }}>{row.priceAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>
            Union Alpha&apos;s post-reveal price is a figure published by the model&apos;s own landing page,
            not an announcement — it is the only number on this table that neither we nor a vendor has
            confirmed. Details:{" "}
            <Link href="/union-alpha-free" className="text-violet-400 hover:underline">
              is Union Alpha still free?
            </Link>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            What the reveal did to the price
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {revealEffect.map((item) => (
              <Card key={item.codename} className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    {item.codename} → {item.became}
                  </h3>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{item.took}</span>
                </div>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.detail}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
            How to judge the next drop
          </h2>
          <ol className="space-y-4">
            {checklist.map((item, i) => (
              <li key={item.step} className="flex gap-4">
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-bold h-fit"
                  style={{ backgroundColor: "var(--card-border)", color: "var(--foreground)" }}
                >
                  {i + 1}
                </span>
                <div>
                  <div className="font-semibold" style={{ color: "var(--foreground)" }}>{item.step}</div>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            How a stealth release is staged
          </h2>
          <ol className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>
              <strong style={{ color: "var(--foreground)" }}>Anonymous listing.</strong> The model appears
              in a public catalogue under a neutral namespace, free, with a context window above its price
              class.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>Silent measurement.</strong> The maker collects
              real usage and preference signal under a name that carries no brand expectations.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>Reveal and rename.</strong> If it performs, the
              maker claims it, the codename is retired and pricing starts.
            </li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
            FAQ
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="p-5">
                <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/union-alpha"
            className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Union Alpha (live) →
          </Link>
          <Link
            href="/alpha-models"
            className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            The Alpha line explained
          </Link>
          <Link
            href="/openrouter-free-models"
            className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            Free models today
          </Link>
          <Link
            href="/comparison"
            className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            Compare every model
          </Link>
        </div>
      </div>
    </>
  );
}
