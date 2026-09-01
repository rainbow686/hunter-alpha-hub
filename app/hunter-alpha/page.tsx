import { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/hunter-alpha`;

export const metadata: Metadata = {
  title: "Hunter Alpha Archive: Xiaomi MiMo-V2.5 Investigation",
  description:
    "Historical archive of the Hunter Alpha investigation. Hunter Alpha was later identified as Xiaomi MiMo-V2.5 on OpenRouter.",
  keywords: ["hunter alpha", "xiaomi mimo-v2.5", "mimo-v2.5", "hunter alpha archive"],
  alternates: {
    canonical: pageUrl,
  },
  robots: { index: true, follow: true },
};

const archivedPages = [
  { href: "/evidence", label: "Evidence wall" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/monitor", label: "Status monitor" },
  { href: "/timeline", label: "Timeline" },
  { href: "/access", label: "Access guide" },
  { href: "/videos", label: "Videos" },
];

export default function HunterAlphaArchivePage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-300">
            Hunter Alpha was later identified as Xiaomi MiMo-V2.5. This area is now an archive and
            is no longer actively updated.
          </p>
        </div>

        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Hunter Alpha Archive</span>
        </h1>
        <p className="text-lg mb-10" style={{ color: "var(--muted)" }}>
          This is the historical section of the site. The current product focus has moved to the
          OpenRouter model comparison hub.
        </p>

        <Card className="p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Archived pages</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {archivedPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="px-4 py-3 rounded-lg border border-violet-500/20 bg-violet-500/5 text-violet-300 hover:bg-violet-500/10 transition-colors"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </Card>

        <Link
          href="/comparison"
          className="inline-flex px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Go to model comparison
        </Link>
      </div>

      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Hunter Alpha Archive", url: pageUrl },
        ]}
      />
    </>
  );
}
