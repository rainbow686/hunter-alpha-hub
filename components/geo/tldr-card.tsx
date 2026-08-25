import { Card } from "@/components/card";

interface TldrItem {
  label: string;
  value: string;
  subtext?: string;
  highlight?: boolean;
}

interface TldrCardProps {
  title: string;
  subtitle?: string;
  items: TldrItem[];
  summary: string;
}

/**
 * GEO要点1: 结构化可扫描 — TL;DR卡片，像API一样组织
 * GEO要点4: 关键参数前置 — 放在首屏，AI优先抓取
 */
export function TldrCard({ title, subtitle, items, summary }: TldrCardProps) {
  return (
    <Card className="p-6 md:p-8 glow-border" glow>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-900/40 text-violet-300 border border-violet-800">
          TL;DR
        </span>
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          {title}
        </span>
      </div>
      {subtitle && (
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          {subtitle}
        </p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4" id="tldr-grid">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg p-4"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--card-border)" }}
          >
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
              {item.label}
            </div>
            <div className={`font-semibold ${item.highlight ? "text-emerald-400" : ""}`} style={!item.highlight ? { color: "var(--foreground)" } : undefined}>
              {item.value}
            </div>
            {item.subtext && (
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {item.subtext}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs mt-4 leading-relaxed geo-speakable" style={{ color: "var(--muted)" }} id="tldr-summary">
        <strong>One-sentence summary:</strong> {summary}
      </p>
    </Card>
  );
}
