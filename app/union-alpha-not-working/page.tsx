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
const pageUrl = `${baseUrl}/union-alpha-not-working`;

export const metadata: Metadata = {
  title: "Union Alpha Not Working? Rate Limits, Empty Replies, Missing Model (2026)",
  description:
    "Most Union Alpha failures are one of four things: the endpoint is saturated, the model was delisted or renamed, the request is too large, or your client cannot use tools. What to check first, and what nobody outside the maker can tell you.",
  keywords: [
    "union alpha not working",
    "union alpha error",
    "union alpha rate limit",
    "union alpha 429",
    "stealth/union-alpha error",
    "union alpha timeout",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Union Alpha not working?",
    description:
      "Four failure modes on an anonymous free endpoint, and the order to check them in.",
    url: pageUrl,
    type: "article",
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: "Union Alpha troubleshooting" }],
  },
  robots: { index: true, follow: true },
};

const failureModes = [
  {
    name: "429, or replies that slow to a crawl",
    cause:
      "A free stealth endpoint is one of the busiest endpoints on the internet on the day it launches. Rate limits and queueing are the endpoint protecting itself, not a problem with your account.",
    fix: [
      "Retry with exponential backoff rather than a tight loop; a tight loop makes your own limits worse.",
      "Move bulk work to an off-peak hour where you reasonably can.",
      "Keep a second model wired up for the requests that cannot wait.",
    ],
  },
  {
    name: "The model is missing from the picker, or requests 404",
    cause:
      "Stealth previews get delisted, renamed or moved behind a real model name. When the identity is revealed, the codename often stops being the address.",
    fix: [
      "Check our status endpoint first — it reads the catalogue live.",
      "Confirm you are asking for the id, not the display name: exactly stealth/union-alpha.",
      "If the listing is gone, the reveal has probably happened; check the tracker page for the new name.",
    ],
  },
  {
    name: "Empty, truncated or self-contradicting answers",
    cause:
      "Testers have reported inconsistent behaviour between sessions on this endpoint, which is part of why it is suspected to be several models behind one name. Some of it is the model; some of it is a saturated endpoint returning a partial generation.",
    fix: [
      "Run the same prompt twice. If the two answers disagree in kind, you are seeing a routing or saturation effect, not a prompt problem.",
      "Lower the output length and try again — long generations on a loaded endpoint truncate first.",
      "Do not treat the model's statements about its own identity as evidence either way.",
    ],
  },
  {
    name: "Tools, images or structured output do not work in your client",
    cause:
      "The endpoint declares tools, tool_choice, response_format, temperature, top_p and max_tokens, and it accepts image input. A client that ignores those fields will silently behave as if the feature does not exist.",
    fix: [
      "Check that your client passes the tool definitions through rather than stripping them.",
      "Send a single small image as a test before blaming a long document.",
      "Remember the output cap is 131,072 tokens: very large structured requests can hit it.",
    ],
  },
];

const faqs = [
  {
    question: "Is Union Alpha down right now?",
    answer:
      "Check it rather than guess: the status endpoint on this site reads the OpenRouter catalogue live and reports whether the model is still listed, along with its current price and window. If the catalogue lists it and your requests still fail, the problem is between you and the endpoint — saturation, limits or your client.",
  },
  {
    question: "Does Union Alpha have an official error reference?",
    answer:
      "No. There is no public documentation from the maker, because the maker is anonymous. Anything presented as a definitive Union-Alpha-specific error code list is somebody's inference. We list failure modes and what to check, and we say when we do not know.",
  },
  {
    question: "Why did it work yesterday and not today?",
    answer:
      "Three ordinary reasons: the free preview ended or was repriced, the endpoint is saturated by a traffic spike, or the codename was replaced when the model was revealed. The status endpoint distinguishes the first and third from the second.",
  },
  {
    question: "Should I report the error to anyone?",
    answer:
      "There is no support channel to report it to — no vendor account, no status page, no issue tracker. That is inherent to using an anonymous endpoint, and it is the strongest argument for keeping a fallback model configured.",
  },
];

export default function UnionAlphaNotWorkingPage() {
  return (
    <>
      <ArticleSchema
        title="Union Alpha Not Working? Rate Limits, Empty Replies, Missing Model"
        description="Four failure modes on the Union Alpha stealth endpoint and the order to check them in."
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
          { name: "Not working", url: pageUrl },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-sm mb-6 flex items-center gap-2" style={{ color: "var(--muted)" }}>
          <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/union-alpha" className="hover:text-violet-400 transition-colors">Union Alpha</Link>
          <span>/</span>
          <span className="text-violet-400">Not working</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          <span className="gradient-text">Union Alpha not working?</span>
        </h1>
        <p className="text-lg mb-6 leading-relaxed" style={{ color: "var(--muted)" }}>
          Start with the one check that settles most of it: is the model still listed, and still free? Everything else
          is a smaller question, and there are only four of them.
        </p>

        <Card className="p-6 mb-10" glow>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>Step zero</div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Open <a href="/api/union-alpha/status" className="text-violet-400 hover:underline">/api/union-alpha/status</a>.
            It reads the OpenRouter catalogue live and answers three questions at once: is <code>{UNION_ALPHA_MODEL_ID}</code>{" "}
            still there, is it still $0, and what window and output cap does it currently declare. If the answer is
            &ldquo;no longer listed&rdquo;, stop here — the reveal has happened and the codename is historical.
          </p>
        </Card>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">The four failure modes</h2>
          <div className="space-y-5">
            {failureModes.map((mode, index) => (
              <Card key={mode.name} className="p-5">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: "var(--card-border)", color: "var(--foreground)" }}>
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{mode.name}</h3>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>{mode.cause}</p>
                    <ul className="text-sm mt-3 space-y-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                      {mode.fix.map((step) => <li key={step}>• {step}</li>)}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">What nobody outside the maker can tell you</h2>
          <ul className="space-y-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <li>• Whether your specific account is limited, and to what — there is no account console to look at.</li>
            <li>• When the free window closes. No notice period has ever been published for this line.</li>
            <li>• Whether the endpoint will exist tomorrow. Delisting is the normal end of a stealth release.</li>
            <li>• Why a particular generation came back wrong. Without an operator, &ldquo;the model was busy&rdquo; stays a hypothesis.</li>
          </ul>
          <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
            We keep those limits on the page instead of writing confident-sounding filler, because the point of a
            tracker is to be trustworthy on the day it matters.
          </p>
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
            <h2 className="text-xl font-bold mb-2">Get told when the codename is replaced</h2>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--muted)" }}>
              When Union Alpha is revealed, this is the change that breaks the endpoint for everyone.
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
          <Link href="/union-alpha-opencode" className="rounded-lg border px-5 py-3 text-sm font-semibold transition-colors hover:border-violet-400" style={{ borderColor: "var(--card-border)" }}>
            Using it in OpenCode
          </Link>
        </div>
      </div>
    </>
  );
}
