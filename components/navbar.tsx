"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();

  /**
   * Four destinations, matching the three-tier architecture in ADR-0012: the
   * stealth line (the reason this domain has any traffic), the comparison hub
   * (the evergreen leg), the directory, and the articles. Everything else was
   * moved out of the way — a nav that lists dead pages teaches Google to crawl
   * dead pages.
   */
  const primaryNav = [
    { href: "/stealth-models", label: "Stealth line" },
    { href: "/comparison", label: "Compare" },
    { href: "/openrouter-models", label: "Models" },
    { href: "/blog", label: "Articles" },
  ];

  return (
    <nav
      className="border-b backdrop-blur sticky top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold gradient-text">
            Model Hub
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    pathname === item.href
                      ? "text-violet-600 dark:text-white font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
