import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OX-alpha vs Hunter Alpha — comparison table";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "56px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #2a1a6b 45%, #065f46 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#8b5cf6" }} />
          <span style={{ fontSize: "16px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#a5b4fc" }}>
            Hunter Alpha Hub — Mystery Tracker
          </span>
        </div>
        <div style={{ fontSize: "54px", fontWeight: 800, lineHeight: 1.05, marginBottom: "10px" }}>
          OX-alpha vs Hunter Alpha
        </div>
        <div style={{ fontSize: "26px", fontWeight: 600, color: "#5eead4", marginBottom: "18px" }}>
          Comparing the Two OpenRouter Mystery Models
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
          <div style={{ padding: "8px 16px", borderRadius: "999px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", fontSize: "13px" }}>1M vs 1M Context</div>
          <div style={{ padding: "8px 16px", borderRadius: "999px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "13px" }}>Free vs Revealed</div>
          <div style={{ padding: "8px 16px", borderRadius: "999px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", fontSize: "13px" }}>Full Table Inside</div>
        </div>
        <div style={{ fontSize: "14px", color: "#cbd5e1" }}>hunteralphahub.com/ox-alpha-vs-hunter-alpha/ • vs table • hunteralphahub.com/ox-alpha/</div>
      </div>
    ),
    { ...size }
  );
}
