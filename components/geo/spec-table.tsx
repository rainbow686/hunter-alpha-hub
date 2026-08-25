/**
 * GEO要点4: 让AI省劲 — 对比数据表格化，关键参数前置
 * 表头语义化，首列为实体名，便于AI抽取
 */
interface SpecRow {
  model: string;
  context: string;
  price: string;
  agentic: string;
  status: React.ReactNode;
  highlight?: boolean;
}

export function SpecTable({ rows, caption }: { rows: SpecRow[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--card-border)" }}>
      <table className="w-full text-sm" aria-label={caption}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr style={{ backgroundColor: "var(--card-bg)" }}>
            <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>
              Model
            </th>
            <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>
              Context
            </th>
            <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>
              Price (input / output)
            </th>
            <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>
              Coding / Agentic
            </th>
            <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.model}
              className="border-t"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: row.highlight ? "rgba(139,92,246,0.08)" : undefined,
              }}
            >
              <td className={`p-3 font-medium ${row.highlight ? "text-violet-300" : ""}`} style={!row.highlight ? { color: "var(--foreground)" } : undefined}>
                {row.model}
              </td>
              <td className="p-3" style={{ color: "var(--muted)" }}>
                {row.context}
              </td>
              <td className="p-3" style={{ color: row.price.includes("Free") ? "#34d399" : "var(--muted)" }}>
                {row.price}
              </td>
              <td className="p-3" style={{ color: "var(--muted)" }}>
                {row.agentic}
              </td>
              <td className="p-3">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
