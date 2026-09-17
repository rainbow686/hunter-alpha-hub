import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { ArticleSchema, BreadcrumbListSchema, FAQSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/hunter-alpha-benchmarks`;

export const metadata: Metadata = {
  title: "Hunter Alpha Benchmarks: What Is Verified vs Claimed (2026)",
  description:
    "There is no official benchmark set for Hunter Alpha (now Xiaomi MiMo-V2.5). Here is what was claimed during the stealth window, what you can verify in the catalogue, and how to benchmark the model yourself in an afternoon.",
  keywords: [
    "hunter alpha benchmarks",
    "mimo-v2.5 benchmarks",
    "hunter alpha benchmark results",
    "hunter alpha performance",
    "xiaomi mimo v2.5 benchmark",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Hunter Alpha Benchmarks: Verified vs Claimed",
    description:
      "No official benchmark set exists for Hunter Alpha / MiMo-V2.5. What was claimed, what is verifiable, and how to test it yourself.",
    url: pageUrl,
    type: "article",
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: "Hunter Alpha benchmarks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hunter Alpha Benchmarks: Verified vs Claimed",
    description: "What is verifiable about Hunter Alpha / MiMo-V2.5, and what is just marketing.",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "Are there official Hunter Alpha benchmarks?",
    answer:
      "No. Hunter Alpha was an anonymous stealth listing — it shipped with no model card, no paper and no published benchmark table. Anything you see quoted for it is either third-party testing, a self-reported number from the reveal period, or an estimate.",
  },
  {
    question: "What can be verified about Hunter Alpha today?",
    answer:
      "The catalogue-level facts for the model it became, Xiaomi MiMo-V2.5: context window, maximum output, supported modalities, tool-calling parameters and current pricing. Those are checkable in seconds, and they are what we publish. Benchmarks are not in that category.",
  },
  {
    question: "Why are benchmark claims for stealth models so unreliable?",
    answer:
      "Three reasons: the maker has not published a method, the served model can change between sessions, and a leaderboard score says nothing about your workload. When an anonymous release also appears to be an orchestrated system rather than a single set of weights, a benchmark number describes whichever backend answered that run.",
  },
  {
    question: "How should I benchmark an AI model for my own use?",
    answer:
      "Build a small, fixed set of prompts that look like your real work, run them against two or three models, and score the outputs on completion and cost per finished task rather than on a public leaderboard. Twenty representative prompts will tell you more than a 100-point score.",
  },
];

export default function HunterAlphaBenchmarksPage() {
  return (
    <>
      <ArticleSchema
        title="Hunter Alpha Benchmarks: What Is Verified vs Claimed"
        description="No official benchmark set exists for Hunter Alpha / Xiaomi MiMo-V2.5 — what is verifiable, and how to test it yourself."
        publishedAt="2026-09-17"
        updatedAt="2026-09-17"
        image={`${baseUrl}/og-image.png`}
        url={pageUrl}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Hunter Alpha", url: `${baseUrl}/hunter-alpha` },
          { name: "Benchmarks", url: pageUrl },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: "var(--foreground)" }}>
          Hunter Alpha benchmarks: verified vs claimed
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Hunter Alpha is now <strong>Xiaomi MiMo-V2.5</strong>. Last verified 2026-09-17 ·{" "}
          <Link href="/openrouter-models/mimo-v2.5" className="text-violet-400 hover:underline">
            current model page
          </Link>
        </p>

        <Card className="p-6 mb-10">
          <h2 className="text-xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Short answer
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <strong style={{ color: "var(--foreground)" }}>There is no official benchmark set.</strong> Hunter
            Alpha appeared as an anonymous listing with no model card and no published results. Every number
            you find attributed to it is either third-party testing of uncertain method, a self-reported
            figure from the reveal period, or somebody&apos;s estimate. We do not publish numbers we cannot
            reproduce, so this page tells you what is checkable and how to test the model yourself.
          </p>
        </Card>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
            What is verifiable
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  {["Field", "Status", "Where to check"].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--foreground)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Context window, max output</td>
                  <td className="py-3 pr-4 text-emerald-400">Verifiable</td>
                  <td className="py-3 pr-4">Public catalogue fields</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Modality, tool support</td>
                  <td className="py-3 pr-4 text-emerald-400">Verifiable</td>
                  <td className="py-3 pr-4">Endpoint parameter list</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Current pricing</td>
                  <td className="py-3 pr-4 text-emerald-400">Verifiable</td>
                  <td className="py-3 pr-4">Catalogue, changes without notice</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Parameter count (&quot;~1T&quot;)</td>
                  <td className="py-3 pr-4 text-amber-400">Claimed</td>
                  <td className="py-3 pr-4">Description text, no method</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Benchmark scores</td>
                  <td className="py-3 pr-4 text-rose-400">Not established</td>
                  <td className="py-3 pr-4">No published methodology</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            Why stealth benchmark numbers mislead
          </h2>
          <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>
              <strong style={{ color: "var(--foreground)" }}>No method, no result.</strong> A score without
              the prompt set, the sampling settings and the scoring rule is an advertisement, not a
              measurement.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>The served system can change.</strong> Some
              anonymous releases behave like an orchestrated set of backends. A benchmark run then describes
              whichever backend answered, not &quot;the model&quot;.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>Leaderboards do not measure your workload.</strong>{" "}
              A model that wins on a public suite can lose on your documents, your tools and your latency
              budget.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            How to benchmark it yourself, in one afternoon
          </h2>
          <ol className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>
              <strong style={{ color: "var(--foreground)" }}>1. Freeze a prompt set.</strong> Twenty prompts
              that look like your real work beats a hundred generic ones.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>2. Pick two or three models.</strong> Include one
              paid model you already trust as the baseline.{" "}
              <Link href="/comparison" className="text-violet-400 hover:underline">
                Our comparison hub
              </Link>{" "}
              has current pricing for them.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>3. Score completion, not vibes.</strong> Did the
              output ship, or did you have to redo it? Count the redo.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>4. Divide cost by finished tasks.</strong> Combine
              token spend with your own editing time using the{" "}
              <Link href="/openrouter-pricing-calculator" className="text-violet-400 hover:underline">
                pricing calculator
              </Link>
              .
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
            href="/hunter-alpha"
            className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            Hunter Alpha archive
          </Link>
          <Link
            href="/openrouter-models/mimo-v2.5"
            className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            MiMo-V2.5 model page
          </Link>
          <Link
            href="/stealth-models"
            className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            Stealth models index
          </Link>
        </div>
      </div>
    </>
  );
}
