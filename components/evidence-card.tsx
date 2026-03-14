"use client";

import { useState } from "react";
import { Evidence } from "@/lib/types";

interface EvidenceCardProps {
  evidence: Evidence;
}

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  const [likes, setLikes] = useState(evidence.likes);
  const [loading, setLoading] = useState(false);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/evidence/${evidence.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
      } else {
        alert("Failed to like. Please try again.");
      }
    } catch {
      alert("Failed to like. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-lg p-4 transition-colors backdrop-blur"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
        borderWidth: "1px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--card-border-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--card-border)";
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium truncate" style={{ color: "var(--foreground)" }}>
            {evidence.title}
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {evidence.description}
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm" style={{ color: "var(--muted)" }}>
            <span className="font-mono text-teal-400">@{evidence.nickname}</span>
            <span>·</span>
            <span>{timeAgo(evidence.createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`p-2 transition-colors ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-pink-500"
            }`}
            style={{ color: "var(--muted)" }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <span className="text-sm" style={{ color: loading ? "var(--muted)" : "var(--muted)" }}>
            {likes}
          </span>
        </div>
      </div>

      {evidence.evidenceUrl && (
        <a
          href={evidence.evidenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
        >
          View Evidence
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
