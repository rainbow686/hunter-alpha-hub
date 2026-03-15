"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/evidence", label: "Evidence" },
    { href: "/videos", label: "Videos" },
    { href: "/monitor", label: "Monitor" },
    { href: "/comparison", label: "Comparison" },
    { href: "/timeline", label: "Timeline" },
    { href: "/access", label: "Access" },
    { href: "/faq", label: "FAQ" },
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
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
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
