import { ImageResponse } from "next/og";
import {
  formatContextWindow,
  formatPrice,
  getModelBySlug,
} from "@/lib/openrouter-models";

export const alt = "OpenRouter Model Hub model comparison card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const model = getModelBySlug(slug);

  const title = model?.name ?? "OpenRouter Model Hub";
  const subtitle = model
    ? "Pricing, context window and best-fit workloads"
    : "Compare AI models by pricing, context and workload";
  const facts = model
    ? [
        formatContextWindow(model.contextWindow),
        `${formatPrice(model.inputPricePerMillion)} input`,
        `${formatPrice(model.outputPricePerMillion)} output`,
        model.vendor,
      ]
    : ["Pricing", "Context window", "Modalities", "Workloads"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1e1b4b 42%, #0f766e 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#8b5cf6" }} />
          <div style={{ fontSize: "18px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#a5b4fc" }}>
            OpenRouter Model Hub
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: model && model.name.length > 28 ? "56px" : "66px", fontWeight: 800, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ fontSize: "28px", fontWeight: 600, color: "#5eead4" }}>
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {facts.map((fact) => (
            <div
              key={fact}
              style={{
                padding: "10px 18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                fontSize: "16px",
                color: "#e2e8f0",
              }}
            >
              {fact}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#94a3b8", fontSize: "16px" }}>
          <div style={{ fontFamily: "monospace" }}>{model?.id ?? "openrouter.ai"}</div>
          <div>hunteralphahub.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
