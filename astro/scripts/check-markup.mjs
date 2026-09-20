#!/usr/bin/env node
/**
 * Markup integrity: no phrasing element may swallow block content, and no
 * phrasing element may sit immediately after a `</table>`.
 *
 * Why this exists: on 2026-09-20 the /union-alpha page shipped with a stray
 * `<code>` opened at its cost table and closed nowhere near it, so the
 * provenance line, the "Calling it" section, the Alpha-line comparison and the
 * entire FAQ rendered inside one inline element. Two visible consequences, both
 * silent to every other guard in this repo: the FAQ was monospaced, and the
 * page's `72ch` reading measure resolved to 694px instead of 641px because `ch`
 * depends on the font. The cause was a compiler bug, not a mistake in the
 * source — which is exactly why the check has to look at the *built output*:
 *
 *   @astrojs/compiler (2.13.1, and still 4.0.0) re-opens the last
 *   element-wrapped expression inside a <table> after the table closes.
 *   `<table><tr><td><code>{x}</code></td></tr></table><p>y</p>` becomes
 *   `<table>…</table><p><code>y</code></p>`. A *bare* `{x}` later in the same
 *   table suppresses it, so whether a page breaks depends on markup elsewhere
 *   in the table and cannot be seen by reading the file.
 *
 * Reproduced as a one-line change in the source; detected here in the artefact.
 * Usage: node scripts/check-markup.mjs   (npm run check:markup, after a build)
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, "../dist");

/** Elements that may only contain phrasing content. `<a>` is deliberately absent:
 *  HTML5 lets an anchor wrap block content, and card links here do exactly that. */
const PHRASING = new Set([
  "code", "em", "strong", "b", "i", "u", "s", "span", "small", "mark", "sub", "sup",
  "abbr", "cite", "q", "time", "kbd", "samp", "var", "label", "bdi", "bdo", "data", "dfn",
]);

/** Content that ends a phrase: any of these inside a phrasing element is invalid. */
const BLOCK = new Set([
  "div", "p", "table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "dl", "dt", "dd",
  "section", "article", "aside", "header", "footer", "nav", "main", "figure",
  "figcaption", "blockquote", "pre", "form", "fieldset", "details", "summary", "hr",
]);

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
  "param", "source", "track", "wbr",
]);

/** `<tag attr="…" attr='…' attr>` — quotes may contain `>`, so they are matched first. */
const TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;

const lineOf = (source, index) => source.slice(0, index).split("\n").length;

function scan(file) {
  const source = readFileSync(file, "utf8");
  const problems = [];
  const stack = [];
  // Set when the previous tag processed was a `</table>`, so rule B only ever
  // looks at the tag that *directly* follows a table. A paragraph that merely
  // happens to open after a table (`</table><p>Use <code>x</code>…`) is fine.
  let justClosedTable = false;
  let inRawText = null;
  let cursor = 0;

  TAG.lastIndex = 0;
  let match;
  while ((match = TAG.exec(source))) {
    const [raw, closing, name, , selfClosing] = match;
    const tag = name.toLowerCase();
    const line = lineOf(source, match.index);
    const afterTable = justClosedTable;
    justClosedTable = false;

    // Raw-text elements: their contents are not markup.
    if (inRawText) {
      if (closing && tag === inRawText) inRawText = null;
      continue;
    }
    if (!closing && (tag === "script" || tag === "style")) {
      inRawText = tag;
      continue;
    }

    if (closing) {
      if (tag === "table") justClosedTable = true;
      for (let i = stack.length - 1; i >= 0; i -= 1) {
        if (stack[i].tag !== tag) continue;
        const node = stack.splice(i, 1)[0];
        if (node.swallowed.length) {
          problems.push({
            line: node.line,
            rule: "phrasing-swallows-block",
            detail: `<${node.tag}> contains ${[...new Set(node.swallowed)].join(", ")}`,
          });
        }
        break;
      }
      cursor = match.index + raw.length;
      continue;
    }

    // Rule B: the compiler leak opens a phrasing element directly after a table.
    // Nothing in this site's markup does that legitimately — a table is always
    // followed by its provenance line or the next section, never by `<code>`.
    if (afterTable && PHRASING.has(tag)) {
      const between = source.slice(cursor, match.index);
      if (!between.trim()) {
        problems.push({
          line,
          rule: "phrasing-after-table",
          detail: `<${tag}> opens immediately after </table>`,
        });
      }
    }

    // `hr` is the one void element that is flow (not phrasing) content, so it ends
    // a phrase like any block. The rest of the void set — br, img, input, … — is
    // phrasing content and perfectly legal inside <span>, <label> and friends.
    if (tag === "hr") {
      for (const node of stack) if (PHRASING.has(node.tag)) node.swallowed.push(tag);
      cursor = match.index + raw.length;
      continue;
    }

    if (VOID.has(tag) || selfClosing) {
      cursor = match.index + raw.length;
      continue;
    }

    if (BLOCK.has(tag)) {
      for (const node of stack) if (PHRASING.has(node.tag)) node.swallowed.push(tag);
    }
    stack.push({ tag, line, swallowed: [] });
    cursor = match.index + raw.length;
  }

  // An element still open at EOF is the other half of the same failure.
  for (const node of stack) {
    if (PHRASING.has(node.tag)) {
      problems.push({
        line: node.line,
        rule: "phrasing-unclosed",
        detail: `<${node.tag}> never closes before the end of the document`,
      });
    }
  }
  return problems;
}

function pages(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) pages(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error("✗ dist/ is missing — run `npm run build` first (this check reads the artefact, not the source)");
  process.exit(1);
}

const files = pages(DIST);
let failures = 0;

for (const file of files) {
  const problems = scan(file);
  if (!problems.length) continue;
  failures += problems.length;
  console.log(`✗ ${relative(DIST, file)}`);
  for (const problem of problems) {
    console.log(`    line ${problem.line}: ${problem.rule} — ${problem.detail}`);
  }
}

console.log(
  failures === 0
    ? `\nMarkup OK — no phrasing element swallows block content across ${files.length} built pages.`
    : `\n${failures} markup problem(s) in ${files.length} built pages.\n` +
      `If a phrasing element leaked past a table, the source cell is an element-wrapped\n` +
      `expression inside that table ({@astrojs/compiler} re-opens it after </table>).\n` +
      `Rewrite it as set:text — see the comment on the cost table in src/pages/union-alpha/index.astro.`,
);

process.exit(failures === 0 ? 0 : 1);
