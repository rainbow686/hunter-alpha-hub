import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { RevealNotice } from "@/components/reveal-notice";
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
  UNION_ALPHA_REVEAL,
} from "@/lib/union-alpha";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/union-alpha-free`;

export const metadata: Metadata = {
  title: "Is Union Alpha Free? No — the Free Window Is Over (2026)",
  description:
    "Union Alpha was free for two days. As of 2026-09-18 the stealth route is delisted; the model behind it, Unbiased Pareto, bills $2.50 in / $7.50 out per million tokens.",
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
      "Two free days, then a reveal: what the anonymous window cost, what unbiased/pareto bills now, and how the previous two Alpha models ended.",
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
      "No. It was free for the two days of the stealth window, 2026-09-16 to 2026-09-18, and is not any more: stealth/union-alpha was removed from the OpenRouter catalogue when the model was revealed as Unbiased Pareto, which is listed at $2.50 per million input tokens and $7.50 per million output tokens.",
  },
  {
    question: "How long was it free?",
    answer:
      "Two days. Listed 2026-09-16, revealed and delisted 2026-09-18. That is the third time in a row for this line: every Alpha codename so far has been free while anonymous and repriced or folded into the vendor's own lineup once the identity came out.",
  },
  {
    question: "What does it cost now?",
    answer:
      "unbiased/pareto is listed at $2.50 per million input tokens and $7.50 per million output tokens, read from the public catalogue on 2026-09-18. The ≈$0.50 / $1.50 figure that circulated during the anonymous window was a third-party claim about an unreleased model, and the real listing did not match it — which is the argument for pricing off the catalogue and not off the rumour.",
  },
  {
    question: "Was anyone told before the free window closed?",
    answer:
      "No. Nothing was published in advance by the maker or by OpenRouter; the delisting and the reveal arrived together. Free stealth previews on this line have now ended without notice three times, so the honest planning assumption is that a free endpoint is unannounced on the way in and unannounced on the way out.",
  },
];

export default function UnionAlphaFreePage() {
  return (
    <>
      <ArticleSchema
        title="Is Union Alpha Free? The Stealth Preview Window Explained"
        description="Two free days, then a reveal: what the anonymous window cost, what unbiased/pareto bills now, and how the previous two Alpha models ended."
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
          Short answer: it was, for two days, and it is not any more. Here is what &ldquo;free&rdquo; meant on
          the anonymous endpoint, exactly when it ended, what the revealed model costs instead, and how to
          check any of it yourself in ten seconds.
        </p>

        <RevealNotice compact />

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">The whole window, in one table</h2>
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
                  <td className="py-3 text-rose-400">Delisted 2026-09-18</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Price during the window</td>
                  <td className="py-3 pr-4">$0 / $0</td>
                  <td className="py-3 text-emerald-400">Verified 2026-09-16 → 09-18</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Revealed as</td>
                  <td className="py-3 pr-4"><code>{UNION_ALPHA_REVEAL.modelId}</code></td>
                  <td className="py-3 text-emerald-400">Verified {UNION_ALPHA_DATA_AS_OF}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Price now, per million in / out</td>
                  <td className="py-3 pr-4">
                    ${UNION_ALPHA_REVEAL.inputPricePerMillion.toFixed(2)} / $
                    {UNION_ALPHA_REVEAL.outputPricePerMillion.toFixed(2)}
                  </td>
                  <td className="py-3 text-emerald-400">Verified {UNION_ALPHA_DATA_AS_OF}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">The price reported during the window</td>
                  <td className="py-3 pr-4">≈ $0.50 in / $1.50 out per million</td>
                  <td className="py-3 text-amber-400">Claim — did not hold</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Notice before it changes</td>
                  <td className="py-3 pr-4">None published</td>
                  <td className="py-3 text-rose-400">It changed without one</td>
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
          <h2 className="text-2xl font-bold mb-4">What happened to the Alpha models before this one</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            All three codenames so far have ended the same way, which is the closest thing to a forecast that
            exists — a precedent rather than a rule, as it was when this page first said &ldquo;the last two&rdquo;.
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
                  <td className="py-3 pr-4">Unbiased Pareto</td>
                  <td className="py-3">Revealed and delisted on day three; relisted under its real name at list price</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
            Deeper background: <Link href="/alpha-models" className="text-violet-400 hover:underline">how the Alpha line works</Link>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Checking any of this yourself</h2>
          <ol className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>
              <strong style={{ color: "var(--foreground)" }}>1. Ask our status endpoint.</strong>{" "}
              <a href="/api/union-alpha/status" className="text-violet-400 hover:underline">/api/union-alpha/status</a>{" "}
              reads the catalogue live and returns whether <code>{UNION_ALPHA_MODEL_ID}</code> is still listed,
              with its price and context window when it is. It currently answers &ldquo;no longer listed&rdquo;.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>2. Or read the listings.</strong> The stealth page at{" "}
              <a href={UNION_ALPHA_OPENROUTER_URL} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
                openrouter.ai/stealth/union-alpha <span aria-hidden="true">↗</span>
              </a>{" "}
              still carries the reveal notice, and the live per-million price for the revealed model is on{" "}
              <a href={`https://openrouter.ai/${UNION_ALPHA_REVEAL.modelId}`} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
                openrouter.ai/{UNION_ALPHA_REVEAL.modelId} <span aria-hidden="true">↗</span>
              </a>.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>3. Watch the price against the identity.</strong> On this line the
              free tier has ended with the reveal every time, so the reveal is the event to watch, not the price history.
            </li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">If you built on it</h2>
          <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>
              • Swap <code>{UNION_ALPHA_MODEL_ID}</code> for <code>{UNION_ALPHA_REVEAL.modelId}</code> — same
              model, same {UNION_ALPHA_REVEAL.contextWindow.toLocaleString("en-US")}-token context window, now billed.
            </li>
            <li>• Keep a fallback model configured and tested, so the next delisting is a config change rather than an outage.</li>
            <li>• Log which model served each request — an anonymous endpoint that disappears is hard to reason about after the fact.</li>
            <li>
              • Re-check your cost estimate against the real listing: ${UNION_ALPHA_REVEAL.inputPricePerMillion.toFixed(2)} in / $
              {UNION_ALPHA_REVEAL.outputPricePerMillion.toFixed(2)} out per million, not the ≈$0.50 / $1.50 that was
              circulating while the model was anonymous.
            </li>
            <li>• Keep secrets and other people&apos;s data out of preview endpoints. The anonymous window is closed now, but the next codename will behave the same way.</li>
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
            <h2 className="text-xl font-bold mb-2">Get told when the next codename appears</h2>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--muted)" }}>
              One email when the next stealth model is listed — and one when its identity comes out.
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
