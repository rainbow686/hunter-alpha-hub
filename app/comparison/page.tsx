import { Card } from "@/components/card";
import { Metadata } from "next";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Model Comparison - Hunter Alpha Hub",
  description: "Compare Hunter Alpha vs Claude, GPT-4o, Gemini and more. See specs, pricing, context window, and capabilities.",
  keywords: ["Hunter Alpha comparison", "Hunter Alpha vs Claude", "AI model comparison", "Hunter Alpha specs"],
  alternates: {
    canonical: `${baseUrl}/comparison`,
  },
  openGraph: {
    title: "Model Comparison - Hunter Alpha Hub",
    description: "Compare Hunter Alpha with other leading AI models.",
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
}

const models: ModelSpec[] = [
  {
    name: "Hunter Alpha",
    contextWindow: "1,048,576 tokens",
    pricing: "Free",
    multimodal: false,
    provider: "Unknown",
    notes: "Identity unknown, exceptional roleplay capabilities",
    isHunter: true,
  },
  {
    name: "Claude 3.5 Sonnet",
    contextWindow: "200,000 tokens",
    pricing: "$3/$15 per 1M tokens",
    multimodal: true,
    provider: "Anthropic",
    notes: "Strong reasoning and writing capabilities",
  },
  {
    name: "GPT-4o",
    contextWindow: "128,000 tokens",
    pricing: "$2.5/$10 per 1M tokens",
    multimodal: true,
    provider: "OpenAI",
    notes: "Fast inference, strong multimodal understanding",
  },
  {
    name: "Gemini 1.5 Pro",
    contextWindow: "2,000,000 tokens",
    pricing: "$1.25/$5 per 1M tokens",
    multimodal: true,
    provider: "Google",
    notes: "Largest context window, native multimodal",
  },
  {
    name: "Command R+",
    contextWindow: "128,000 tokens",
    pricing: "$3/$15 per 1M tokens",
    multimodal: false,
    provider: "Cohere",
    notes: "Strong RAG and tool use capabilities",
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
          How Hunter Alpha stacks up against other leading AI models
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <Card className="p-6">
          <div className="text-3xl font-bold text-teal-400 mb-2">#1 Context</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Hunter Alpha has the 2nd largest context window available, behind only Gemini 1.5 Pro
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-3xl font-bold text-violet-400 mb-2">100% Free</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            While other models charge per token, Hunter Alpha is completely free on OpenRouter
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-3xl font-bold text-pink-400 mb-2">Text Only</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Unlike most competitors, Hunter Alpha focuses solely on text processing
          </p>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card className="p-6 mb-12 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Model</th>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Context</th>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Pricing</th>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Multimodal</th>
              <th className="text-left py-4 px-4 font-medium" style={{ color: "var(--muted)" }}>Provider</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
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
                        Focus
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
                <td className="py-4 px-4 font-mono text-sm" style={{ color: "var(--muted)" }}>
                  {model.pricing}
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
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            Hunter Alpha Advantages
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Massive 1M token context window</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Completely free to use</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Exceptional roleplay capabilities</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Available on OpenRouter platform</span>
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
              <span className="text-sm" style={{ color: "var(--muted)" }}>Provider identity unknown</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Free pricing may not be sustainable</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Limited documentation and support</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Want to Compare More Models?</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Visit OpenRouter to explore and compare all available models.
          </p>
          <a
            href="https://openrouter.ai/models"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-violet-500 to-teal-500 text-white hover:from-violet-600 hover:to-teal-600 transition-colors"
          >
            Browse OpenRouter Models
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </Card>
      </div>
    </div>
  );
}
