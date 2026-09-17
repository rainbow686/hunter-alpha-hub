/**
 * Markdown → HTML for the article template.
 *
 * Ported from the Next app's `app/blog/[slug]/page.tsx` renderer, which is the
 * component that actually decides how 35 articles look, with three deliberate
 * fixes over the original:
 *
 *   1. Fenced code blocks (```json) render as <pre><code>. The old renderer had
 *      no fence branch, so every code sample on the site printed its own
 *      backticks as body text.
 *   2. Consecutive list lines become one <ul>/<ol>. The old renderer emitted a
 *      <div> per line, so numbered steps were just paragraphs starting with "1.".
 *   3. Consecutive plain lines join into one paragraph instead of one paragraph
 *      per source line.
 *
 * Everything is escaped before any tag is inserted; the only HTML in the output
 * is what this file writes.
 */

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Inline formatting: `code`, **bold**, [label](href). */
function inline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, href: string) =>
      href.startsWith("/")
        ? `<a href="${href}">${label}</a>`
        : `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`,
    );
}

const isFence = (line: string) => line.trim().startsWith("```");
const isTableRow = (line: string) => line.trim().startsWith("|");
const isSeparatorRow = (line: string) => /^\|[\s:|-]+\|$/.test(line.trim());
const isUnordered = (line: string) => /^-\s+/.test(line.trim());
const isOrdered = (line: string) => /^\d+\.\s+/.test(line.trim());
const isRule = (line: string) => /^(-{3,}|\*{3,})$/.test(line.trim());
const headingMatch = (line: string) => /^(#{1,4})\s+(.*)$/.exec(line.trim());

export interface RenderOptions {
  /**
   * The article layout owns the page's <h1> (it is the indexable title), so a
   * `#` inside the body would create a second one. Production currently ships
   * four <h1> per troubleshooting article because of this; demoting keeps one.
   */
  demoteH1?: boolean;
}

export function renderMarkdown(content: string, options: RenderOptions = {}): string {
  const { demoteH1 = true } = options;
  const lines = content.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (isFence(line)) {
      const lang = trimmed.slice(3).trim();
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !isFence(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      i += 1; // closing fence
      out.push(
        `<pre class="code" data-lang="${escapeHtml(lang || "text")}"><code>${escapeHtml(body.join("\n").replace(/^\n+|\n+$/g, ""))}</code></pre>`,
      );
      continue;
    }

    if (isTableRow(line)) {
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        const raw = lines[i].trim().replace(/^\|/, "").replace(/\|$/, "");
        rows.push(raw.split("|").map((cell) => cell.trim()));
        i += 1;
      }
      const [head, ...rest] = rows;
      const body = rest.filter((row) => !isSeparatorRow(`|${row.join("|")}|`));
      out.push(
        `<div class="table-scroll"><table class="data"><thead><tr>${head
          .map((cell) => `<th>${inline(cell)}</th>`)
          .join("")}</tr></thead><tbody>${body
          .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`,
      );
      continue;
    }

    const heading = headingMatch(line);
    if (heading) {
      const level = demoteH1 && heading[1].length === 1 ? 2 : heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (isRule(line)) {
      out.push("<hr />");
      i += 1;
      continue;
    }

    if (isUnordered(line) || isOrdered(line)) {
      const ordered = isOrdered(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? isOrdered(lines[i]) : isUnordered(lines[i]))) {
        items.push(inline(lines[i].trim().replace(/^(-\s+|\d+\.\s+)/, "")));
        i += 1;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((item) => `<li>${item}</li>`).join("")}</${tag}>`);
      continue;
    }

    if (trimmed === "") {
      i += 1;
      continue;
    }

    // Plain text: join wrapped lines into one paragraph.
    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !isFence(lines[i]) &&
      !isTableRow(lines[i]) &&
      !headingMatch(lines[i]) &&
      !isRule(lines[i]) &&
      !isUnordered(lines[i]) &&
      !isOrdered(lines[i])
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    out.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }

  return out.join("\n");
}
