import Link from "next/link";

const modelLinks = [
  { href: "/comparison", label: "Model comparison" },
  { href: "/openrouter-models", label: "Model directory" },
  { href: "/best-openrouter-models", label: "Best models" },
  { href: "/openrouter-pricing-calculator", label: "Pricing calculator" },
  { href: "/openrouter-free-models", label: "Free models" },
  { href: "/access", label: "How to use OpenRouter" },
];

const archivedLinks = [
  { href: "/hunter-alpha", label: "Hunter Alpha Tracker" },
  { href: "/ox-alpha", label: "OX Alpha Tracker" },
  { href: "/evidence", label: "Evidence Wall" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/monitor", label: "Monitor" },
  { href: "/timeline", label: "Timeline" },
  { href: "/videos", label: "Videos" },
  { href: "/zh/access", label: "中文访问指南" },
  { href: "/zh/faq", label: "中文 FAQ" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t py-8 mt-auto"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-semibold mb-2">Model Hub</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {modelLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Compare OpenRouter models by pricing, context window, modality and best-use case.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-sm">Archived trackers</h3>
            <div className="grid grid-cols-2 gap-2">
              {archivedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-sm">Company</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-sm text-gray-400 hover:text-violet-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/" className="block text-sm text-gray-400 hover:text-violet-400 transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-sm text-center" style={{ color: "var(--muted)" }}>
          &copy; {currentYear} Model Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
