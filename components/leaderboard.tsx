"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/card";
import Link from "next/link";
import { UserBadges } from "@/components/user-badges";

interface Contributor {
  nickname: string;
  evidenceCount: number;
  totalLikes: number;
  highImportanceCount: number;
  rank: number;
}

export function Leaderboard() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"all" | "week" | "month">("all");

  useEffect(() => {
    fetchContributors();
  }, [timeRange]);

  const fetchContributors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contributors?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setContributors(data);
      }
    } catch (error) {
      console.error("Failed to fetch contributors:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="space-y-4">
      {/* Time Range Filter */}
      <div className="flex items-center justify-center gap-2">
        {([
          { value: "all", label: "All Time" },
          { value: "week", label: "This Week" },
          { value: "month", label: "This Month" },
        ] as const).map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              timeRange === range.value
                ? "bg-violet-500 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="text-center py-8" style={{ color: "var(--muted)" }}>
          Loading leaderboard...
        </div>
      ) : contributors.length === 0 ? (
        <Card className="p-8 text-center" style={{ color: "var(--muted)" }}>
          No contributors yet. Be the first!
        </Card>
      ) : (
        <div className="space-y-3">
          {contributors.map((contributor) => (
            <Card
              key={contributor.nickname}
              className="p-4 hover:border-violet-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="text-2xl w-12 text-center">
                  {getRankIcon(contributor.rank)}
                </div>

                {/* Nickname */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${encodeURIComponent(contributor.nickname)}`}
                      className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      @{contributor.nickname}
                    </Link>
                    <UserBadges nickname={contributor.nickname} compact />
                  </div>
                  <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                    {contributor.evidenceCount} evidence · {contributor.totalLikes} likes
                  </div>
                </div>

                {/* High Importance Badge */}
                {contributor.highImportanceCount > 0 && (
                  <span
                    className="text-xs px-2 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-800"
                    title={`${contributor.highImportanceCount} High importance evidence`}
                  >
                    🔥 {contributor.highImportanceCount}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
