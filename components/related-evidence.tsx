"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Evidence } from "@/lib/types";

interface RelatedEvidenceProps {
  evidenceId: string;
  currentImportance?: string;
}

export function RelatedEvidence({ evidenceId, currentImportance }: RelatedEvidenceProps) {
  const [relatedEvidence, setRelatedEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchRelatedEvidence();
  }, [evidenceId]);

  const fetchRelatedEvidence = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/evidence/${evidenceId}/related`);
      if (response.ok) {
        const data = await response.json();
        setRelatedEvidence(data);
      }
    } catch (error) {
      console.error("Failed to fetch related evidence:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || relatedEvidence.length === 0) {
    return null;
  }

  const importanceColors: Record<string, string> = {
    High: "bg-red-900/50 text-red-400 border-red-800",
    Medium: "bg-yellow-900/50 text-yellow-400 border-yellow-800",
    Low: "bg-gray-700 text-gray-400 border-gray-600",
  };

  return (
    <div
      className="mt-4 p-4 rounded-lg border"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h4 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Related Clues
          </h4>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs text-violet-400 hover:text-violet-300"
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      {/* Related Evidence List */}
      {!collapsed && (
        <div className="space-y-2">
          {relatedEvidence.map((evidence) => (
            <Link
              key={evidence.id}
              href={`/evidence#${evidence.id}`}
              className="block p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
              style={{ borderColor: "var(--card-border)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {evidence.title}
                  </h5>
                  <p className="text-xs mt-1 truncate" style={{ color: "var(--muted)" }}>
                    {evidence.description}
                  </p>
                </div>
                {evidence.importance && (
                  <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${importanceColors[evidence.importance]}`}>
                    {evidence.importance}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "var(--muted)" }}>
                <span className="font-mono text-teal-400">@{evidence.nickname}</span>
                <span>{new Date(evidence.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
