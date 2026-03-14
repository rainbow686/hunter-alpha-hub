"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/card";
import { StatusBadge } from "@/components/status-badge";

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

function DiscussionCard({ discussion }: { discussion: { id: number; source: string; title: string; sentiment: string; url: string } }) {
  return (
    <a
      href={discussion.url}
      className="flex items-center justify-between p-4 rounded-lg border transition-colors hover:border-gray-500"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div>
        <p className="font-medium" style={{ color: "var(--foreground)" }}>{discussion.title}</p>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{discussion.source}</p>
      </div>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          discussion.sentiment === "positive"
            ? "bg-green-900/50 text-green-400"
            : "bg-gray-700 text-gray-400"
        }`}
      >
        {discussion.sentiment}
      </span>
    </a>
  );
}

export default function MonitorPage() {
  const [status, setStatus] = useState<ModelStatus | null>(null);
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

  useEffect(() => {
    fetchStatus();
    // 每 30 秒自动刷新一次
    const interval = setInterval(() => fetchStatus(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const discussions = [
    {
      id: 1,
      source: "Reddit r/LocalLLaMA",
      title: "Hunter Alpha's 1M context is a game changer",
      sentiment: "positive",
      url: "#",
    },
    {
      id: 2,
      source: "Twitter / X",
      title: "Anyone else notice Hunter Alpha's reasoning is on another level?",
      sentiment: "positive",
      url: "#",
    },
    {
      id: 3,
      source: "HackerNews",
      title: "Hunter Alpha vs Claude: A technical comparison",
      sentiment: "neutral",
      url: "#",
    },
  ];

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
      <div className="grid md:grid-cols-2 gap-6 mb-8">
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
        <div className="grid gap-3">
          {discussions.map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))}
        </div>
      </Card>
    </div>
  );
}
