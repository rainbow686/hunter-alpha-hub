import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "OX-alpha vs Hunter Alpha comparison";
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
          padding: "60px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1e1b4b 35%, #6d28d9 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#8b5cf6" }} />
          <span style={{ fontSize: "18px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#a5b4fc" }}>
            Hunter Alpha Hub — Comparison
          </span>
        </div>
        <div style={{ fontSize: "52px", fontWeight: 800, lineHeight: 1.1, marginBottom: "12px" }}>
          OX-alpha vs Hunter Alpha
        </div>
        <div style={{ fontSize: "26px", fontWeight: 600, color: "#5eead4", marginBottom: "20px" }}>
          Two OpenRouter mystery models — side-by-side
        </div>
        <div style={{ fontSize: "18px", color: "#cbd5e1", maxWidth: "780px", lineHeight: 1.5 }}>
          1M context · Free · Table + Timeline · Citations inside
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "36px" }}>
          <div style={{ padding: "10px 18px", borderRadius: "999px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", fontSize: "14px" }}>
            hunteralphahub.com/ox-alpha-vs-hunter-alpha/
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
