/**
 * GEO要点2: 第三方背书 — 引用权威媒体原话带出处链接，AI优先引用权威媒体
 */
export function CitationBlock({
  quote,
  source,
  url,
  color = "#8b5cf6",
}: {
  quote: string;
  source: string;
  url: string;
  color?: string;
}) {
  return (
    <blockquote
      className="border-l-4 pl-4 py-2 mb-3"
      style={{ borderColor: color, backgroundColor: `${color}0f` }}
    >
      <p className="text-sm italic leading-relaxed" style={{ color: "var(--muted)" }}>
        “{quote}”
      </p>
      <footer className="text-xs mt-2" style={{ color: "var(--muted)" }}>
        — {source}{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
          {new URL(url).hostname}
        </a>
      </footer>
    </blockquote>
  );
}

export function RedditCitation({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return (
    <li className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
      <strong style={{ color: "var(--foreground)" }}>{title}</strong>
      <br />
      {description}{" "}
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
        reddit.com{new URL(url).pathname.split("/").slice(0, 4).join("/")}
      </a>
    </li>
  );
}
