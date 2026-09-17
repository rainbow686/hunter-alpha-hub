#!/usr/bin/env node
/**
 * One-way import: lib/blog.ts (Next) → src/content/blog/*.md (Astro).
 *
 * This is Phase 2 of ADR-0011. The TS module stays the source of truth until the
 * cutover, so the import can be re-run at any time; once Astro owns the URLs the
 * .md files become the source and this script gets deleted.
 *
 * What it does, and why each part is deliberate:
 *   - one file per post, named `<slug>.md`, because the glob loader derives the
 *     entry id (and therefore the URL) from the filename.
 *   - frontmatter carries every field the old BlogPost had, so nothing the
 *     article template or the structured data needs is lost in the move.
 *   - a leading `# Title` line is dropped: the template owns the page's single
 *     <h1>. Production currently ships four h1 per troubleshooting article.
 *   - the body is written verbatim otherwise. No reflowing, no rewriting.
 *
 * Usage: node scripts/import-blog.mjs [--dry-run]
 */
import { mkdirSync, writeFileSync, readdirSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "../src/content/blog");
const REPO = join(here, "../..");
const dryRun = process.argv.includes("--dry-run");

const { blogPosts } = await import(join(REPO, "lib/blog.ts"));

/** YAML-safe scalar. Titles contain colons, quotes and em dashes. */
const yaml = (value) => `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

/**
 * The article template owns the page's single <h1>, so every body `#` heading is
 * demoted to `##`. Production ships up to eight <h1> on one article, which is
 * both a semantics problem and a duplicate-title signal to crawlers.
 *
 * Fence-aware on purpose: a `# comment` line inside a ```python block is code,
 * not a heading, and demoting it would corrupt the sample.
 */
const demoteHeadings = (content) => {
  let fence = null;
  return content
    .replace(/^\n+/, "")
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("```")) {
        fence = fence ? null : trimmed.slice(3).trim() || "text";
        return line;
      }
      if (!fence && /^#\s+\S/.test(trimmed)) return `## ${trimmed.replace(/^#\s+/, "")}`;
      return line;
    })
    .join("\n")
    .replace(/^\n+/, "");
};

const seen = new Set();
const report = [];

if (!dryRun) mkdirSync(OUT, { recursive: true });

for (const post of blogPosts) {
  if (seen.has(post.slug)) throw new Error(`duplicate slug: ${post.slug}`);
  seen.add(post.slug);

  const body = demoteHeadings(post.content);
  const front = [
    "---",
    `title: ${yaml(post.title)}`,
    `excerpt: ${yaml(post.excerpt)}`,
    `author: ${yaml(post.author)}`,
    `publishedAt: ${yaml(post.publishedAt)}`,
    `category: ${yaml(post.category)}`,
    `readTime: ${post.readTime}`,
    "tags:",
    ...post.tags.map((tag) => `  - ${yaml(tag)}`),
    "---",
    "",
  ].join("\n");

  const file = join(OUT, `${post.slug}.md`);
  if (!dryRun) writeFileSync(file, front + body + "\n");
  report.push({ slug: post.slug, bytes: front.length + body.length + 1 });
}

// Remove files for posts that no longer exist in the source, so a re-run cannot
// leave an orphan page behind that nobody remembers writing.
let removed = 0;
if (!dryRun && existsSync(OUT)) {
  for (const name of readdirSync(OUT)) {
    if (name.endsWith(".md") && !seen.has(name.replace(/\.md$/, ""))) {
      rmSync(join(OUT, name));
      removed += 1;
    }
  }
}

const total = report.reduce((sum, item) => sum + item.bytes, 0);
console.log(
  `${dryRun ? "would import" : "imported"} ${report.length} posts, ${(total / 1024).toFixed(0)} KB` +
    (dryRun ? "" : ` → ${OUT}`) +
    (removed ? `, removed ${removed} orphan file(s)` : ""),
);
console.log(`  shortest: ${report.reduce((a, b) => (a.bytes < b.bytes ? a : b)).slug}`);
console.log(`  longest : ${report.reduce((a, b) => (a.bytes > b.bytes ? a : b)).slug}`);
