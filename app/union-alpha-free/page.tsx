import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { SubscriptionForm } from "@/components/subscription-form";
import {
  ArticleSchema,
  BreadcrumbListSchema,
  FAQSchema,
} from "@/components/structured-data";
import {
  UNION_ALPHA_DATA_AS_OF,
  UNION_ALPHA_MODEL_ID,
  UNION_ALPHA_OPENROUTER_URL,
} from "@/lib/union-alpha";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/union-alpha-free`;

export const metadata: Metadata = {
  title: "Is Union Alpha Free? The Stealth Preview Window Explained (2026)",
  description:
    "Union Alpha bills $0 per million tokens right now — verified against the OpenRouter catalogue. What a free stealth preview means, what the last two Alpha models did when their windows closed, and how to check the price yourself.",
  keywords: [
    "is union alpha free",
    "union alpha pricing",
    "union alpha cost",
    "union alpha free model",
    "stealth model free preview",
    "union alpha openrouter price",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Is Union Alpha free?",
    description:
      "Verified $0 pricing, the reported post-preview price, and what happened to the previous two Alpha models.",
    url: pageUrl,
    type: "article",
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: "Union Alpha pricing" }],
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "Is Union Alpha free right now?",
    answer:
      "Yes as of 2026-09-17: the OpenRouter endpoint for stealth/union-alpha lists $0 per million input tokens and $0 per million output tokens, which we read directly from the public catalogue. That is a snapshot, not a promise — the status endpoint on this site re-checks it.",
  },
  {
    question: "How long will it stay free?",
    answer:
      "Nobody outside the maker knows. The previous two models in this line were free while anonymous and were repriced or delisted once they were revealed. Treat the window as days-to-weeks, and never as a guarantee.",
  },
  {
    question: "What will it cost after the preview?",
    answer:
      "Unconfirmed. Material published for the model itself lists anticipated pricing of about $0.50 per million input tokens and $1.50 per million output tokens — roughly the budget tier. That is a claim by an anonymous party, not an announcement, and the listing on OpenRouter still bills $0 today.",
  },
  {
    question: "Will I be told before the free window closes?",
    answer:
      "Assume not. Free stealth previews have ended without notice before, and there is no mailing list, changelog or status page from the maker. The only honest mitigation is to not depend on it.",
  },
];

export default function UnionAlphaFreePage() {
  return (
    <>
      <ArticleSchema
        title="Is Union Alpha Free? The Stealth Preview Window Explained"
        description="Verified $0 pricing today, the reported price after the preview, and the precedent set by the previous two Alpha models."
        publishedAt="2026-09-17"
        updatedAt={UNION_ALPHA_DATA_AS_OF}
        image={`${baseUrl}/og-image.png`}
        url={pageUrl}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Union Alpha", url: `${baseUrl}/union-alpha` },
          { name: "Free window", url: pageUrl },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-sm mb-6 flex items-center gap-2" style={{ color: "var(--muted)" }}>
          <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/union-alpha" className="hover:text-violet-400 transition-colors">Union Alpha</Link>
          <span>/</span>
          <span className="text-violet-400">Free window</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          <span className="gradient-text">Is Union Alpha free?</span>
        </h1>
        <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--muted)" }}>
          Short answer: yes today, verified against the catalogue — and treated as a countdown, not a price.
          Here is exactly what &ldquo;free&rdquo; means on an anonymous endpoint, what the two previous Alpha
          models did when their windows closed, and how to check the number yourself in ten seconds.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Today, in one table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <th className="text-left py-2 pr-4 font-semibold">Field</th>
                  <th className="text-left py-2 pr-4 font-semibold">Value</th>
                  <th className="text-left py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Model id</td>
                  <td className="py-3 pr-4"><code>{UNION_ALPHA_MODEL_ID}</code></td>
                  <td className="py-3 text-emerald-400">Verified</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Price per million, in / out</td>
                  <td className="py-3 pr-4">$0 / $0</td>
                  <td className="py-3 text-emerald-400">Verified {UNION_ALPHA_DATA_AS_OF}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Expected price after the preview</td>
                  <td className="py-3 pr-4">≈ $0.50 in / $1.50 out per million</td>
                  <td className="py-3 text-amber-400">Claim, third-party</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Notice before it changes</td>
                  <td className="py-3 pr-4">None published</td>
                  <td className="py-3 text-rose-400">Assume there is none</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">What &ldquo;free&rdquo; means on a stealth endpoint</h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <p>
              A stealth preview is a lab testing an unreleased model in public. The free price is the incentive to get
              people to use it: you supply the traffic and the feedback, the lab supplies the compute. That arrangement
              ends when the test does.
            </p>
            <p>
              It also means the endpoint has no commercial obligations to you — no SLA, no published data-retention
              terms, no support channel and no notice period. Everything on this page is written with that in mind.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">What happened to the last two Alpha models</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            This is the closest thing to a forecast that exists, and it is a precedent rather than a rule.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <th className="text-left py-2 pr-4 font-semibold">Codename</th>
                  <th className="text-left py-2 pr-4 font-semibold">Revealed as</th>
                  <th className="text-left py-2 font-semibold">What happened to the free window</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Hunter Alpha</td>
                  <td className="py-3 pr-4">Xiaomi MiMo-V2.5</td>
                  <td className="py-3">Repriced as a normal paid model after the reveal</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">OX Alpha</td>
                  <td className="py-3 pr-4">Z.ai GLM 5.3 Flash</td>
                  <td className="py-3">Folded into the vendor&apos;s own lineup at its list price</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold" style={{ color: "var(--foreground)" }}>Union Alpha</td>
                  <td className="py-3 pr-4">Still anonymous</td>
                  <td className="py-3">$0 today; the maker has published nothing</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
            Deeper background: <Link href="/alpha-models" className="text-violet-400 hover:underline">how the Alpha line works</Link>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Checking the price yourself</h2>
          <ol className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>
              <strong style={{ color: "var(--foreground)" }}>1. Ask our status endpoint.</strong>{" "}
              <a href="/api/union-alpha/status" className="text-violet-400 hover:underline">/api/union-alpha/status</a>{" "}
              reads the catalogue live and returns the current price, context window and whether the model is still listed.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>2. Or read the listing.</strong> OpenRouter shows the per-million
              price on <a href={UNION_ALPHA_OPENROUTER_URL} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">the model page <span aria-hidden="true">↗</span></a>.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>3. Watch for the reveal, not the price.</strong> The price changes
              when the identity does. If a lab claims the model, the free tier is on borrowed time.
            </li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">If you are building on it</h2>
          <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>• Keep a fallback model configured and tested, so a delisting is a config change rather than an outage.</li>
            <li>• Log which model served each request — an anonymous endpoint that disappears is hard to reason about after the fact.</li>
            <li>• Keep secrets and other people&apos;s data out of the prompts. No data policy has been published to trust.</li>
            <li>• Budget for the reported post-preview price rather than the current $0, so the free window is upside, not a dependency.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="p-5">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">Get told when the free window closes</h2>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--muted)" }}>
              One email when Union Alpha is revealed and the price becomes real.
            </p>
            <SubscriptionForm />
          </Card>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/union-alpha" className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
            Union Alpha tracker →
          </Link>
          <Link href="/union-alpha-opencode" className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400" style={{ borderColor: "var(--card-border)" }}>
            Using it in OpenCode
          </Link>
          <Link href="/union-alpha-not-working" className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400" style={{ borderColor: "var(--card-border)" }}>
            Errors and limits
          </Link>
        </div>
      </div>
    </>
  );
}
