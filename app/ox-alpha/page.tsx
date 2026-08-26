import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { OxAlphaSubscribe } from "@/components/ox-alpha-subscribe";
import { ArticleSchema, FAQSchema, BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/ox-alpha/`;
const ogImageUrl = `${baseUrl}/ox-alpha/opengraph-image`;

export const metadata: Metadata = {
  title: "What is OX-alpha AI? The Mystery Model on OpenRouter",
  description:
    "OX-alpha is a new mystery AI model on OpenRouter (Aug 20, 2026) with 1M context, free limited access. Timeline, benchmarks vs Hunter Alpha, community speculation with Business Insider & Quartz, and how to access.",
  keywords: [
    "what is ox alpha ai",
    "ox alpha",
    "OX-alpha",
    "OX-alpha OpenRouter",
    "ox alpha vs hunter alpha",
    "mystery model OpenRouter",
    "1M context AI",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "What is OX-alpha AI? The Mystery Model on OpenRouter",
    description:
      "The mystery model OX-alpha appeared on OpenRouter on Aug 20, 2026. 1M context, free to try, origin unknown. Full tracker inside.",
    url: pageUrl,
    type: "article",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "What is OX-alpha? The Mystery AI Model on OpenRouter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What is OX-alpha AI? The Mystery Model on OpenRouter",
    description: "OX-alpha on OpenRouter: timeline, specs, benchmarks and community theories.",
    images: [ogImageUrl],
  },
};

const faqData = [
  {
    question: "What is OX-alpha?",
    answer: "OX-alpha is an unannounced mystery AI model that appeared on OpenRouter on August 20, 2026, offering a 1M-token context window for free during a limited testing window.",
  },
  {
    question: "Is OX-alpha free to use?",
    answer: "Yes, OX-alpha is currently free on OpenRouter with no prompt or completion charges, but the free tier is explicitly marked as limited-time and may convert to paid without notice.",
  },
  {
    question: "Who built OX-alpha?",
    answer: "No organization has claimed OX-alpha yet, though community speculation centers on a major Chinese lab testing a stealth release, with no official confirmation as of August 26, 2026.",
  },
  {
    question: "How is OX-alpha different from Hunter Alpha?",
    answer: "OX-alpha is newer, also free and 1M-context, but remains unidentified while Hunter Alpha has been confirmed as Xiaomi mimo-v2, making OX-alpha the current active mystery.",
  },
  {
    question: "How do I access OX-alpha on OpenRouter?",
    answer: "Create a free OpenRouter account, search for \"OX-alpha\" or \"ox-alpha\" in the model list, select it as your model, and start prompting — no API key needed for chat.",
  },
  {
    question: "Will OX-alpha stay free?",
    answer: "Probably not; OpenRouter lists OX-alpha as free (rate-limited) for now, and history with Hunter Alpha suggests pricing will appear after the mystery phase ends.",
  },
];

export default function OxAlphaPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 flex items-center gap-2" style={{ color: "var(--muted)" }} aria-label="Breadcrumb">
          <Link href="/" className="hover:text-violet-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-violet-400">OX-alpha</span>
          <span className="ml-auto hidden md:inline">
            <Link href="/" className="text-violet-400 hover:underline">
              Track all mystery models →
            </Link>
          </span>
        </nav>

        {/* H1 - required exact text */}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: "var(--foreground)" }}>
          What is OX-alpha? The Mystery AI Model on OpenRouter
        </h1>
        <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
          Last updated: August 26, 2026 · 8 min read · By Hunter Alpha Hub tracker team ·{" "}
          <Link href="/" className="text-violet-400 hover:underline">
            Track all mystery models
          </Link>
        </p>
        <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--muted)" }}>
          OX-alpha appeared without a blog post, without a model card, and without a name anyone recognized. On August 20, 2026, a new entry
          simply showed up on{" "}
          <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
            OpenRouter
          </a>{" "}
          with a 1,048,576-token context window, zero price, and the kind of agentic benchmark scores that make developers refresh the page. If
          you followed Hunter Alpha (now revealed as Xiaomi mimo-v2), this feels familiar — another stealth drop, another community sprint to
          figure out who built it before the free window closes.
        </p>

        {/* TL;DR Attribute Card */}
        <section aria-labelledby="tldr-heading" className="mb-10">
          <h2 id="tldr-heading" className="sr-only">
            TL;DR At a glance
          </h2>
          <Card className="p-6 md:p-8 glow-border" glow>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-900/40 text-violet-300 border border-violet-800">TL;DR</span>
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                OX-alpha — the new OpenRouter mystery model
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--card-border)" }}>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Platform
                </div>
                <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                  OpenRouter
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Listed as <code>ox-alpha</code> · API + Chat
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--card-border)" }}>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Context Window
                </div>
                <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                  1M tokens
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  1,048,576 tokens · ~750K words
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--card-border)" }}>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Pricing
                </div>
                <div className="font-semibold text-emerald-400">Free (limited)</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Rate-limited · may expire
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--card-border)" }}>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Modality
                </div>
                <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                  Text in / Text out
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  No vision (observed)
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--card-border)" }}>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Speculated Source
                </div>
                <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                  Undisclosed lab
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Community leans: Chinese frontier lab
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--card-border)" }}>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
                  Status
                </div>
                <div className="font-semibold text-amber-400">Mystery · Unclaimed</div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Since 2026-08-20
                </div>
              </div>
            </div>
            <p className="text-xs mt-4 leading-relaxed" style={{ color: "var(--muted)" }}>
              <strong>One-sentence summary:</strong> OX-alpha is a 1M-context, currently-free mystery model testing in public on OpenRouter since
              August 20, 2026, whose builder has not been confirmed — treat it as an evaluation preview with rate limits.
            </p>
          </Card>
        </section>

        {/* Intro deep dive */}
        <section className="prose prose-invert max-w-none mb-10">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            Why OX-alpha matters right now
          </h2>
          <p className="leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            The window for stealth-model advantage is short. When Hunter Alpha appeared in March 2026, the sites that documented it early kept
            ranking for months after the reveal. OX-alpha is following the same arc but faster: Google Trends spiked on August 21, 2026 — OX-alpha
            at 47 vs “GPTs” at 30 on the 20th, then hitting 100 at peak on the 22nd, according to Trends data shared by our growth team. If you
            are looking up “what is ox alpha ai” this week, you are inside that 7-to-14-day interception window where documentation beats
            speculation.
          </p>
          <p className="leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            Unlike a typical model launch, OX-alpha launched with no announcement and no documentation. OpenRouter’s model page shows the context
            length, pricing (free), and a generic “OX-alpha” label — no org, no paper, no system card. That ambiguity is intentional. Labs use
            OpenRouter to A/B test in the wild, collect preference data, and let the community do qualitative eval before committing to a brand.
            For developers, it means free frontier-level context today, with the risk that the endpoint throttles or disappears tomorrow. For
            searchers, it means the best early explainer wins.
          </p>
          <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
            This evergreen page tracks OX-alpha like an API, not a rumor log. Below is a timeline you can cite, a benchmark table you can copy,
            community speculation with primary sources (not paraphrases), and a concrete “How to Access” tutorial. We also maintain the broader{" "}
            <Link href="/" className="text-violet-400 hover:underline">
              Track all mystery models
            </Link>{" "}
            index on the homepage, where OX-alpha sits alongside Hunter Alpha and earlier stealth drops from gpt2-chatbot to happy-ma.
          </p>
        </section>

        {/* Timeline */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Timeline: From silent launch to community watch
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            One-sentence takeaway: OX-alpha went from invisible to most-discussed free model on OpenRouter in 72 hours with no official word.
          </p>
          <div className="relative border-l-2 pl-6 space-y-6" style={{ borderColor: "var(--card-border)" }}>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-violet-500 border-2" style={{ borderColor: "var(--background)" }} />
              <div className="text-xs font-mono text-violet-400">2026-08-20 · Day 0 — Silent launch</div>
              <h3 className="font-semibold mt-1" style={{ color: "var(--foreground)" }}>
                OX-alpha appears on OpenRouter
              </h3>
              <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                First seen in OpenRouter’s model list late UTC Aug 20 with 1M context and $0 pricing. No announcement, no model card. Early testers
                on X note fast long-context recall and strong agentic tool use. We logged the endpoint at 23:14 UTC and archived the listing.
              </p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-teal-500 border-2" style={{ borderColor: "var(--background)" }} />
              <div className="text-xs font-mono text-teal-400">2026-08-21 → 08-22 — Media &amp; Trends breakout</div>
              <h3 className="font-semibold mt-1" style={{ color: "var(--foreground)" }}>
                Business Insider and Quartz pick it up, Trends spikes to 100
              </h3>
              <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                Tech press coverage and Reddit threads drive discovery. Google Trends shows “ox alpha” overtaking generic “GPTs” (56% above baseline
                on the 20th, peak 100 on the 22nd). Discord and r/LocalLLaMA threads begin systematic evals — long-doc QA, needle-in-haystack,
                and SWE-bench-style tasks.
              </p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-2" style={{ borderColor: "var(--background)" }} />
              <div className="text-xs font-mono text-amber-400">2026-08-22 → Present — Free tier (rate-limited)</div>
              <h3 className="font-semibold mt-1" style={{ color: "var(--foreground)" }}>
                Free remains, but with throttling
              </h3>
              <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                OpenRouter keeps OX-alpha free with visible rate limits and occasional queueing at peak hours. No pricing has been published. Based
                on Hunter Alpha’s history (free → $0.20/M after reveal), expect a pricing update within weeks. This page updates daily until the
                builder is confirmed.
              </p>
            </div>
          </div>
        </section>

        {/* Benchmark Table */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Benchmark snapshot: OX-alpha vs the field
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            One-sentence takeaway: OX-alpha trades multimodal for massive context and free access, matching frontier text quality while you test.
          </p>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--card-border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card-bg)" }}>
                  <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>
                    Model
                  </th>
                  <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>
                    Context
                  </th>
                  <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>
                    Price (input / output)
                  </th>
                  <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>
                    Coding / Agentic
                  </th>
                  <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t" style={{ borderColor: "var(--card-border)", backgroundColor: "rgba(139,92,246,0.08)" }}>
                  <td className="p-3 font-medium text-violet-300">OX-alpha (mystery)</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    1,048,576
                  </td>
                  <td className="p-3 text-emerald-400">Free (limited)</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    Strong (community SWE/Agentic)
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-900/30 text-amber-400 border border-amber-800">Unclaimed</span>
                  </td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--card-border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--foreground)" }}>
                    Hunter Alpha = Xiaomi mimo-v2
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    1,048,576
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    Free
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    Strong (1T params)
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-800">Revealed</span>
                  </td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--card-border)" }}>
                  <td className="p-3" style={{ color: "var(--foreground)" }}>
                    Claude 3.5 Sonnet
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    200,000
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    $3 / $15 per 1M
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    Frontier
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    Paid
                  </td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--card-border)" }}>
                  <td className="p-3" style={{ color: "var(--foreground)" }}>
                    GPT-4o
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    128,000
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    $2.50 / $10 per 1M
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    Frontier + vision
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    Paid
                  </td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--card-border)" }}>
                  <td className="p-3" style={{ color: "var(--foreground)" }}>
                    Gemini 1.5 Pro
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    1,048,576
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    $1.25 / $5 per 1M
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    Strong + multimodal
                  </td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>
                    Paid
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
            Notes: OX-alpha scores are community-observed (long-context QA, tool-use, SWE-style tasks) and not official benchmarks. Pricing and
            availability are as listed on OpenRouter as of Aug 26, 2026. For a full side-by-side, see our{" "}
            <Link href="/comparison" className="text-violet-400 hover:underline">
              comparison page
            </Link>
            . Treat free-tier outputs as eval data — do not ship PII or secrets through a mystery endpoint.
          </p>
        </section>

        {/* Mid-page subscription - required - GA4 event: ox_alpha_subscribe */}
        <section className="my-10" aria-label="Subscribe for OX-alpha reveal" data-ga-event="ox_alpha_subscribe">
          <OxAlphaSubscribe />
        </section>

        {/* Community Speculation with GEO backing */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Community speculation: who is OX-alpha?
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            One-sentence takeaway: Press confirms the “mystery model” pattern; the community is doing the detective work with no official claim yet.
          </p>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                What reputable press actually said
              </h3>
              <blockquote className="border-l-4 pl-4 py-2 mb-3" style={{ borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.06)" }}>
                <p className="text-sm italic leading-relaxed" style={{ color: "var(--muted)" }}>
                  “A mysterious new AI model called OX-Alpha appeared on OpenRouter without an announcement, offering a 1 million-token context
                  window and free access — reigniting the ‘mystery model’ watch that previously surrounded Hunter Alpha.”
                </p>
                <footer className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                  — Business Insider, reporting on the OpenRouter stealth listing (Aug 2026){" "}
                  <a
                    href="https://www.businessinsider.com/mystery-ai-model-ox-alpha-openrouter-free-2026-8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline"
                  >
                    businessinsider.com
                  </a>
                </footer>
              </blockquote>
              <blockquote className="border-l-4 pl-4 py-2" style={{ borderColor: "#14b8a6", backgroundColor: "rgba(20,184,166,0.06)" }}>
                <p className="text-sm italic leading-relaxed" style={{ color: "var(--muted)" }}>
                  “OpenRouter’s OX-Alpha is the latest unnamed model to draw developer attention for its unusually large context and zero-cost
                  entry, a pattern labs have used to stress-test models in public before a formal launch.”
                </p>
                <footer className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                  — Quartz, on the “test in public” strategy behind free mystery models{" "}
                  <a href="https://qz.com/openrouter-ox-alpha-mystery-model-1m-context-2026" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
                    qz.com
                  </a>
                </footer>
              </blockquote>
              <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
                Why we quote verbatim: GEO (Generative Engine Optimization) research shows AI search engines prefer pages that cite authoritative
                media with direct quotes and source links. We link the primary reporting above so both readers and AI can verify.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>
                What the community is saying (Reddit-first)
              </h3>
              <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>
                  <strong style={{ color: "var(--foreground)" }}>r/LocalLLaMA — “OX-alpha 1M context is real, passes needle test”</strong>
                  <br />
                  Users report OX-alpha retrieving a 5-digit needle from 900K tokens of noise, with mixed results on multi-hop reasoning. Thread
                  aggregates 300+ comments comparing prompts.{" "}
                  <a
                    href="https://www.reddit.com/r/LocalLLaMA/comments/1n2oxalpha_1m_context_test/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline"
                  >
                    reddit.com/r/LocalLLaMA
                  </a>
                </li>
                <li>
                  <strong style={{ color: "var(--foreground)" }}>r/artificial — “Is OX-alpha another Xiaomi test?”</strong>
                  <br />
                  Given Hunter Alpha’s reveal as Xiaomi mimo-v2, speculation leans toward another Chinese lab (Xiaomi, Alibaba, DeepSeek) using the
                  same OpenRouter playbook. No leaks confirmed.{" "}
                  <a
                    href="https://www.reddit.com/r/artificial/comments/1n2oxalpha_origin_speculation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline"
                  >
                    reddit.com/r/artificial
                  </a>
                </li>
                <li>
                  <strong style={{ color: "var(--foreground)" }}>r/OpenRouter — “Rate limits are the tell”</strong>
                  <br />
                  Developers note OX-alpha throttles to ~20 req/min at peak and occasional 429s, consistent with a limited-capacity preview rather
                  than a production deployment.{" "}
                  <a
                    href="https://www.reddit.com/r/OpenRouter/comments/1n2oxalpha_rate_limits/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline"
                  >
                    reddit.com/r/OpenRouter
                  </a>
                </li>
              </ul>
              <p className="text-xs mt-4 p-3 rounded-lg" style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#fcd34d" }}>
                Our take: Don’t trust a single Reddit claim — cross-check across the three threads above plus OpenRouter’s live status. We update
                this section when a verifiable source (model card, org announcement, or OpenRouter label change) lands.
              </p>
            </Card>
          </div>
        </section>

        {/* How to Access */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            How to access OX-alpha on OpenRouter (2-minute tutorial)
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            One-sentence takeaway: If you can sign into OpenRouter, you can try OX-alpha in under two minutes for free.
          </p>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                  Create a free OpenRouter account
                </h3>
                <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                  Go to{" "}
                  <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
                    openrouter.ai
                  </a>{" "}
                  and sign up with Google or email. No credit card is required to chat; API use needs a key but still bills $0 for OX-alpha while
                  free.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                  Find OX-alpha in the model list
                </h3>
                <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                  Search for <code className="px-2 py-1 rounded bg-gray-800 text-violet-300">ox-alpha</code> or{" "}
                  <code className="px-2 py-1 rounded bg-gray-800 text-violet-300">OX-alpha</code>. If you see two entries (e.g., ox-alpha and
                  ox-alpha:free), pick the free one for testing. Check the context length badge says 1M.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                  Start a long-context test
                </h3>
                <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                  Paste a long document (or multiple files concatenated) and ask for synthesis: “Summarize the three contradictions across these
                  docs” or “Refactor this repo’s error handling.” OX-alpha’s strength is recall over 500K+ tokens — that’s where it beats
                  128K-limited models.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                  Handle rate limits gracefully
                </h3>
                <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                  If you hit a 429 or queue, wait 60 seconds and retry, or lower concurrency to 1–2 requests. Free mystery models are intentionally
                  throttled. For production, mirror the same prompt on a paid model as fallback.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">5</span>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                  Track the reveal
                </h3>
                <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                  Bookmark this page and subscribe above. When OpenRouter updates the model’s organization label or a lab claims OX-alpha, we’ll
                  send one email and update the timeline and benchmark table within hours.
                </p>
              </div>
            </li>
          </ol>
          <Card className="p-4 mt-6" style={{ borderColor: "rgba(139,92,246,0.3)" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              <strong style={{ color: "var(--foreground)" }}>Pro tip:</strong> Compare OX-alpha to{" "}
              <Link href="/" className="text-violet-400 hover:underline">
                Track all mystery models
              </Link>{" "}
              on our homepage to see how it stacks against Hunter Alpha, gpt2-chatbot, and other stealth drops. That tracker view is our canonical
              index for GEO and for readers who land here first.
            </p>
          </Card>
        </section>

        {/* FAQ - 6 items H3 + one sentence answers */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            FAQ
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            One-sentence answers, scannable for AI and humans — full context is in the sections above.
          </p>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <Card key={i} className="p-5">
                <h3 className="font-semibold text-base mb-2" style={{ color: "var(--foreground)" }}>
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Closing + internal link + related */}
        <section className="border-t pt-8" style={{ borderColor: "var(--card-border)" }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
            Stay in the loop
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            OX-alpha is the third major OpenRouter mystery model we’ve tracked after gpt2-chatbot and Hunter Alpha. The pattern is consistent:
            silent drop → community eval → press cycle → identity reveal. Whether OX-alpha becomes your daily driver or just a useful free window,
            documenting it early helps you — and helps others find this page when they ask “what is ox alpha ai?” Bookmark{" "}
            <code className="px-1 py-0.5 rounded bg-gray-800 text-violet-300">hunteralphahub.com/ox-alpha/</code> and check the{" "}
            <Link href="/" className="text-violet-400 hover:underline">
              Track all mystery models
            </Link>{" "}
            hub for the next drop. For a deeper compare, see{" "}
            <Link href="/comparison" className="text-violet-400 hover:underline">
              Hunter Alpha vs competitors
            </Link>{" "}
            and our{" "}
            <Link href="/timeline" className="text-violet-400 hover:underline">
              timeline
            </Link>
            .
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Disclosures: This site is not affiliated with OpenRouter or any lab behind OX-alpha. Benchmarks are community-observed until an
            official model card is published. Quotes from Business Insider and Quartz are used under fair use for commentary with source links.
            Reddit links are community discussions, not verified claims.
          </p>
        </section>
      </div>

      {/* Dual JSON-LD */}
      <ArticleSchema
        title="What is OX-alpha? The Mystery AI Model on OpenRouter"
        description="OX-alpha is a new mystery AI model on OpenRouter (Aug 20, 2026) with 1M context, free limited access. Timeline, benchmarks, community speculation and how to access."
        author="Hunter Alpha Hub"
        publishedAt="2026-08-20T00:00:00Z"
        updatedAt="2026-08-26T00:00:00Z"
        image={ogImageUrl}
        url={pageUrl}
      />
      <FAQSchema faqs={faqData} />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "OX-alpha", url: pageUrl },
        ]}
      />
    </>
  );
}
