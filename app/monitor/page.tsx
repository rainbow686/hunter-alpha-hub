import { Card } from "@/components/card";
import { StatusBadge } from "@/components/status-badge";

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
  // Mock data - will be replaced with real API calls
  const status = {
    online: true,
    lastSeen: new Date().toISOString(),
    specs: {
      parameters: "1T",
      contextWindow: "1M tokens",
      multimodal: true,
    },
  };

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
          <h2 className="text-lg font-medium mb-4" style={{ color: "var(--muted)" }}>Status</h2>
          <StatusBadge online={status.online} />
          <p className="mt-4 text-sm font-mono" style={{ color: "var(--muted)" }}>
            Last seen: {new Date(status.lastSeen).toLocaleString()}
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4" style={{ color: "var(--muted)" }}>Specifications</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--muted)" }}>Parameters</span>
              <span className="font-mono text-teal-400">{status.specs.parameters}</span>
            </div>
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
          </div>
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
