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
  UNION_ALPHA_REVEAL,
} from "@/lib/union-alpha";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/union-alpha-opencode`;

export const metadata: Metadata = {
  title: "Union Alpha on OpenCode: What Happened to the Free Route (2026)",
  description:
    "The Union Alpha free route is over: the model was revealed as Unbiased Pareto on 2026-09-18 and delisted. What was verified about the OpenCode route, what was only reported, and what to do instead.",
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
      "The OpenCode route as it stood during the anonymous window, and what replaced it after the 2026-09-18 reveal.",
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
      "It was reported, never verified by us — and it is now moot. OpenCode's free tier was described by third parties as serving the same anonymous model; our own verification was always limited to OpenRouter, where we read the catalogue directly. That catalogue entry was removed on 2026-09-18 when the model was revealed as Unbiased Pareto, so there is no anonymous Union Alpha left to route anywhere.",
  },
  {
    question: "Do I need an OpenRouter API key to use Union Alpha through OpenCode?",
    answer:
      "That was the appeal of the OpenCode route: no key of your own. It is gone with the free window. The revealed model, unbiased/pareto, is a normal billed OpenRouter listing, so using it now does need an OpenRouter key.",
  },
  {
    question: "Was it the same model on both routes?",
    answer:
      "Reportedly yes: same anonymous release, two front doors. We could never prove it from outside, and the model's own answers about its identity were unreliable — testers reported inconsistent behaviour between sessions, which is one of the reasons people suspected more than one model behind the name.",
  },
  {
    question: "What should I not use Union Alpha for?",
    answer:
      "Anything with secrets or other people's data — the advice has not changed now that the vendor has a name. Free stealth previews on this line have ended without warning three times, and the anonymous era of this model lasted two days. Evaluation and side projects, yes; production credentials or customer data, no.",
  },
];

export default function UnionAlphaOpenCodePage() {
  return (
    <>
      <ArticleSchema
        title="Union Alpha on OpenCode: How to Use the Free Tier"
        description="The OpenCode route as it stood during the anonymous window, and what replaced it after the 2026-09-18 reveal."
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
          Union Alpha was reported to have two front doors: the OpenRouter listing we could verify directly, and
          an OpenCode free-tier route that third parties described. Both closed on 2026-09-18, when the model was
          revealed as Unbiased Pareto. This page keeps the verified route and the reported one apart — and says
          which of the two we never managed to confirm.
        </p>

        <RevealNotice compact />

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">The short version</h2>
          <Card className="p-6" glow>
            <div className="grid sm:grid-cols-2 gap-5 text-sm">
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>OpenRouter route</div>
                <div className="font-semibold text-rose-400">Gone</div>
                <div className="mt-1" style={{ color: "var(--muted)" }}>
                  <code>{UNION_ALPHA_MODEL_ID}</code> was delisted on {UNION_ALPHA_DATA_AS_OF}; the same model is
                  listed as <code>{UNION_ALPHA_REVEAL.modelId}</code>, billed.
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>OpenCode route</div>
                <div className="font-semibold text-amber-400">Reported, and now moot</div>
                <div className="mt-1" style={{ color: "var(--muted)" }}>
                  Third-party write-ups said the same anonymous model was on OpenCode&apos;s free tier. We never
                  confirmed it independently, and the anonymous model no longer exists to serve.
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>API key needed</div>
                <div className="font-semibold">Key needed now</div>
                <div className="mt-1" style={{ color: "var(--muted)" }}>
                  Using <code>{UNION_ALPHA_REVEAL.modelId}</code> means billing it, which means an OpenRouter key.
                  No key from the maker was ever published.
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>Was it worth setting up</div>
                <div className="font-semibold">For two days</div>
                <div className="mt-1" style={{ color: "var(--muted)" }}>
                  The free window lasted 2026-09-16 to 2026-09-18. Anything built to depend on it had to change on
                  day three.
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Two front doors, one anonymous release — both shut</h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <p>
              OpenRouter was the route we track, and the source of every verified number on our{" "}
              <Link href="/union-alpha" className="text-violet-400 hover:underline">tracker</Link>: its catalogue
              listed <code>{UNION_ALPHA_MODEL_ID}</code> under the <em>stealth</em> namespace with a provider tag of
              &ldquo;Stealth&rdquo; from 2026-09-16 until it was delisted on the 18th.
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
          <h2 className="text-2xl font-bold mb-4">How the route worked, while it was open</h2>
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
            OpenCode releases, and a stale step-by-step would be worse than none. These four steps are kept as the
            record of what a stealth seeding looked like, because the next codename will repeat the pattern.
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
                    No. Our <a href="/api/union-alpha/status" className="text-violet-400 hover:underline">status endpoint</a>{" "}
                    answers &ldquo;no longer listed&rdquo;, and the{" "}
                    <a href="https://openrouter.ai/stealth/union-alpha" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">stealth page <span aria-hidden="true">↗</span></a>{" "}
                    still carries the reveal notice.
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">Is the OpenCode free tier still serving it?</td>
                  <td className="py-3">
                    Unknown, and no longer worth checking: the anonymous model was delisted from OpenRouter, which is
                    the route both write-ups pointed at.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">What it costs now</td>
                  <td className="py-3">
                    ${UNION_ALPHA_REVEAL.inputPricePerMillion.toFixed(2)} in / $
                    {UNION_ALPHA_REVEAL.outputPricePerMillion.toFixed(2)} out per million, read from the catalogue. See{" "}
                    <Link href="/union-alpha-free" className="text-violet-400 hover:underline">the free-window page</Link>.
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
            <h2 className="text-xl font-bold mb-2">Get notified about the next codename</h2>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--muted)" }}>
              This reveal is over. One email when the next stealth model is listed, and one when its identity comes out.
            </p>
            <SubscriptionForm />
          </Card>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/union-alpha" className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500">
            Union Alpha tracker →
          </Link>
          <Link href="/union-alpha-free" className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400" style={{ borderColor: "var(--card-border)" }}>
            What it costs now
          </Link>
          <Link href="/alpha-models" className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400" style={{ borderColor: "var(--card-border)" }}>
            How the Alpha line works
          </Link>
        </div>
      </div>
    </>
  );
}
