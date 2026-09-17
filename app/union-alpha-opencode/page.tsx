import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { SubscriptionForm } from "@/components/subscription-form";
import {
  ArticleSchema,
  BreadcrumbListSchema,
  FAQSchema,
} from "@/components/structured-data";
import { UNION_ALPHA_DATA_AS_OF, UNION_ALPHA_MODEL_ID } from "@/lib/union-alpha";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/union-alpha-opencode`;

export const metadata: Metadata = {
  title: "Union Alpha on OpenCode: How to Use the Free Tier (2026)",
  description:
    "Union Alpha is reportedly reachable from OpenCode's free tier as well as OpenRouter. What is verified, what is only a claim, how to try it, and the limits you should assume before you put it in a workflow.",
  keywords: [
    "union alpha opencode",
    "union alpha free tier",
    "opencode free model",
    "stealth/union-alpha",
    "union alpha openrouter",
    "union alpha how to use",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Union Alpha on OpenCode",
    description:
      "The free route into the anonymous Union Alpha model, with the verified parts and the unverified parts kept apart.",
    url: pageUrl,
    type: "article",
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: "Union Alpha on OpenCode" }],
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "Is Union Alpha really available on OpenCode?",
    answer:
      "That is the claim, not a verified fact. OpenCode's free tier is described by third parties — including material published for the model itself — as serving the same anonymous model. Our own verification is limited to OpenRouter, where we read the catalogue directly. Treat the OpenCode route as reported-but-unconfirmed and check it yourself before relying on it.",
  },
  {
    question: "Do I need an OpenRouter API key to use Union Alpha through OpenCode?",
    answer:
      "No. The point of the OpenCode route is that the model is reachable from its free tier without wiring up your own key. If you call it on OpenRouter instead, you do need an OpenRouter key — but not a key from the anonymous maker, who has not published one.",
  },
  {
    question: "Is it the same model on both routes?",
    answer:
      "Reportedly yes: same anonymous release, two front doors. We cannot prove it from outside, and the model's own answers about its identity are unreliable — testers have reported inconsistent behaviour between sessions.",
  },
  {
    question: "What should I not use Union Alpha for?",
    answer:
      "Anything with secrets or other people's data. The provider is anonymous, no privacy or retention policy has been published, and free stealth previews have historically ended without warning. Evaluation and side projects, yes; production credentials or customer data, no.",
  },
];

export default function UnionAlphaOpenCodePage() {
  return (
    <>
      <ArticleSchema
        title="Union Alpha on OpenCode: How to Use the Free Tier"
        description="The free route into the anonymous Union Alpha model, with verified facts and unverified claims kept apart."
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
          { name: "OpenCode", url: pageUrl },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-sm mb-6 flex items-center gap-2" style={{ color: "var(--muted)" }}>
          <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/union-alpha" className="hover:text-violet-400 transition-colors">Union Alpha</Link>
          <span>/</span>
          <span className="text-violet-400">OpenCode</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          <span className="gradient-text">Union Alpha on OpenCode</span>
        </h1>
        <p className="text-lg mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>
          Union Alpha has two front doors: the OpenRouter listing we can verify directly, and an
          OpenCode free-tier route that third parties report. This page keeps those two apart, tells you
          how to try the second one, and states what we cannot check from outside.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">The short version</h2>
          <Card className="p-6" glow>
            <div className="grid sm:grid-cols-2 gap-5 text-sm">
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>OpenRouter route</div>
                <div className="font-semibold text-emerald-400">Verified</div>
                <div className="mt-1" style={{ color: "var(--muted)" }}>
                  <code>{UNION_ALPHA_MODEL_ID}</code>, free, 262K context, read from the catalogue on {UNION_ALPHA_DATA_AS_OF}.
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>OpenCode route</div>
                <div className="font-semibold text-amber-400">Reported</div>
                <div className="mt-1" style={{ color: "var(--muted)" }}>
                  Third-party write-ups and the model&apos;s own landing page say the same anonymous model is on
                  OpenCode&apos;s free tier. We have not been able to confirm it independently.
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>API key needed</div>
                <div className="font-semibold">None for OpenCode</div>
                <div className="mt-1" style={{ color: "var(--muted)" }}>
                  The OpenRouter route needs an OpenRouter key. Neither route needs a key from the anonymous maker.
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>Data policy</div>
                <div className="font-semibold text-rose-400">None published</div>
                <div className="mt-1" style={{ color: "var(--muted)" }}>
                  Anonymous provider on both routes. No retention or privacy terms exist to read.
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Two front doors, one anonymous release</h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <p>
              OpenRouter is the route we track. Its public catalogue lists <code>{UNION_ALPHA_MODEL_ID}</code> under
              the <em>stealth</em> namespace with a provider tag of &ldquo;Stealth&rdquo;, and it is the source every
              verified number on our <Link href="/union-alpha" className="text-violet-400 hover:underline">tracker</Link> comes from.
            </p>
            <p>
              OpenCode is the route we cannot see. The claim is that the free tier of the OpenCode coding tool serves
              the same anonymous model, which would let you use it inside an agentic workflow without an API key of your
              own. It is plausible — stealth releases are often seeded through several tools at once to gather usage —
              but &ldquo;plausible&rdquo; is not &ldquo;verified&rdquo;, and we are not going to report it as fact.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">How to try the OpenCode route</h2>
          <ol className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>
              <strong style={{ color: "var(--foreground)" }}>1. Install and sign in to OpenCode.</strong> The free tier
              is the part to look for — it is the route that does not ask for your own provider key.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>2. Look for the anonymous model in the picker.</strong> Free
              stealth releases often appear without a vendor name attached. If you see an unexplained model alongside the
              named providers, that is the thing to test.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>3. Run one prompt you already know the answer to.</strong> The
              identity of the model behind an anonymous endpoint is not something it can tell you reliably, so judge it on
              output, not on what it says about itself.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>4. Assume it can vanish.</strong> Keep the workflow disposable:
              no credentials in prompts, no customer data, no dependency your product needs tomorrow.
            </li>
          </ol>
          <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
            We deliberately do not print a screenshot-accurate click path: the free tier&apos;s menu wording changes between
            OpenCode releases, and a stale step-by-step would be worse than none.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">How to check for yourself</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <th className="text-left py-2 pr-4 font-semibold">What you want to know</th>
                  <th className="text-left py-2 font-semibold">Where it can be checked</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Is it still on OpenRouter, and still free?</td>
                  <td className="py-3">
                    Our <a href="/api/union-alpha/status" className="text-violet-400 hover:underline">status endpoint</a> or
                    the <a href="https://openrouter.ai/stealth/union-alpha" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">listing itself <span aria-hidden="true">↗</span></a>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Is the OpenCode free tier still serving it?</td>
                  <td className="py-3">Only from inside your OpenCode client — there is no public endpoint we can poll</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">What it will cost after the preview</td>
                  <td className="py-3">
                    Unknown. See <Link href="/union-alpha-free" className="text-violet-400 hover:underline">the free-window page</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
            <h2 className="text-xl font-bold mb-2">Get notified when Union Alpha is revealed</h2>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--muted)" }}>
              Identity, and the price once the free preview ends. One email per reveal.
            </p>
            <SubscriptionForm />
          </Card>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/union-alpha" className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
            Union Alpha tracker →
          </Link>
          <Link href="/union-alpha-free" className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400" style={{ borderColor: "var(--card-border)" }}>
            Is it still free?
          </Link>
          <Link href="/alpha-models" className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400" style={{ borderColor: "var(--card-border)" }}>
            How the Alpha line works
          </Link>
        </div>
      </div>
    </>
  );
}
