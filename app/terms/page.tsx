import { Card } from "@/components/card";
import Link from "next/link";
import { Metadata } from "next";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Hunter Alpha Hub, an independent OpenRouter model information site: scope, data accuracy, acceptable use, user submissions, ads and liability.",
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
  openGraph: {
    title: "Terms of Service - Hunter Alpha Hub",
    description: "Terms of Service for Hunter Alpha Hub.",
    url: `${baseUrl}/terms`,
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Terms of Service</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Last updated: September 17, 2026
        </p>
      </div>

      <Card className="p-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            1. Acceptance of These Terms
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            These Terms of Service govern your use of www.hunteralphahub.com (the &quot;Site&quot;).
            By accessing or using the Site you agree to these terms. If you do not agree, please do not
            use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            2. What This Site Is
          </h2>
          <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
            The Site is an independent information resource about AI models available on OpenRouter. We
            publish model directories, comparisons, pricing tools and explanatory articles.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>
              We are <strong>not affiliated with, endorsed by, or acting on behalf of</strong> OpenRouter
              or any model provider mentioned on the Site.
            </li>
            <li>
              Model names, provider names and logos are trademarks of their respective owners and are used
              for identification and comparison purposes only.
            </li>
            <li>
              The Site does not offer model inference. We do not host, proxy or resell access to any AI
              model. Requests to providers are governed by those providers&apos; own terms.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            3. Data Accuracy
          </h2>
          <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
            Factual fields such as pricing, context window and supported modalities are read from public
            provider catalogues and are labelled with the date they were verified. Providers change
            pricing, availability and limits at any time, and models — especially unreleased
            &quot;stealth&quot; models — can be repriced or withdrawn without notice.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>Always confirm current pricing and limits with the provider before relying on them.</li>
            <li>Information is provided for general guidance, not as a guarantee of any specific result.</li>
            <li>
              Where the Site separates verified facts from community speculation, speculation is clearly
              labelled and should not be treated as fact.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            4. Acceptable Use
          </h2>
          <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>use the Site in violation of any applicable law or regulation;</li>
            <li>
              send automated requests at a volume that degrades the Site for others, or attempt to bypass
              rate limits or access controls;
            </li>
            <li>attempt to probe, scan or test the vulnerability of the Site or its infrastructure;</li>
            <li>
              republish substantial portions of the Site&apos;s original content as your own, or present it
              as an official source;
            </li>
            <li>misrepresent your identity when submitting content to the Site.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            5. Submissions and Community Content
          </h2>
          <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
            Some areas of the Site accept user submissions (for example the evidence wall, comments and
            the newsletter form). When you submit content:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>you keep ownership of what you submit;</li>
            <li>
              you grant us a non-exclusive, worldwide, royalty-free licence to display, format and
              distribute that content on the Site;
            </li>
            <li>
              you confirm you have the right to post it and that it is not unlawful, defamatory or
              infringing;
            </li>
            <li>
              we may remove any submission at any time, including content that is spam, off-topic or
              misleading.
            </li>
          </ul>
          <p className="text-sm mt-3" style={{ color: "var(--muted)" }}>
            Data you submit is handled as described in our{" "}
            <Link href="/privacy" className="text-violet-400 hover:text-violet-300">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            6. Third-Party Links, Ads and Tracking
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>
              The Site links out to providers and other third parties. We do not control those sites and
              are not responsible for their content, terms or practices.
            </li>
            <li>
              Some outbound links may carry tracking or referral parameters that let the destination
              identify traffic coming from the Site. We measure outbound clicks in aggregate.
            </li>
            <li>
              Advertising is served by third-party networks. Those networks may use cookies or similar
              technologies subject to their own policies.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            7. No Professional Advice
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Content on the Site — including comparisons, recommendations, cost estimates and sample code —
            is general information. It is not legal, financial, security or professional advice, and it is
            not a substitute for your own evaluation before you commit engineering effort or spend money.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            8. Intellectual Property
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            The Site&apos;s original text, layout, code and tooling are owned by us and protected by
            applicable law. You may quote short excerpts with attribution and a link. Bulk copying,
            scraping for republication, or presenting our content as your own is not permitted.
            Third-party trademarks remain the property of their owners.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            9. Disclaimer of Warranties
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            The Site is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any
            kind, express or implied, including merchantability, fitness for a particular purpose and
            non-infringement. We do not warrant that the Site will be uninterrupted, error-free, or that
            any information it contains is complete or current.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            10. Limitation of Liability
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            To the maximum extent permitted by law, we are not liable for any indirect, incidental,
            special, consequential or punitive damages, or for lost profits, revenue, data or goodwill,
            arising from your use of the Site or your reliance on its content — including costs incurred
            from model pricing, rate limits or service availability that differ from what the Site
            describes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            11. Changes to These Terms
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            We may update these terms from time to time. Changes take effect when posted on this page and
            the &quot;Last updated&quot; date is revised. Continued use of the Site after a change means
            you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            12. Contact
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Questions about these terms:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm mt-4" style={{ color: "var(--muted)" }}>
            <li>
              Email:{" "}
              <a
                href="mailto:privacy@hunteralphahub.com"
                className="text-violet-400 hover:text-violet-300"
              >
                privacy@hunteralphahub.com
              </a>
            </li>
            <li>
              Website:{" "}
              <a
                href="https://www.hunteralphahub.com"
                className="text-violet-400 hover:text-violet-300"
              >
                www.hunteralphahub.com
              </a>
            </li>
          </ul>
        </section>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
