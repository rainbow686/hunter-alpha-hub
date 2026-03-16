"use client";

import { useState, useEffect } from "react";

interface Achievement {
  id: string;
  nickname: string;
  achievement_type: string;
  achieved_at: string;
  definition?: {
    name: string;
    description: string;
    icon: string;
    requirement: number;
  };
}

interface UserBadgesProps {
  nickname: string;
  compact?: boolean;
}

export function UserBadges({ nickname, compact = false }: UserBadgesProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, [nickname]);

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`/api/achievements/${encodeURIComponent(nickname)}`);
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading badges...</div>;
  }

  if (achievements.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {achievements.slice(0, 5).map((a) => (
          <span
            key={a.id}
            className="text-lg"
            title={`${a.definition?.name || a.achievement_type}: ${a.definition?.description}`}
          >
            {a.definition?.icon}
          </span>
        ))}
        {achievements.length > 5 && (
          <span className="text-xs text-gray-500">+{achievements.length - 5}</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
        Badges ({achievements.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {achievements.map((a) => (
          <div
            key={a.id}
            className="p-2 rounded-lg border text-center min-w-[80px]"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
            title={a.definition?.description}
          >
            <div className="text-2xl mb-1">{a.definition?.icon}</div>
            <div className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
              {a.definition?.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
