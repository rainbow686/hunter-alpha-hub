import Link from "next/link";

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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            &copy; {currentYear} Hunter Alpha Hub. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
