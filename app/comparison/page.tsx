import { Card } from "@/components/card";
import { Metadata } from "next";
import Link from "next/link";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Hunter Alpha (mimo-v2) vs Competitors: Complete Comparison 2026",
  description: "Compare Hunter Alpha (Xiaomi mimo-v2) vs Claude, GPT-4o, Gemini and more. See specs, pricing, context window, and capabilities side-by-side.",
  keywords: ["Hunter Alpha comparison", "mimo-v2 vs Claude", "Hunter Alpha vs GPT-4o", "AI model comparison", "1M context AI", "free AI model"],
  alternates: {
    canonical: `${baseUrl}/comparison`,
  },
  openGraph: {
    title: "Hunter Alpha (mimo-v2) vs Competitors: Complete Comparison",
    description: "See how Hunter Alpha stacks up against Claude, GPT-4o, Gemini and other leading AI models.",
    url: `${baseUrl}/comparison`,
    type: "website",
  },
};

interface ModelSpec {
  name: string;
  contextWindow: string;
  pricing: string;
  multimodal: boolean;
  provider: string;
  notes: string;
  isHunter?: boolean;
  score?: number; // Overall score out of 10
}

const models: ModelSpec[] = [
  {
    name: "Hunter Alpha (mimo-v2)",
    contextWindow: "1,048,576 tokens",
    pricing: "Free",
    multimodal: false,
    provider: "Xiaomi",
    notes: "Best value: 1M context for free",
    isHunter: true,
    score: 9.2,
  },
  {
    name: "Claude 3.5 Sonnet",
    contextWindow: "200,000 tokens",
    pricing: "$3/$15 per 1M tokens",
    multimodal: true,
    provider: "Anthropic",
    notes: "Best overall quality",
    score: 9.5,
  },
  {
    name: "Gemini 1.5 Pro",
    contextWindow: "1,048,576 tokens",
    pricing: "$1.25/$5 per 1M tokens",
    multimodal: true,
    provider: "Google",
    notes: "1M context + multimodal",
    score: 8.8,
  },
  {
    name: "GPT-4o",
    contextWindow: "128,000 tokens",
    pricing: "$2.50/$10 per 1M tokens",
    multimodal: true,
    provider: "OpenAI",
    notes: "Fast, strong all-rounder",
    score: 8.7,
  },
  {
    name: "Llama 3.1 405B",
    contextWindow: "256,000 tokens",
    pricing: "$0.90/$0.90 per 1M tokens",
    multimodal: false,
    provider: "Meta (open weights)",
    notes: "Best self-host option",
    score: 8.3,
  },
  {
    name: "Command R+",
    contextWindow: "128,000 tokens",
    pricing: "$3/$15 per 1M tokens",
    multimodal: false,
    provider: "Cohere",
    notes: "Best for RAG applications",
    score: 7.9,
  },
  {
    name: "Mistral Large",
    contextWindow: "128,000 tokens",
    pricing: "$2/$6 per 1M tokens",
    multimodal: false,
    provider: "Mistral AI",
    notes: "Best EU data residency",
    score: 7.8,
  },
  {
    name: "Qwen 2.5 72B",
    contextWindow: "256,000 tokens",
    pricing: "$0.35/$0.80 per 1M tokens",
    multimodal: false,
    provider: "Alibaba (open weights)",
    notes: "Best for Chinese support",
    score: 8.0,
  },
];

const featureRows = [
  { key: "contextWindow", label: "Context Window", highlight: true },
  { key: "pricing", label: "Pricing (prompt/completion)", highlight: true },
  { key: "multimodal", label: "Multimodal", highlight: false },
  { key: "provider", label: "Provider", highlight: false },
  { key: "notes", label: "Key Feature", highlight: false },
];

