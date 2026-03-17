"use client";

import { useState, useEffect } from "react";
import { UserBadges } from "@/components/user-badges";
import { EvidenceCard } from "@/components/evidence-card";
import { Evidence } from "@/lib/types";

interface Achievement {
  achievement_type: string;
  achieved_at: string;
  name?: string;
  description?: string;
  icon?: string;
}

interface ProfileData {
  nickname: string;
  evidence: Evidence[];
  achievements: Achievement[];
  stats: {
    totalEvidence: number;
    totalLikes: number;
    highImportanceCount: number;
    mediumImportanceCount: number;
    lowImportanceCount: number;
  };
}

interface ProfileClientProps {
  nickname: string;
}

export default function ProfileClient({ nickname }: ProfileClientProps) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"evidence" | "achievements">("evidence");

  useEffect(() => {
    fetchProfile();
  }, [nickname]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${encodeURIComponent(nickname)}`);
      if (response.ok) {
        const profileData = await response.json();
        setData(profileData);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!data || data.evidence.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Detective Not Found
        </h1>
        <p className="text-gray-400 mb-6">
          No evidence submitted by <span className="text-teal-400">@{nickname}</span> yet.
        </p>
        <a
          href="/evidence"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-teal-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Submit First Evidence
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header */}
      <div
        className="rounded-xl p-6 mb-6 border"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)"
        }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-teal-500 flex items-center justify-center text-3xl font-bold text-white">
              {nickname.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                  @{nickname}
                </h1>
                <UserBadges nickname={nickname} />
              </div>
              <p className="text-gray-400 mt-1">Community Detective</p>
            </div>
          </div>

          {/* Share Profile */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Profile link copied!");
            }}
            className="px-4 py-2 text-sm text-violet-400 hover:text-violet-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Share Profile
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div
            className="rounded-lg p-4 text-center border"
            style={{
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              borderColor: "var(--card-border)"
            }}
          >
            <div className="text-2xl font-bold text-violet-400">{data.stats.totalEvidence}</div>
            <div className="text-sm text-gray-400 mt-1">Evidence Submitted</div>
          </div>

          <div
            className="rounded-lg p-4 text-center border"
            style={{
              backgroundColor: "rgba(236, 72, 153, 0.1)",
              borderColor: "var(--card-border)"
            }}
          >
            <div className="text-2xl font-bold text-pink-400">{data.stats.totalLikes}</div>
            <div className="text-sm text-gray-400 mt-1">Total Likes</div>
          </div>

          <div
            className="rounded-lg p-4 text-center border"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderColor: "var(--card-border)"
            }}
          >
            <div className="text-2xl font-bold text-red-400">{data.stats.highImportanceCount}</div>
            <div className="text-sm text-gray-400 mt-1">High Importance</div>
          </div>

          <div
            className="rounded-lg p-4 text-center border"
            style={{
              backgroundColor: "rgba(20, 184, 166, 0.1)",
              borderColor: "var(--card-border)"
            }}
          >
            <div className="text-2xl font-bold text-teal-400">{data.achievements.length}</div>
            <div className="text-sm text-gray-400 mt-1">Achievements</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: "var(--card-border)" }}>
        <button
          onClick={() => setActiveTab("evidence")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "evidence"
              ? "text-violet-400 border-b-2 border-violet-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Evidence ({data.stats.totalEvidence})
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "achievements"
              ? "text-violet-400 border-b-2 border-violet-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Achievements ({data.achievements.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "evidence" && (
        <div className="space-y-4">
          {data.evidence.map((evidence) => (
            <EvidenceCard key={evidence.id} evidence={evidence} />
          ))}
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.achievements.map((achievement, index) => (
            <div
              key={`${achievement.achievement_type}-${index}`}
              className="rounded-lg p-4 border flex items-start gap-4"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)"
              }}
            >
              <div className="text-4xl">{achievement.icon || "🏆"}</div>
              <div>
                <h3 className="font-medium" style={{ color: "var(--foreground)" }}>
                  {achievement.name || achievement.achievement_type}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {achievement.description}
                </p>
                <p className="text-xs text-teal-400 mt-2">
                  Unlocked {new Date(achievement.achieved_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
