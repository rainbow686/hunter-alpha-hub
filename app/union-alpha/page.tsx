import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { UnionAlphaStatus } from "@/components/union-alpha-status";
import { SubscriptionForm } from "@/components/subscription-form";
import {
  ArticleSchema,
  BreadcrumbListSchema,
  FAQSchema,
} from "@/components/structured-data";
import {
  UNION_ALPHA_ADDED_AT_UTC,
  UNION_ALPHA_DATA_AS_OF,
  UNION_ALPHA_MODEL_ID,
  UNION_ALPHA_OPENROUTER_URL,
  communityClaims,
  timeline,
  unionAlphaFaqs,
  verifiedSpecs,
} from "@/lib/union-alpha";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/union-alpha`;

export const metadata: Metadata = {
  title: "Union Alpha on OpenRouter: What the Free Stealth Model Is (2026)",
  description:
    "Union Alpha is a free, anonymous multimodal model on OpenRouter and OpenCode: 262K context, 128K output, image input, tool calling. Verified specs, live status, expected paid pricing, and why testers think it may be several models stitched together.",
  keywords: [
    "union alpha model",
    "union alpha openrouter",
    "what is union alpha ai",
    "union alpha opencode",
    "union alpha free model",
    "union alpha stealth model",
    "is union alpha free",
    "stealth/union-alpha",
    "union alpha openrouter",
    "union alpha pricing",
    "union alpha context window",
    "openrouter stealth model",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Union Alpha: New Stealth Model on OpenRouter",
    description:
      "Verified specs, live status and community theories for stealth/union-alpha — the third anonymous Alpha-line model on OpenRouter.",
    url: pageUrl,
    type: "article",
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: "Union Alpha stealth model tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Union Alpha: New Stealth Model on OpenRouter",
    description:
      "Verified specs, live status and community theories for stealth/union-alpha.",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

export default function UnionAlphaPage() {
  return (
    <>
      <ArticleSchema
        title="Union Alpha: New Stealth Model on OpenRouter"
        description="Anonymous free model on OpenRouter with 256K context, image input and tool calling. Verified specs, live status and community theories."
        publishedAt="2026-09-17"
        updatedAt={UNION_ALPHA_DATA_AS_OF}
        image={`${baseUrl}/og-image.png`}
        url={pageUrl}
      />
      <FAQSchema faqs={unionAlphaFaqs} />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Union Alpha", url: pageUrl },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <nav
          className="text-sm mb-6 flex items-center gap-2"
          style={{ color: "var(--muted)" }}
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-violet-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/openrouter-models" className="hover:text-violet-400 transition-colors">
            Models
          </Link>
          <span>/</span>
          <span className="text-violet-400">Union Alpha</span>
        </nav>

        <h1
          className="text-3xl md:text-5xl font-bold leading-tight mb-4"
          style={{ color: "var(--foreground)" }}
        >
          What is Union Alpha? The New Free Stealth Model on OpenRouter &amp; OpenCode
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Last verified {UNION_ALPHA_DATA_AS_OF} · model ID <code>{UNION_ALPHA_MODEL_ID}</code> · added to
          OpenRouter {UNION_ALPHA_ADDED_AT_UTC.replace("T", " ").replace("Z", " UTC")} ·{" "}
          <a
            href={UNION_ALPHA_OPENROUTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:underline"
          >
            open on OpenRouter
          </a>
        </p>

        <div className="mb-8">
          <UnionAlphaStatus />
        </div>

        <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--muted)" }}>
          Union Alpha showed up on OpenRouter on 16 September 2026 with no announcement, no model card
          and no name anyone recognised — the third anonymous model in the Alpha line after Hunter Alpha
          (later Xiaomi MiMo-V2.5) and OX Alpha (later Z.ai GLM 5.3 Flash). This page keeps the two kinds
          of information apart on purpose: <strong>specs read from OpenRouter&apos;s public catalog</strong>{" "}
          above, and <strong>unverified community theories</strong> clearly labelled further down.
        </p>

        <section aria-labelledby="tldr-heading" className="mb-10">
          <h2 id="tldr-heading" className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            At a glance
          </h2>
          <Card className="p-6 md:p-8" glow>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Maker
                </div>
                <div className="font-semibold text-amber-400">Anonymous</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Provider listed as Stealth
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Context
                </div>
                <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                  256K
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  262,144 tokens
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Output cap
                </div>
                <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                  128K
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  131,072 tokens
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Pricing
                </div>
                <div className="font-semibold text-emerald-400">Free</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  $0 in / $0 out · may expire
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Modality
                </div>
                <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                  Text + image in
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Text out only
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Tool calling
                </div>
                <div className="font-semibold text-violet-400">Supported</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  tools, tool_choice, response_format
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Verified specs
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            Read from the OpenRouter public catalog on {UNION_ALPHA_DATA_AS_OF}. Stealth listings change
            without notice — the live badge at the top of this page is the current truth.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--foreground)" }}>
                    Field
                  </th>
                  <th className="text-left py-2 font-semibold" style={{ color: "var(--foreground)" }}>
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {verifiedSpecs.map((spec) => (
                  <tr key={spec.label} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td className="py-3 pr-4 align-top" style={{ color: "var(--muted)" }}>
                      {spec.label}
                    </td>
                    <td className="py-3 align-top" style={{ color: "var(--foreground)" }}>
                      <div className="font-medium">{spec.value}</div>
                      {spec.note ? (
                        <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                          {spec.note}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
            Full picture of the whole stealth line — what each one turned out to be, and how to judge the
            next drop:{" "}
            <Link href="/alpha-models" className="text-violet-400 hover:underline">
              Alpha models tracker
            </Link>
            . For paid alternatives with published pricing, see the{" "}
            <Link href="/comparison" className="text-violet-400 hover:underline">
              full model comparison
            </Link>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Is Union Alpha really one model?
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            The most interesting question about Union Alpha is whether it is a single model at all. Testers
            report very different behaviour between sessions, which points at an orchestrated system rather
            than one set of weights — and a public landing page for the model now describes it as running
            multiple LLMs in parallel and synthesising one answer. Nothing in this section is confirmed by
            the maker or by OpenRouter, and models are unreliable witnesses about their own identity.
          </p>
          <div className="space-y-4">
            {communityClaims.map((claim) => (
              <Card key={claim.claim} className="p-5">
                <div className="flex items-start gap-3">
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      claim.confidence === "Medium"
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-slate-500/15 text-slate-300 border border-slate-500/30"
                    }`}
                  >
                    {claim.confidence} confidence
                  </span>
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                      {claim.claim}
                    </h3>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                      {claim.evidence}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
            Timeline
          </h2>
          <div className="relative border-l-2 pl-6 space-y-6" style={{ borderColor: "var(--card-border)" }}>
            {timeline.map((entry) => (
              <div key={`${entry.date}-${entry.title}`} className="relative">
                <span
                  className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-violet-500 border-2"
                  style={{ borderColor: "var(--background)" }}
                />
                <div className="text-xs font-mono text-violet-400">{entry.date}</div>
                <h3 className="font-semibold mt-1" style={{ color: "var(--foreground)" }}>
                  {entry.title}
                </h3>
                <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                  {entry.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            How to use Union Alpha
          </h2>
          <ol className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>
              <strong style={{ color: "var(--foreground)" }}>1. Create an OpenRouter account.</strong> Chat
              works in the browser; the API needs an OpenRouter key, not a key from the mystery maker.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>2. Select the model by ID.</strong> Use{" "}
              <code>{UNION_ALPHA_MODEL_ID}</code> — the display name in the picker is just{" "}
              <em>Union Alpha</em>.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>3. Use tool calling if you are building.</strong>{" "}
              The endpoint declares tools, tool_choice (auto), response_format, temperature, top_p and
              max_tokens.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>4. Keep it out of production.</strong> An
              anonymous provider with no published data policy, on a free preview that can be repriced or
              delisted overnight, is for evaluation only.
            </li>
          </ol>
          <p className="text-sm mt-4 leading-relaxed" style={{ color: "var(--muted)" }}>
            <strong style={{ color: "var(--foreground)" }}>Via OpenCode instead:</strong> third-party
            reports say the same anonymous model is also reachable from OpenCode&apos;s free tier, so you can
            try it inside an agentic coding tool without wiring up an API key. Same caveats apply — no
            customer data, no credentials, and assume the free window closes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            How it compares to the earlier Alpha models
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--foreground)" }}>
                    Model
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--foreground)" }}>
                    Context
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: "var(--foreground)" }}>
                    Vision
                  </th>
                  <th className="text-left py-2 font-semibold" style={{ color: "var(--foreground)" }}>
                    Revealed as
                  </th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">
                    <Link href="/hunter-alpha" className="text-violet-400 hover:underline">
                      Hunter Alpha
                    </Link>
                  </td>
                  <td className="py-3 pr-4">1M</td>
                  <td className="py-3 pr-4">No</td>
                  <td className="py-3">Xiaomi MiMo-V2.5</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <td className="py-3 pr-4">
                    <Link href="/ox-alpha" className="text-violet-400 hover:underline">
                      OX Alpha
                    </Link>
                  </td>
                  <td className="py-3 pr-4">1M</td>
                  <td className="py-3 pr-4">No</td>
                  <td className="py-3">Z.ai GLM 5.3 Flash</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold" style={{ color: "var(--foreground)" }}>
                    Union Alpha
                  </td>
                  <td className="py-3 pr-4">256K</td>
                  <td className="py-3 pr-4">Yes</td>
                  <td className="py-3">Still anonymous</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
            FAQ
          </h2>
          <div className="space-y-4">
            {unionAlphaFaqs.map((faq) => (
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

        <section className="mb-10">
          <Card className="p-6 md:p-8">
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
              Get notified when Union Alpha is revealed
            </h2>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--muted)" }}>
              The first two models in this line were revealed and repriced weeks after they appeared. Leave
              your email and we will tell you who Union Alpha turns out to be — and what it costs once the
              free preview ends.
            </p>
            <SubscriptionForm />
          </Card>
        </section>

        <div className="flex flex-wrap gap-3">
          <a
            href={UNION_ALPHA_OPENROUTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Open Union Alpha on OpenRouter →
          </a>
          <Link
            href="/openrouter-free-models"
            className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            Other free models
          </Link>
          <Link
            href="/openrouter-models"
            className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            Full model directory
          </Link>
        </div>
      </div>
    </>
  );
}
