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
        </div>
      </div>
    </>
  );
}
