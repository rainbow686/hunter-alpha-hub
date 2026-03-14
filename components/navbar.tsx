"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const mainNavItems = [
    { href: "/", label: "Home" },
    { href: "/evidence", label: "Evidence Wall" },
    { href: "/monitor", label: "Monitor" },
  ];

  const resourcesItems = [
    { href: "/faq", label: "FAQ" },
    { href: "/access", label: "How to Access" },
    { href: "/timeline", label: "Timeline" },
    { href: "/comparison", label: "Comparison" },
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
            Hunter Alpha Hub
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              {mainNavItems.map((item) => (
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

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  Resources
                  <svg
                    className={`w-4 h-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {resourcesOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50"
                    style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)", borderWidth: "1px" }}
                  >
                    <div className="py-2">
                      {resourcesItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setResourcesOpen(false)}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            pathname === item.href
                              ? "bg-violet-500/10 text-violet-400"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-700/50"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
