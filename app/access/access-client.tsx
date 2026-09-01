"use client";

import Link from "next/link";
import { Card } from "@/components/card";
import { ExternalLinkWithSmartlink } from "@/components/smartlink";

const steps = [
  {
    number: "01",
    title: "Create an OpenRouter account",
    description:
      "Sign up at openrouter.ai with Google, GitHub or email. A free account is enough to browse models and start testing in the web UI.",
    tip: "Keep an API key ready if you plan to move from testing to production calls.",
  },
  {
    number: "02",
    title: "Pick a model for your task",
    description:
      "Start by task type: coding, long documents, multimodal intake, high-volume extraction or agent workflows. Do not pick by hype alone.",
    tip: "Shortlist two models and run the same five real tasks before deciding.",
  },
  {
    number: "03",
    title: "Test in the OpenRouter playground",
    description:
      "Open the model page, enter a representative prompt and inspect the answer. For agents, test tool calls and structured output too.",
    tip: "Save your prompt, expected output and failure cases so you can compare fairly.",
  },
  {
    number: "04",
    title: "Estimate monthly cost",
    description:
      "Use pricing per million tokens and your real input/output ratio. Long-context and high-volume workloads can change the cheapest option quickly.",
    tip: "Check the calculator page before committing to a provider.",
  },
  {
    number: "05",
    title: "Wire the API into your app",
    description:
      "OpenRouter exposes an OpenAI-compatible interface. Replace the model ID with the one you selected and keep your key in server-side environment variables.",
    tip: "Log model ID, token usage and latency from day one.",
  },
];

export default function AccessClient() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">How to Use OpenRouter</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg" style={{ color: "var(--muted)" }}>
          A practical five-step guide for testing models, estimating cost and moving from the
          OpenRouter playground into production.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step) => (
          <Card key={step.number} className="p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-violet-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                {step.number}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
                  {step.title}
                </h2>
                <p className="mb-4" style={{ color: "var(--muted)" }}>
                  {step.description}
                </p>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <svg className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-violet-300">{step.tip}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="p-8 glow-border">
          <h2 className="text-2xl font-bold mb-4">Choose your first model</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Start with the comparison table, then validate with your own tasks before moving to
            production.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/comparison"
              className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-violet-500 to-teal-500 text-white hover:opacity-90 transition-opacity"
            >
              Compare models
            </Link>
            <ExternalLinkWithSmartlink
              href="https://openrouter.ai"
              className="px-6 py-3 rounded-lg font-medium border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-colors"
            >
              Open OpenRouter
            </ExternalLinkWithSmartlink>
          </div>
        </Card>
      </div>
    </div>
  );
}
