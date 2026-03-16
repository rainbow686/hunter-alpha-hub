import Link from "next/link";
import { Card } from "@/components/card";
import { Evidence } from "@/lib/types";

interface HighlightCardProps {
  evidence: Evidence;
}

export function HighlightCard({ evidence }: HighlightCardProps) {
  const importanceColors = {
    High: "bg-red-900/30 text-red-400 border-red-800",
    Medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
    Low: "bg-gray-700/50 text-gray-400 border-gray-600",
  };

  return (
    <Card className="p-6 glow-border" glow>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500/20 to-teal-500/20">
            <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              Today&apos;s Highlight
            </h3>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {new Date(evidence.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full border ${importanceColors[evidence.importance]}`}>
          {evidence.importance} Importance
        </span>
      </div>

      <h4 className="text-xl font-semibold mb-2 text-violet-400">
        {evidence.title}
      </h4>

      <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
        {evidence.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm" style={{ color: "var(--muted)" }}>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {evidence.nickname}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {evidence.likes}
          </span>
        </div>
        <Link
          href="/evidence"
          className="text-violet-400 hover:text-violet-300 text-sm font-medium inline-flex items-center gap-1"
        >
          View all evidence <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </Card>
  );
}
