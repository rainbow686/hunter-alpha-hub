import { Card } from "@/components/card";
import Link from "next/link";
import { Metadata } from "next";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Hunter Alpha Hub. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy - Hunter Alpha Hub",
    description: "Privacy Policy for Hunter Alpha Hub.",
    url: `${baseUrl}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Privacy Policy</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Last updated: March 15, 2026
        </p>
      </div>

      <Card className="p-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>1. Introduction</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Hunter Alpha Hub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website at www.hunteralphahub.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>2. Information We Collect</h2>
          <h3 className="text-lg font-medium mb-2" style={{ color: "var(--foreground)" }}>2.1 Information You Provide</h3>
          <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li><strong>Evidence Submissions:</strong> When you submit evidence to our Evidence Wall, we collect your nickname, the content you submit, and any associated metadata.</li>
            <li><strong>Email Subscriptions:</strong> When you subscribe to our newsletter, we collect your email address.</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2" style={{ color: "var(--foreground)" }}>2.2 Automatically Collected Information</h3>
          <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li><strong>Usage Data:</strong> Pages visited, time spent, and interaction patterns</li>
            <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
            <li><strong>Cookies:</strong> We use cookies to improve user experience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>To provide and maintain our website services</li>
            <li>To display user-submitted evidence on our Evidence Wall</li>
            <li>To send notifications about Hunter Alpha updates (for subscribers)</li>
            <li>To analyze website usage and improve user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>4. Third-Party Services</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            We use the following third-party services that may collect information:
          </p>
          <ul className="list-disc list-inside space-y-3 text-sm" style={{ color: "var(--muted)" }}>
            <li>
              <strong>Google Analytics:</strong> We use Google Analytics to analyze website usage. Google may collect and process data about your use of our website.
              <br />
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">
                Google Privacy Policy
              </a>
            </li>
            <li>
              <strong>Google AdSense:</strong> We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to our website.
              <br />
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">
                Google Ads Privacy Policy
              </a>
            </li>
            <li>
              <strong>Supabase:</strong> We use Supabase to store user-submitted evidence and email subscriptions.
              <br />
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">
                Supabase Privacy Policy
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>5. Cookies</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            We use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us remember your preferences and understand website usage. You can disable cookies in your browser settings, but some features of the website may not function properly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>6. Data Retention</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Evidence submissions are retained indefinitely unless you request deletion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>7. Your Rights</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
          </ul>
          <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
            To exercise these rights, please contact us at: <a href="mailto:privacy@hunteralphahub.com" className="text-violet-400 hover:text-violet-300">privacy@hunteralphahub.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>8. Children's Privacy</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>9. Changes to This Privacy Policy</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>10. Contact Us</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm mt-4" style={{ color: "var(--muted)" }}>
            <li>Email: <a href="mailto:privacy@hunteralphahub.com" className="text-violet-400 hover:text-violet-300">privacy@hunteralphahub.com</a></li>
            <li>Website: <a href="https://www.hunteralphahub.com" className="text-violet-400 hover:text-violet-300">www.hunteralphahub.com</a></li>
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
