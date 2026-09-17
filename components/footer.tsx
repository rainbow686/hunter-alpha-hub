import Link from "next/link";

/**
 * The footer carries two jobs now: the reference cluster (what this site is for)
 * and the legal line. The retired routes are gone from it on purpose — see
 * ADR-0012: links to dead pages are how a site teaches crawlers to waste budget.
 */
const modelLinks = [
  { href: "/comparison", label: "Model comparison" },
  { href: "/openrouter-models", label: "Model directory" },
  { href: "/best-openrouter-models", label: "Best models" },
  { href: "/openrouter-pricing-calculator", label: "Pricing calculator" },
  { href: "/openrouter-free-models", label: "Free models" },
  { href: "/access", label: "How to use OpenRouter" },
];

const stealthLinks = [
  { href: "/stealth-models", label: "Stealth line index" },
  { href: "/union-alpha", label: "Union Alpha (live)" },
  { href: "/alpha-models", label: "How the line works" },
  { href: "/hunter-alpha", label: "Hunter Alpha archive" },
  { href: "/ox-alpha", label: "OX Alpha archive" },
  { href: "/hunter-alpha-benchmarks", label: "Benchmarks" },
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
            <h3 className="font-semibold mb-2 text-sm">Stealth line</h3>
            <div className="grid grid-cols-2 gap-2">
              {stealthLinks.map((link) => (
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
              {/* Trust pages: required for publisher identity (AdSense ADS-UX-05 /
                  ADS-PUB-05) and wanted by anyone checking who publishes these
                  numbers. Kept in the same order as the Astro footer. */}
              <Link href="/about" className="block text-sm text-gray-400 hover:text-violet-400 transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-sm text-gray-400 hover:text-violet-400 transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="block text-sm text-gray-400 hover:text-violet-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm text-gray-400 hover:text-violet-400 transition-colors">
                Terms of Service
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
