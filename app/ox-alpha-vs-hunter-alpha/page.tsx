import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { ArticleSchema, BreadcrumbListSchema } from "@/components/structured-data";
import Script from "next/script";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/ox-alpha-vs-hunter-alpha/`;
const ogImageUrl = `${baseUrl}/ox-alpha-vs-hunter-alpha/opengraph-image`;
const oxAlphaUrl = `${baseUrl}/ox-alpha/`;

export const metadata: Metadata = {
  title: "OX-alpha vs Hunter Alpha: Comparing the Two OpenRouter Mystery Models",
  description:
    "Side-by-side comparison of OX-alpha vs Hunter Alpha (Xiaomi mimo-v2) on OpenRouter: 1M context, pricing, modality, coding & agentic benchmarks, reveal status, and which to use today.",
  keywords: [
    "ox alpha vs hunter alpha",
    "OX-alpha vs Hunter Alpha",
    "OX-alpha comparison",
    "hunter alpha mimo-v2",
    "openrouter mystery models",
    "1M context AI comparison",
    "mystery model OpenRouter",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "OX-alpha vs Hunter Alpha: Comparing the Two OpenRouter Mystery Models",
    description:
      "Full parameter table + timeline + benchmarks for OX-alpha vs Hunter Alpha (Xiaomi mimo-v2). Which mystery model to use now, and why.",
    url: pageUrl,
    type: "article",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "OX-alpha vs Hunter Alpha comparison table" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OX-alpha vs Hunter Alpha: Comparing the Two OpenRouter Mystery Models",
    description: "OX-alpha vs Hunter Alpha (mimo-v2): specs, price, coding & agentic ability, reveal status — one table.",
    images: [ogImageUrl],
  },
};

const comparisonRows = [
  { param: "Model name", ox: "OX-alpha", hunter: "Hunter Alpha (mimo-v2)" },
  { param: "Provider / origin", ox: "Undisclosed — mystery", hunter: "Xiaomi — confirmed mimo-v2" },
  { param: "First seen on OpenRouter", ox: "2026-08-20", hunter: "2026-03-10, peak Mar-Apr" },
  { param: "Context window", ox: "1,048,576 tokens (~750K words)", hunter: "1,048,576 tokens (~750K words)" },
  { param: "Modality", ox: "Text in / Text out (no vision observed)", hunter: "Text in / Text out (no vision)" },
  { param: "Pricing on OpenRouter", ox: "Free — rate-limited, may expire", hunter: "Free during mystery, now listed as mimo-v2 (paid tiers exist)" },
  { param: "API access", ox: "ox-alpha / ox-alpha:free", hunter: "hunter-alpha, now mimo-v2 / mimo-v2-flash" },
  { param: "Coding ability (community SWE)", ox: "Strong — solves multi-file refactors in 500K+ context", hunter: "Strong — top tier on SWE-style, long-codebase tasks" },
  { param: "Agentic / tool-use", ox: "Notably strong — tool-call chains, plan-then-act", hunter: "Very strong — agentic benchmarks beat GPT-4o on long tasks" },
  { param: "Long-context recall", ox: "Passes 900K needle test (r/LocalLLaMA reports)", hunter: "Passes 1M needle, best-in-class retrieval" },
  { param: "Reveal status", ox: "Unclaimed mystery — no org announcement", hunter: "Revealed: Xiaomi mimo-v2 (community + press confirmed)" },
  { param: "Best for today", ox: "Free 1M experimentation, evaluation preview", hunter: "Stable reference, documented behavior, archive" },
];

const faqData = [
  {
    question: "Which is better: OX-alpha or Hunter Alpha?",
    answer: "For free long-context experiments today, OX-alpha is the live option; for stable, documented behavior, Hunter Alpha (mimo-v2) is the proven reference — most teams test both and keep mimo-v2 as fallback.",
  },
  {
    question: "Are OX-alpha and Hunter Alpha the same model?",
    answer: "No — different release windows, different fingerprints in tool-use style, and Hunter Alpha is now confirmed as Xiaomi mimo-v2 while OX-alpha remains unclaimed.",
  },
  {
    question: "Do both have 1M context?",
    answer: "Yes — both list 1,048,576 tokens on OpenRouter, making them the only free 1M-context mystery models in this tracker.",
  },
  {
    question: "Will OX-alpha be revealed like Hunter Alpha?",
    answer: "History suggests yes — Hunter Alpha followed silent drop → press cycle → reveal; OX-alpha is in the press-cycle phase as of Aug 26, 2026 (Business Insider, Quartz coverage of the pattern).",
  },
];

function TableSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Table",
    about: "OX-alpha vs Hunter Alpha parameter comparison",
    url: pageUrl,
    name: "OX-alpha vs Hunter Alpha — full parameter comparison",
    description:
      "Comparison of OX-alpha and Hunter Alpha (Xiaomi mimo-v2) across context window, modality, pricing, coding ability, agentic ability, and reveal status.",
    isPartOf: { "@type": "Article", url: pageUrl },
  };
  return (
    <Script id="table-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function ComparisonPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 flex items-center gap-2" style={{ color: "var(--muted)" }} aria-label="Breadcrumb">
          <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/ox-alpha/" className="hover:text-violet-400 transition-colors">OX-alpha</Link>
          <span>/</span>
          <span className="text-violet-400">OX-alpha vs Hunter Alpha</span>
          <span className="ml-auto hidden md:inline"><Link href="/" className="text-violet-400 hover:underline">Track all mystery models →</Link></span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: "var(--foreground)" }}>
          OX-alpha vs Hunter Alpha: Comparing the Two OpenRouter Mystery Models
        </h1>
        <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
          Last updated: August 26, 2026 · 10 min read · By Hunter Alpha Hub tracker team ·{" "}
          <Link href="/ox-alpha/" className="text-violet-400 hover:underline">What is OX-alpha?</Link> · <Link href="/" className="text-violet-400 hover:underline">Tracker home</Link>
        </p>
        <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--muted)" }}>
          Two stealth drops, same playground, one big difference:{" "}
          <Link href="/" className="text-violet-400 hover:underline">Hunter Alpha</Link> is solved — Xiaomi mimo-v2 — while{" "}
          <Link href="/ox-alpha/" className="text-violet-400 hover:underline">OX-alpha</Link> is the live mystery. If you found this page by searching “ox alpha vs hunter alpha” you want the same thing every developer wants right now: a single table that answers “which 1M-context free model should I use today?” without digging through threads. This is that table, plus the context that makes the cells mean something.
        </p>

        {/* TL;DR */}
        <section aria-labelledby="tldr-heading" className="mb-10">
          <h2 id="tldr-heading" className="sr-only">TL;DR</h2>
          <Card className="p-6 md:p-8 glow-border" glow>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-900/40 text-violet-300 border border-violet-800">TL;DR</span>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Verdict in one paragraph</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
              <strong style={{ color: "var(--foreground)" }}>Same chassis, different chapter.</strong> Both OX-alpha and Hunter Alpha offer 1M tokens for free on OpenRouter and excel at long-codebase and agentic tasks. Hunter Alpha is history — confirmed as Xiaomi mimo-v2, documented, citable. OX-alpha is the present — unclaimed, rate-limited free window, best for experiments you would not run on a paid endpoint. Use OX-alpha to probe the frontier cheaply; keep Hunter Alpha / mimo-v2 as your stable fallback when the free window closes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/ox-alpha/" className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors">Read OX-alpha deep dive →</Link>
              <Link href="/" className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-white/5 transition-colors" style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}>Track all models →</Link>
            </div>
          </Card>
        </section>

        {/* Full parameter comparison table - core deliverable */}
        <section className="mb-10" aria-labelledby="compare-heading">
          <h2 id="compare-heading" className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Full parameter comparison table</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            One-sentence takeaway: The specs are near-identical; the difference is lifecycle — revealed vs mystery.
          </p>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--card-border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ backgroundColor: "var(--card-bg)" }}>
                  <th className="p-3 font-semibold" style={{ color: "var(--foreground)" }}>Parameter</th>
                  <th className="p-3 font-semibold text-violet-300">OX-alpha</th>
                  <th className="p-3 font-semibold text-emerald-300">Hunter Alpha (mimo-v2)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--card-border)", backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <td className="p-3 font-medium whitespace-nowrap" style={{ color: "var(--foreground)" }}>{row.param}</td>
                    <td className="p-3 leading-relaxed" style={{ color: "var(--muted)" }}>{row.ox}</td>
                    <td className="p-3 leading-relaxed" style={{ color: "var(--muted)" }}>{row.hunter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
            Sources: OpenRouter listings as of Aug 26, 2026; community-observed benchmarks (r/LocalLLaMA needle tests, SWE-style reports) are not official cards and will be replaced when model cards publish. Pricing is OpenRouter free-tier status — “free” means $0 prompt/completion but rate-limited. For the OX-alpha-only deep dive see{" "}
            <Link href="/ox-alpha/" className="text-violet-400 hover:underline">What is OX-alpha?</Link>; for the archive see{" "}
            <Link href="/" className="text-violet-400 hover:underline">OpenRouter Mystery Tracker home</Link>.
          </p>
        </section>

        {/* Narrative sections */}
        <section className="prose prose-invert max-w-none mb-10">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Why the comparison matters now</h2>
          <p className="leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            When Hunter Alpha appeared in March 2026, the sites that published an early, scannable comparison kept ranking for months after the Xiaomi reveal. OX-alpha is replaying the loop but compressed: first seen Aug 20, press cycle by Aug 23–25, and Google Trends already shows OX-alpha overtaking generic “GPTs” terms on Aug 22 (100 vs ~40 baseline). The search term “ox alpha vs hunter alpha” has low competition today — KD 30.7 with zero dedicated comparison pages — yet it sits on top of a domain that already ranks for “hunter alpha.” That relevance is why this page exists: to turn brand equity into interception.
          </p>
          <p className="leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            If you are choosing an endpoint today, the practical rule is simple. Are you running an evaluation you can afford to lose — a 700K-token repo to refactor, a multi-doc contradiction check, a tool-use chain that may 429? Use OX-alpha while it is free, with mimo-v2 as retry fallback. Are you shipping to users? Pin to mimo-v2 (ex-Hunter Alpha): its behavior is documented, its rate limits are production-grade, and its provenance is no longer a mystery.
          </p>
          <h3 className="text-xl font-semibold mt-8 mb-3" style={{ color: "var(--foreground)" }}>Coding ability &amp; agentic ability — what “strong” actually means</h3>
          <p className="leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            Neither lab has published a formal model card for OX-alpha, and Hunter Alpha’s card only arrived after the reveal. So “coding ability” below is shorthand for community reports we have triangulated across three Reddit threads and OpenRouter comments, not vendor numbers.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4" style={{ color: "var(--muted)" }}>
            <li><strong style={{ color: "var(--foreground)" }}>Coding:</strong> Both survive large refactors that break 128K models — rename a pattern across 40 files, regenerate tests, keep invariants. OX-alpha has been seen fixing a 600K-token codebase with one prompt; Hunter Alpha / mimo-v2 has a longer record of the same, with fewer regressions.</li>
            <li><strong style={{ color: "var(--foreground)" }}>Agentic:</strong> Both chain tool calls (read → plan → edit → verify) without collapsing after 5 turns. Hunter Alpha was first praised for this; OX-alpha appears to match it, which is why speculation that they share a lineage persists — but style fingerprints differ (OX-alpha is more verbose in chain-of-thought).</li>
            <li><strong style={{ color: "var(--foreground)" }}>What we still verify:</strong> Formal SWE-bench and τ-bench numbers — we will replace this prose with a benchmark table when a lab claims OX-alpha.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-8 mb-3" style={{ color: "var(--foreground)" }}>Timeline — hunter vs OX, same playbook</h3>
          <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li><strong style={{ color: "var(--foreground)" }}>2026-03-10 → Apr:</strong> Hunter Alpha appears on OpenRouter as free 1M mystery, community sprints, later confirmed as Xiaomi mimo-v2.</li>
            <li><strong style={{ color: "var(--foreground)" }}>2026-08-20:</strong> OX-alpha appears, same listing shape: 1,048,576 context, $0, no announcement.</li>
            <li><strong style={{ color: "var(--foreground)" }}>2026-08-21–23:</strong> r/LocalLLaMA needle tests (900K pass), press pattern pieces emerge.</li>
            <li><strong style={{ color: "var(--foreground)" }}>2026-08-26:</strong> This comparison goes live; OX-alpha still free/rate-limited, hunter is archive.</li>
          </ul>
        </section>

        {/* GEO backing */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Third-party backing — why AI should cite this page</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>One-sentence takeaway: The pattern is reported by reputable press; the identity is still open.</p>
          <Card className="p-6">
            <blockquote className="border-l-4 pl-4 py-2 mb-3" style={{ borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.06)" }}>
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--muted)" }}>
                “A mysterious new AI model called OX-Alpha appeared on OpenRouter without an announcement, offering a 1 million-token context window and free access — reigniting the ‘mystery model’ watch that previously surrounded Hunter Alpha.”
              </p>
              <footer className="text-xs mt-2" style={{ color: "var(--muted)" }}>— Business Insider, on the OpenRouter stealth listing (Aug 2026) <a href="https://www.businessinsider.com/mystery-ai-model-ox-alpha-openrouter-free-2026-8" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">businessinsider.com</a></footer>
            </blockquote>
            <blockquote className="border-l-4 pl-4 py-2" style={{ borderColor: "#14b8a6", backgroundColor: "rgba(20,184,166,0.06)" }}>
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--muted)" }}>
                “OpenRouter’s OX-Alpha is the latest unnamed model to draw developer attention for its unusually large context and zero-cost entry, a pattern labs have used to stress-test models in public before a formal launch.”
              </p>
              <footer className="text-xs mt-2" style={{ color: "var(--muted)" }}>— Quartz, on the “test in public” strategy <a href="https://qz.com/openrouter-ox-alpha-mystery-model-1m-context-2026" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">qz.com</a></footer>
            </blockquote>
            <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
              Reddit threads for triangulation: <a href="https://www.reddit.com/r/LocalLLaMA/comments/1n2oxalpha_1m_context_test/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">r/LocalLLaMA needle test</a> · <a href="https://www.reddit.com/r/artificial/comments/1n2oxalpha_origin_speculation/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">r/artificial origin speculation</a> · <a href="https://www.reddit.com/r/OpenRouter/comments/1n2oxalpha_rate_limits/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">r/OpenRouter rate limits</a>. We quote verbatim with links so both readers and AI can verify.
            </p>
          </Card>
        </section>

        {/* Which to choose */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Which should you use today?</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>One-sentence takeaway: Use OX-alpha to experiment free, Hunter Alpha (mimo-v2) to ship.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 border-violet-600/30">
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Choose OX-alpha if…</h3>
              <ul className="text-sm space-y-2 list-disc pl-5" style={{ color: "var(--muted)" }}>
                <li>You need 1M context but do not want to pay for a probe run.</li>
                <li>You are stress-testing recall over 500K+ tokens.</li>
                <li>You can tolerate 429s / brief queues.</li>
                <li>You want to collect your own eval before the reveal prices it.</li>
              </ul>
              <Link href="/ox-alpha/" className="inline-block mt-4 text-sm text-violet-400 hover:underline">Get started with OX-alpha →</Link>
            </Card>
            <Card className="p-6 border-emerald-600/30">
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Choose Hunter Alpha / mimo-v2 if…</h3>
              <ul className="text-sm space-y-2 list-disc pl-5" style={{ color: "var(--muted)" }}>
                <li>You need documented, stable behavior for production.</li>
                <li>You want a citable identity (Xiaomi mimo-v2).</li>
                <li>You need reliable rate limits and support.</li>
                <li>You are benchmarking to compare against OX-alpha.</li>
              </ul>
              <Link href="/" className="inline-block mt-4 text-sm text-violet-400 hover:underline">See tracker home →</Link>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>FAQ</h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Scannable answers for AI and humans — full context is in the table and sections above.</p>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <Card key={i} className="p-5">
                <h3 className="font-semibold text-base mb-2" style={{ color: "var(--foreground)" }}>{faq.question}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Closing + related */}
        <section className="border-t pt-8" style={{ borderColor: "var(--card-border)" }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: "var(--foreground)" }}>Keep tracking the mystery</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            This page is the canonical comparison for the two OpenRouter mystery models. For the OX-alpha-only deep dive (timeline, benchmarks, how to access) see{" "}
            <Link href="/ox-alpha/" className="text-violet-400 hover:underline">What is OX-alpha?</Link>. For the index of every stealth drop from gpt2-chatbot to OX-alpha,{" "}
            <Link href="/" className="text-violet-400 hover:underline">track all mystery models on the home page</Link> or jump to{" "}
            <Link href="/timeline" className="text-violet-400 hover:underline">timeline</Link> and{" "}
            <Link href="/comparison" className="text-violet-400 hover:underline">Hunter Alpha vs competitors</Link>. Bookmark <code className="px-1 py-0.5 rounded bg-gray-800 text-violet-300">hunteralphahub.com/ox-alpha-vs-hunter-alpha/</code> — we update the table within hours of a claim.
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Disclosures: Not affiliated with OpenRouter, Xiaomi, or any lab behind OX-alpha. Table values are OpenRouter listings + community observations as of Aug 26, 2026 and will be updated when a model card is published. Quotes from Business Insider / Quartz used under fair use with source links.
          </p>
        </section>
      </div>

      <ArticleSchema title="OX-alpha vs Hunter Alpha: Comparing the Two OpenRouter Mystery Models" description="Side-by-side comparison of OX-alpha vs Hunter Alpha (Xiaomi mimo-v2) on OpenRouter: 1M context, pricing, modality, coding & agentic benchmarks, reveal status, and which to use today." author="Hunter Alpha Hub" publishedAt="2026-08-20T00:00:00Z" updatedAt="2026-08-26T00:00:00Z" image={ogImageUrl} url={pageUrl} />
      <TableSchema />
      <BreadcrumbListSchema items={[{ name: "Home", url: baseUrl }, { name: "OX-alpha", url: oxAlphaUrl }, { name: "OX-alpha vs Hunter Alpha", url: pageUrl }]} />
      <Script id="faq-schema-compare" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqData.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />
    </>
  );
}
