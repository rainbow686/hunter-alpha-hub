import { Card } from "@/components/card";
import Link from "next/link";
import { Metadata } from "next";
import { BreadcrumbListSchema } from "@/components/structured-data";

/**
 * Contact — the page an AdSense reviewer looks for (ADS-UX-05) and the one a
 * reader needs when a number on the site is wrong.
 *
 * The address is the one already published on /privacy and /terms, so this page
 * promises no mailbox that does not exist. Change the single EMAIL constant if a
 * general-purpose address is set up later (and change it in the Astro twin too).
 */
const EMAIL = "privacy@hunteralphahub.com";
const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Contact Hunter Alpha Hub",
  description:
    "Report a wrong price, a broken page or a factual correction. One address, read by the people who edit the site.",
  alternates: { canonical: `${baseUrl}/contact` },
  openGraph: {
    title: "Contact Hunter Alpha Hub",
    description: "Tell us what we got wrong.",
    url: `${baseUrl}/contact`,
    type: "website",
  },
};

const reasons = [
  {
    kicker: "Corrections",
    body: "A price, context window or availability figure that no longer matches what OpenRouter serves. Include the URL and, if you have it, the value you see.",
  },
  {
    kicker: "Broken pages",
    body: "A link that 404s, a table that will not scroll on your device, a form that will not submit.",
  },
  {
    kicker: "Model tips",
    body: "A new anonymous Alpha release, or something a codename turned out to be before anyone announced it. We verify before publishing.",
  },
  {
    kicker: "Privacy and data",
    body: "Access, correction or deletion of data we hold about you — in practice, an email address if you subscribed to reveal notifications.",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Contact", url: `${baseUrl}/contact` },
        ]}
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Contact</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          One address, read by the people who edit the site
        </p>
      </div>

      <Card className="p-8 space-y-8">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Email{" "}
          <a href={`mailto:${EMAIL}`} className="text-violet-400 hover:text-violet-300">{EMAIL}</a>.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map((reason) => (
            <div key={reason.kicker} className="rounded-lg border p-4" style={{ borderColor: "var(--card-border)" }}>
              <div className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>{reason.kicker}</div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{reason.body}</p>
            </div>
          ))}
        </div>

        <section className="text-sm space-y-4" style={{ color: "var(--muted)" }}>
          <p>
            Corrections on data pages are usually fixed the same day, and the page&rsquo;s verified date
            moves with the fix — so you can see that it changed. We do not publish a response time we
            cannot keep.
          </p>
          <p>
            For what is collected and why, see the{" "}
            <Link href="/privacy" className="text-violet-400 hover:text-violet-300">privacy policy</Link>. For the
            rules this site holds itself to when publishing numbers, see{" "}
            <Link href="/about" className="text-violet-400 hover:text-violet-300">about</Link>.
          </p>
        </section>
      </Card>
    </div>
  );
}
