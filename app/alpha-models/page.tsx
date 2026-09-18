import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { ArticleSchema, BreadcrumbListSchema, FAQSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/alpha-models`;

export const metadata: Metadata = {
  title: "Alpha Models Explained: How OpenRouter's Anonymous Releases Work",
  description:
    "Why anonymous models keep appearing on OpenRouter: what the Alpha codenames have in common, how a stealth release is staged, what the reveal does to pricing, and how to tell a real listing from a rumour.",
  keywords: [
    "alpha models",
    "alpha model",
    "stealth model openrouter",
    "anonymous ai model",
    "stealth ai model tracker",
    "hunter alpha",
    "ox alpha",
    "union alpha",
    "mystery ai model",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Alpha Models Explained",
    description:
      "The pattern behind Hunter Alpha, OX Alpha and Union Alpha — and what happens when one of them is revealed.",
    url: pageUrl,
    type: "article",
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: "Alpha models tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Models Explained",
    description: "The staging pattern behind the anonymous OpenRouter releases, and how to read the next one.",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

const alphaLine = [
  {
    name: "Hunter Alpha",
    href: "/hunter-alpha",
    appeared: "2026-03-12",
    context: "1M",
    vision: "No",
    outcome: "Xiaomi MiMo-V2.5",
    status: "Revealed",
  },
  {
    name: "OX Alpha",
    href: "/ox-alpha",
    appeared: "2026-08-20",
    context: "1M",
    vision: "No",
    outcome: "Z.ai GLM 5.3 Flash",
    status: "Revealed",
  },
  {
    name: "Union Alpha",
    href: "/union-alpha",
    appeared: "2026-09-16",
    context: "256K",
    vision: "Yes",
    outcome: "Unbiased Pareto",
    status: "Revealed",
  },
];

const faqs = [
  {
    question: "What are the Alpha models?",
    answer:
      "Alpha models is the informal name for a line of anonymous AI models that appeared on OpenRouter as free previews before their makers were disclosed: Hunter Alpha (2026-03-12), OX Alpha (2026-08-20) and Union Alpha (2026-09-16). They share the same pattern: no announcement, no model card, zero pricing, a large context window, and a reveal weeks or months later.",
  },
  {
    question: "What did the Alpha models turn out to be?",
    answer:
      "All three are now confirmed: Hunter Alpha was Xiaomi MiMo-V2.5, OX Alpha was Z.ai GLM 5.3 Flash, and Union Alpha — revealed on 2026-09-18, two days after it appeared — was Unbiased Pareto, the first model in the line with image input.",
  },
  {
    question: "Why do labs release stealth models on OpenRouter?",
    answer:
      "It is a low-cost way to collect real usage data and preference signals under a neutral name: no brand expectations, no launch marketing, no commitment. If the model performs well the maker claims it; if not, nothing was announced.",
  },
  {
    question: "Should I build on an Alpha model?",
    answer:
      "For evaluation and experiments, yes — they are free and capable while they last. For production, no: the provider is anonymous, there is no data-retention or privacy policy, pricing can change to paid without notice, and the endpoint can be withdrawn. Both earlier Alpha models were repriced after their reveal.",
  },
  {
    question: "How do I tell what a stealth model really is?",
    answer:
      "You largely cannot, and self-reports are the weakest evidence: models frequently confabulate their own identity, and a system prompt can instruct one to claim a codename. Treat API-reported metadata as fact, bench runs you can reproduce as evidence, and everything else — including a model's own answers about who made it — as speculation.",
  },
];

export default function AlphaModelsPage() {
  return (
    <>
      <ArticleSchema
        title="Alpha Models: Every Stealth AI Model on OpenRouter"
        description="Hunter Alpha, OX Alpha and Union Alpha tracked: what each was, what it became, and how to judge the next stealth model."
        publishedAt="2026-09-17"
        updatedAt="2026-09-17"
        image={`${baseUrl}/og-image.png`}
        url={pageUrl}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Alpha Models", url: pageUrl },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: "var(--foreground)" }}>
          Alpha models: the anonymous line on OpenRouter
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Three stealth models, one pattern — and none of them is anonymous any more. Last verified
          2026-09-18: the newest entry,{" "}
          <Link href="/union-alpha" className="text-violet-400 hover:underline">
            Union Alpha
          </Link>
          , was revealed as Unbiased Pareto the day this line logged it as live.
        </p>

        <p className="text-lg mb-10 leading-relaxed" style={{ color: "var(--muted)" }}>
          Every few weeks an unnamed model shows up on OpenRouter with a large context window, no price
          and no explanation. The ones named &quot;… Alpha&quot; have followed the same script since March
          2026: appear quietly, absorb a burst of community testing, then get claimed by a real lab.
          This page keeps the whole line in one place, with a clear line between what the API says and
          what the internet thinks.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            The line, in one sentence each
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>
            This page is the explainer, not the register. The full table — context windows, input
            modalities, price while anonymous, price after the reveal — lives on the{" "}
            <Link href="/stealth-models" className="text-violet-400 hover:underline">
              stealth models index
            </Link>
            , which is the one place we extend every time a codename appears.
          </p>
          <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            {alphaLine.map((m) => (
              <li key={m.name}>
                <Link href={m.href} className="text-violet-400 hover:underline">
                  {m.name}
                </Link>{" "}
                — appeared {m.appeared}, {m.context} context, {m.vision.toLowerCase()}. {m.outcome}
                {m.name === "Union Alpha" ? ", revealed two days after it appeared — the shortest window of the three." : ""}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            The pattern, in four moves
          </h2>
          <ol className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>
              <strong style={{ color: "var(--foreground)" }}>1. Silent listing.</strong> The model appears
              in the public catalogue under a neutral or anonymous namespace, free, with a context window
              well above the price point&apos;s norm.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>2. Community testing sprint.</strong> Someone
              notices within hours. Discussion splits into two camps: people benchmarking it, and people
              guessing whose weights it is — usually from its behaviour and its refusals.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>3. Identity guessing, with weak evidence.</strong>{" "}
              Models are unreliable witnesses about themselves, so identity theories are mostly vibes plus
              one anecdote. Our trackers label these separately for that reason.
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>4. Reveal and reprice.</strong> The maker
              claims it, the codename becomes a product name, and the free window closes — as happened to
              both earlier models.
            </li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            The rules we apply to every release
          </h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>
            These are editorial principles, not a procedure. The operational checklist — what to re-read on
            the catalogue, in what order — is on{" "}
            <Link href="/stealth-models" className="text-violet-400 hover:underline">
              the stealth models index
            </Link>
            .
          </p>
          <div className="space-y-3">
            <Card className="p-5">
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                Trust the catalogue, not the claims
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Context window, max output, modality, tool support and price are API facts you can verify
                in seconds. Architecture claims, parameter counts and benchmark tables usually are not.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                Assume the free window closes
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Plan for the endpoint to be repriced or withdrawn. Do not put anonymous endpoints in a
                production path, and never send customer data or credentials to one.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                Test it on your workload, not on the hype
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                A stealth model&apos;s value is entirely task-dependent. Run your own prompts against it and
                a paid model you already trust, and compare cost per completed task rather than a leaderboard
                number.
              </p>
            </Card>
          </div>
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
            Union Alpha → Unbiased Pareto
          </Link>
          <Link
            href="/openrouter-free-models"
            className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            Current free models
          </Link>
          <Link
            href="/comparison"
            className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400"
            style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
          >
            Compare models
          </Link>
        </div>
      </div>
    </>
  );
}
