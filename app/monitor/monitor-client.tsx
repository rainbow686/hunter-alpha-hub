"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/card";
import { StatusBadge } from "@/components/status-badge";
import { CommunityDiscussion } from "@/app/api/community/route";

interface ModelSpecs {
  parameters: string;
  contextWindow: string;
  multimodal: boolean;
  pricing?: {
    prompt?: string;
    completion?: string;
  };
  description?: string;
  architecture?: {
    input_modalities?: string[];
    output_modalities?: string[];
  };
}

interface ModelStatus {
  online: boolean;
  lastSeen: string;
  specs: ModelSpecs;
  error?: string;
}

function DiscussionCard({ discussion }: { discussion: CommunityDiscussion }) {
  const getSourceInfo = (source: string) => {
    switch (source) {
      case "reddit":
        return { name: "Reddit", color: "text-orange-400", bg: "bg-orange-900/20" };
      case "twitter":
        return { name: "Twitter / X", color: "text-blue-400", bg: "bg-blue-900/20" };
      default:
        return { name: "Evidence Wall", color: "text-purple-400", bg: "bg-purple-900/20" };
    }
  };

  const sourceInfo = getSourceInfo(discussion.source);
  const importanceColors = {
    High: "bg-red-900/30 text-red-400 border-red-800",
    Medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
    Low: "bg-gray-700/50 text-gray-400 border-gray-600",
  };

  return (
    <a
      href={discussion.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start justify-between p-4 rounded-lg border transition-colors hover:border-gray-500 group w-full"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded ${sourceInfo.bg} ${sourceInfo.color}`}>
            {sourceInfo.name}
          </span>
          {discussion.importance && (
            <span className={`text-xs px-2 py-0.5 rounded-full border ${importanceColors[discussion.importance]}`}>
              {discussion.importance}
            </span>
          )}
        </div>
        <p className="font-medium group-hover:text-purple-400 transition-colors" style={{ color: "var(--foreground)" }}>
          {discussion.title}
        </p>
        <p className="text-sm mt-1 truncate" style={{ color: "var(--muted)" }}>
          {discussion.description}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: "var(--muted)" }}>
          <span>by {discussion.author}</span>
          <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <svg
        className="w-5 h-5 flex-shrink-0 ml-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ color: "var(--muted)" }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

export default function MonitorClient() {
  const [status, setStatus] = useState<ModelStatus | null>(null);
  const [discussions, setDiscussions] = useState<CommunityDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchStatus = async (isManual = false) => {
    if (isManual) {
      setRefreshing(true);
    }
    try {
      const response = await fetch("/api/status");
      const data = await response.json();
      setStatus(data);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Failed to fetch status:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const response = await fetch("/api/community");
      const data = await response.json();
      setDiscussions(data);
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchDiscussions();
    // 每 30 秒自动刷新一次
    const interval = setInterval(() => {
      fetchStatus(false);
      fetchDiscussions();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Model Monitor</span>
        </h1>
        <p className="max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          Real-time status and specifications for Hunter Alpha.
        </p>
      </div>

      {/* Status Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium" style={{ color: "var(--muted)" }}>Status</h2>
            <button
              onClick={() => fetchStatus(true)}
              disabled={refreshing}
              className="p-2 rounded-lg transition-colors hover:bg-gray-700/50"
              style={{ color: "var(--muted)" }}
              title="Refresh status"
            >
              <svg
                className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          {loading ? (
            <p style={{ color: "var(--muted)" }}>Loading...</p>
          ) : status ? (
            <>
              <StatusBadge online={status.online} />
              <p className="mt-4 text-sm font-mono" style={{ color: "var(--muted)" }}>
                Last seen: {new Date(status.lastSeen).toLocaleString()}
              </p>
              {lastRefreshed && (
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Updated: {lastRefreshed.toLocaleTimeString()}
                </p>
              )}
              {status.error && (
                <p className="mt-2 text-sm text-red-400">{status.error}</p>
              )}
            </>
          ) : (
            <p style={{ color: "var(--muted)" }}>Unable to fetch status</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4" style={{ color: "var(--muted)" }}>Specifications</h2>
          {loading ? (
            <p style={{ color: "var(--muted)" }}>Loading...</p>
          ) : status?.specs ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span style={{ color: "var(--muted)" }}>Context Window</span>
                <span className="font-mono text-teal-400">{status.specs.contextWindow}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: "var(--muted)" }}>Multimodal</span>
                <span className="font-mono text-teal-400">
                  {status.specs.multimodal ? "Yes" : "No"}
                </span>
              </div>
              {status.specs.pricing && status.specs.pricing.prompt === "0" && (
                <div className="mt-2 p-2 rounded-lg border"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--accent)",
                  }}
                >
                  <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                    ✨ Free to use!
                  </p>
                </div>
              )}
              {status.specs.pricing && status.specs.pricing.prompt !== "0" && (
                <>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "var(--muted)" }}>Prompt Price</span>
                    <span className="font-mono text-teal-400">${status.specs.pricing.prompt}/token</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "var(--muted)" }}>Completion Price</span>
                    <span className="font-mono text-teal-400">${status.specs.pricing.completion}/token</span>
                  </div>
                </>
              )}
              {status.specs.architecture?.input_modalities && (
                <div className="flex justify-between items-center">
                  <span style={{ color: "var(--muted)" }}>Input</span>
                  <span className="font-mono text-teal-400">{status.specs.architecture.input_modalities.join(", ")}</span>
                </div>
              )}
              {status.specs.architecture?.output_modalities && (
                <div className="flex justify-between items-center">
                  <span style={{ color: "var(--muted)" }}>Output</span>
                  <span className="font-mono text-teal-400">{status.specs.architecture.output_modalities.join(", ")}</span>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "var(--muted)" }}>No specs available</p>
          )}
        </Card>
      </div>

      {/* Community Discussions */}
      <Card className="p-6">
          <h2 className="text-lg font-medium mb-4" style={{ color: "var(--muted)" }}>Community Discussions</h2>
          {loading ? (
            <p style={{ color: "var(--muted)" }}>Loading discussions...</p>
          ) : discussions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                No external discussions yet.
              </p>
              <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                Submit evidence with Reddit/Twitter links to start the discussion.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {discussions.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))}
            </div>
          )}
        </Card>
    </div>
  );
}
