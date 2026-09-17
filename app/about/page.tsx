import { Card } from "@/components/card";
import Link from "next/link";
import { Metadata } from "next";
import { BreadcrumbListSchema } from "@/components/structured-data";

/**
 * About — publisher identity and editorial rules.
 *
 * Added 2026-09-18 for AdSense readiness (ADS-UX-05 / ADS-PUB-05): before this the
 * only statement of identity on the site was the footer line "Independent
 * reference. Not affiliated with OpenRouter…". The Astro build carries the same
 * page (/about) so the Phase 4 cutover keeps it, and `npm run check:parity`
 * compares the two.
 */

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "About Hunter Alpha Hub",
  description:
    "Who runs this OpenRouter reference, how model facts are verified and dated, how claims are labelled, and how to report a correction.",
  alternates: { canonical: `${baseUrl}/about` },
  openGraph: {
    title: "About Hunter Alpha Hub",
    description: "Who runs this site, and how it decides what is true.",
    url: `${baseUrl}/about`,
    type: "website",
  },
};

const rules = [
  {
    kicker: "Rule 1",
    title: "Facts are read, not remembered",
    body: "Prices, context windows and modalities come from the public catalogue and are re-checked by a scheduled drift check. Every data page states the date its numbers were verified.",
  },
  {
    kicker: "Rule 2",
    title: "Claims are labelled",
    body: "Community findings, vendor statements and our own inferences are marked as claims with their source. A claim never appears in a field that is otherwise a verified fact.",
  },
  {
    kicker: "Rule 3",
    title: "Uncertainty is printed",
    body: "Where something could not be verified, the page says so instead of filling the gap with a plausible number. \u201cUnknown\u201d is a legitimate value here.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "About", url: `${baseUrl}/about` },
        ]}
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">About</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Who runs this site, and how it decides what is true
        </p>
      </div>

      <Card className="p-8 space-y-8">
        <section className="text-sm space-y-4" style={{ color: "var(--muted)" }}>
          <p>
            Hunter Alpha Hub is an independent reference for models on OpenRouter, run by a small
            independent team. It is not affiliated with OpenRouter, with any model provider, or with
            any other company named on the site.
          </p>
          <p>
            Two jobs. First, a durable reference for picking a model: pricing, context window,
            modality and the workloads each model actually suits, read from the public OpenRouter
            catalogue rather than copied from a press release. Second, a record of the anonymous
            Alpha releases — what each one claimed, what it turned out to be, and when its free
            window closed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            How we decide what to publish
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {rules.map((rule) => (
              <div key={rule.kicker} className="rounded-lg border p-4" style={{ borderColor: "var(--card-border)" }}>
                <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{rule.kicker}</div>
                <div className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>{rule.title}</div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{rule.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-sm space-y-4" style={{ color: "var(--muted)" }}>
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>How the site is funded</h2>
          <p>
            Advertising. Ads never influence what is published, which models are recommended, or the
            order of any list; nothing on this site is a paid placement. If that ever changes, the
            page it changes on will say so where the content is.
          </p>
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Corrections</h2>
          <p>
            If a number here is wrong, we want to know — a wrong price is worse than no price. Email{" "}
            <a href="mailto:privacy@hunteralphahub.com" className="text-violet-400 hover:text-violet-300">
              privacy@hunteralphahub.com
            </a>{" "}
            with the URL and what we got wrong, and we will fix the page and note the date it changed.
          </p>
          <p>
            <Link href="/contact" className="text-violet-400 hover:text-violet-300">Contact us →</Link>
          </p>
        </section>
      </Card>
    </div>
  );
}
