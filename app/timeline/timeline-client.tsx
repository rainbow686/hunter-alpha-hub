"use client";

import { Card } from "@/components/card";
import { NativeBanner } from "@/components/adsterra-ads";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: "discovery" | "discussion" | "milestone" | "theory";
}

const events: TimelineEvent[] = [
  {
    date: "March 12, 2026",
    title: "Hunter Alpha Appears on OpenRouter",
    description: "Hunter Alpha is officially added to OpenRouter as a free model. It's listed as a 1 Trillion parameter model with a 1M token context window, designed for agentic use cases including long-horizon planning, complex reasoning, and multi-step task execution.",
    type: "discovery",
  },
  {
    date: "March 2026",
    title: "1M Context Window Discovery",
    description: "Users quickly discover that Hunter Alpha supports an unprecedented 1,048,576 token context window, making it one of the largest context models available. The model is completely free to use.",
    type: "milestone",
  },
  {
    date: "March 2026",
    title: "Identity Mystery Begins",
    description: "Community members begin analyzing Hunter Alpha's outputs. The official description mentions '1 Trillion parameters' but the true base model remains unknown. Early theories suggest it could be a fine-tuned version of an existing model.",
    type: "theory",
  },
  {
    date: "March 2026",
    title: "Hunter Alpha Hub Created",
    description: "A third-party community hub is created to centralize evidence collection, track model status, and investigate the identity mystery. The site features an evidence wall, FAQ, model comparison, and timeline.",
    type: "milestone",
  },
  {
    date: "March 23, 2026",
    title: "Identity Revealed: Xiaomi mimo-v2",
    description: "Xiaomi officially announces that Hunter Alpha is their mimo-v2 AI model. The mystery is solved after weeks of community speculation. The model remains free on OpenRouter.",
    type: "milestone",
  },
];

const typeColors = {
  discovery: "border-teal-500/50 bg-teal-500/10 text-teal-400",
  discussion: "border-violet-500/50 bg-violet-500/10 text-violet-400",
  milestone: "border-pink-500/50 bg-pink-500/10 text-pink-400",
  theory: "border-amber-500/50 bg-amber-500/10 text-amber-400",
};

const typeLabels = {
  discovery: "Discovery",
  discussion: "Discussion",
  milestone: "Milestone",
  theory: "Theory",
};

export default function TimelineClient() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Timeline of Events</span>
        </h1>
        <p className="max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          The complete history of Hunter Alpha from first sighting to identity reveal
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
        {Object.entries(typeLabels).map(([type, label]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${typeColors[type as keyof typeof typeColors].split(" ")[2]}`} />
            <span className="text-sm" style={{ color: "var(--muted)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Center Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px" style={{ backgroundColor: "var(--card-border)" }} />

        <div className="space-y-8">
          {events.map((event, index) => (
            <Card key={index} className="p-6 relative">
              <div className="flex gap-6">
                {/* Timeline Dot */}
                <div className="flex-shrink-0 relative">
                  <div
                    className={`w-4 h-4 rounded-full ${typeColors[event.type].split(" ")[2]} ring-4 ${typeColors[event.type].split(" ")[1]}`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono" style={{ color: "var(--muted)" }}>
                      {event.date}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${typeColors[event.type]}`}>
                      {typeLabels[event.type]}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: "var(--foreground)" }}>
                    {event.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {event.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Native Banner Ad */}
      <NativeBanner />

      {/* CTA */}
      <div className="mt-12 text-center">
        <Card className="p-8">
          <h2 className="text-xl font-bold mb-4">Help Us Continue the Timeline</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Have you noticed something new about Hunter Alpha? Share your findings.
          </p>
          <a
            href="/evidence"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-violet-500 to-teal-500 text-white hover:from-violet-600 hover:to-teal-600 transition-colors"
          >
            Submit Evidence
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </Card>
      </div>
    </div>
  );
}