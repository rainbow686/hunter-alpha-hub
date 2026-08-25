/**
 * GEO要点3: 差异化适配 — 每H2/H3独立一句话摘要，让不同AI都能摘走
 * 每个Section首段就是 one-sentence takeaway，带 geo-summary 类便于AI定位
 */
export function GeoSection({
  id,
  title,
  takeaway,
  children,
}: {
  id: string;
  title: string;
  takeaway: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10" id={id} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
        {title}
      </h2>
      <p className="text-sm mb-4 geo-summary leading-relaxed" style={{ color: "var(--muted)" }}>
        <em>One-sentence takeaway:</em> {takeaway}
      </p>
      {children}
    </section>
  );
}

export function GeoH3({
  title,
  takeaway,
  children,
}: {
  title: string;
  takeaway?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--foreground)" }}>
        {title}
      </h3>
      {takeaway && (
        <p className="text-sm mb-2 geo-summary" style={{ color: "var(--muted)" }}>
          {takeaway}
        </p>
      )}
      {children}
    </div>
  );
}