export default function ComparisonPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Model Comparison</span>
        </h1>
        <p className="max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          Hunter Alpha (Xiaomi mimo-v2) vs Claude, GPT-4o, Gemini, and 5 other leading AI models
        </p>
        <p className="mt-4 text-sm px-4 py-2 rounded-lg inline-block border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          ✓ Identity confirmed: Hunter Alpha = Xiaomi mimo-v2
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="grid md:grid-cols-4 gap-4 mb-12">
        <Card className="p-6">
          <div className="text-3xl font-bold text-teal-400 mb-2">1M Context</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Tied for largest context window (with Gemini 1.5 Pro)
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-3xl font-bold text-violet-400 mb-2">100% Free</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Only free model with 1M context window
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-3xl font-bold text-pink-400 mb-2">9.2/10</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Overall score (value-adjusted)
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-3xl font-bold text-amber-400 mb-2">#1 Value</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Best cost-to-performance ratio
          </p>
        </Card>
      </div>

      {/* Full Comparison Table */}
      <Card className="p-6 mb-12 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Full Specification Comparison</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Model</th>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Context</th>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Pricing</th>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Multimodal</th>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Provider</th>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {models.sort((a, b) => (b.score || 0) - (a.score || 0)).map((model) => (
              <tr
                key={model.name}
                className={`border-b transition-colors ${
                  model.isHunter ? "bg-violet-500/10" : ""
                }`}
                style={{ borderColor: "var(--card-border)" }}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {model.isHunter && (
                      <span className="text-xs px-2 py-1 rounded-full bg-violet-500 text-white">
                        Our Pick
                      </span>
                    )}
                    <span className={`font-medium ${model.isHunter ? "text-violet-400" : ""}`} style={{ color: model.isHunter ? undefined : "var(--foreground)" }}>
                      {model.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 font-mono text-sm" style={{ color: "var(--muted)" }}>
                  {model.contextWindow}
                </td>
                <td className="py-4 px-4 font-mono text-sm">
                  <span className={model.pricing === "Free" ? "text-green-400 font-medium" : "text-gray-400"}>
                    {model.pricing}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {model.multimodal ? (
                    <span className="text-green-400">Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </td>
                <td className="py-4 px-4" style={{ color: "var(--muted)" }}>
                  {model.provider}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-teal-500"
                        style={{ width: `${(model.score || 0) * 10}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm" style={{ color: "var(--muted)" }}>{model.score}/10</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Head-to-Head: Hunter Alpha vs Top Competitors */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>
          Head-to-Head Comparisons
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Hunter Alpha vs Claude */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "var(--foreground)" }}>
              Hunter Alpha vs Claude 3.5 Sonnet
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Context</span>
                <span className="text-violet-400">1M</span>
                <span className="text-gray-500">200K</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Price</span>
                <span className="text-green-400">Free</span>
                <span className="text-gray-500">$3/$15</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Quality</span>
                <span className="text-gray-400">8.5/10</span>
                <span className="text-teal-400">9.5/10</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Multimodal</span>
                <span className="text-red-400">No</span>
                <span className="text-green-400">Yes</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                <strong>Choose Hunter Alpha for:</strong> Long context, free tier, cost-sensitive apps
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                <strong>Choose Claude for:</strong> Highest quality, production SLA, code generation
              </p>
            </div>
          </Card>

          {/* Hunter Alpha vs Gemini */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "var(--foreground)" }}>
              Hunter Alpha vs Gemini 1.5 Pro
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Context</span>
                <span className="text-violet-400">1M</span>
                <span className="text-violet-400">1M</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Price</span>
                <span className="text-green-400">Free</span>
                <span className="text-gray-500">$1.25/$5</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Quality</span>
                <span className="text-gray-400">8.5/10</span>
                <span className="text-teal-400">8.8/10</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Multimodal</span>
                <span className="text-red-400">No</span>
                <span className="text-green-400">Yes</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                <strong>Choose Hunter Alpha for:</strong> Free 1M context, text-only tasks
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                <strong>Choose Gemini for:</strong> Multimodal, Google Cloud integration
              </p>
            </div>
          </Card>

          {/* Hunter Alpha vs GPT-4o */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "var(--foreground)" }}>
              Hunter Alpha vs GPT-4o
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Context</span>
                <span className="text-violet-400">1M</span>
                <span className="text-gray-500">128K</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Price</span>
                <span className="text-green-400">Free</span>
                <span className="text-gray-500">$2.50/$10</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Quality</span>
                <span className="text-gray-400">8.5/10</span>
                <span className="text-teal-400">8.7/10</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--muted)" }}>Multimodal</span>
                <span className="text-red-400">No</span>
                <span className="text-green-400">Yes</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                <strong>Choose Hunter Alpha for:</strong> Longer context, free tier
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                <strong>Choose GPT-4o for:</strong> Multimodal, faster response, ecosystem
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Use Case Recommendations */}
      <Card className="p-6 mb-12">
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
          Which Model Should You Choose?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3 text-violet-400">Choose Hunter Alpha (mimo-v2) if you need:</h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Maximum context (1M tokens) for free
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cost-effective document analysis
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Long-form content processing
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Multi-turn conversation memory
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                prototyping without budget concerns
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3 text-teal-400">Choose alternatives if you need:</h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-4V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4" clipRule="evenodd" />
                </svg>
                Multimodal (vision/audio) → Claude, GPT-4o, Gemini
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-4V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4" clipRule="evenodd" />
                </svg>
                Production SLA → Claude, GPT-4o
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-4V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4" clipRule="evenodd" />
                </svg>
                Self-hosting → Llama 3.1, Qwen 2.5
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-4V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4" clipRule="evenodd" />
                </svg>
                EU data residency → Mistral Large
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-4V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4" clipRule="evenodd" />
                </svg>
                Chinese language → Qwen 2.5
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Cost Calculator */}
      <Card className="p-6 mb-12">
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
          Cost to Process 10M Tokens/Month
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
                <th className="text-left py-3 px-3 font-medium text-sm" style={{ color: "var(--muted)" }}>Model</th>
                <th className="text-right py-3 px-3 font-medium text-sm" style={{ color: "var(--muted)" }}>Input Cost</th>
                <th className="text-right py-3 px-3 font-medium text-sm" style={{ color: "var(--muted)" }}>Output Cost</th>
                <th className="text-right py-3 px-3 font-medium text-sm" style={{ color: "var(--muted)" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Hunter Alpha", input: 0, output: 0, highlight: true },
                { name: "Qwen 2.5 72B", input: 3.50, output: 8, highlight: false },
                { name: "Llama 3.1 405B", input: 9, output: 9, highlight: false },
                { name: "Mistral Large", input: 20, output: 60, highlight: false },
                { name: "Gemini 1.5 Pro", input: 12.50, output: 50, highlight: false },
                { name: "GPT-4o", input: 25, output: 100, highlight: false },
                { name: "Claude 3.5 Sonnet", input: 30, output: 150, highlight: false },
              ].map((row) => (
                <tr
                  key={row.name}
                  className={`border-b ${row.highlight ? "bg-green-500/10" : ""}`}
                  style={{ borderColor: "var(--card-border)" }}
                >
                  <td className="py-3 px-3 font-medium" style={{ color: row.highlight ? "var(--accent)" : "var(--foreground)" }}>
                    {row.name}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm" style={{ color: "var(--muted)" }}>
                    ${row.input.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm" style={{ color: "var(--muted)" }}>
                    ${row.output.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm font-bold" style={{ color: row.highlight ? "var(--accent)" : "var(--foreground)" }}>
                    ${row.input + row.output}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-4 text-center" style={{ color: "var(--muted)" }}>
          Hunter Alpha saves <span className="text-green-400 font-medium">$62-$180/month</span> compared to paid alternatives at this usage level.
        </p>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            Hunter Alpha (mimo-v2) Advantages
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Massive 1M token context window (tied for #1)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Completely free to use (Xiaomi-backed)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Strong long-document analysis capabilities</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Available on OpenRouter with API access</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            Known Limitations
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Text-only (no image/audio support)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Slower response times vs competitors</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Free pricing may change in the future</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Limited official documentation from Xiaomi</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Try Hunter Alpha?</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Start using Hunter Alpha (Xiaomi mimo-v2) for free on OpenRouter.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://openrouter.ai/models/xiaomi/mimo-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-violet-500 to-teal-500 text-white hover:from-violet-600 hover:to-teal-600 transition-colors"
            >
              Try Hunter Alpha Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <Link
              href="/access"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-violet-500 text-violet-400 hover:bg-violet-500/10 transition-colors"
            >
              Access Guide
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
