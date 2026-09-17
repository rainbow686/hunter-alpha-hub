#!/usr/bin/env node
/**
 * Content proofread guard for src/content/blog/*.md.
 *
 * Phase 2 moves 35 articles out of a TypeScript string and into real files, which
 * is the first time anyone can see them as documents. The first thing that showed
 * up: seven generated comparison posts printed the same section twice in a row —
 * a copy-paste bug in the generator that had been live for months. Fixing it once
 * is not the point; not shipping it again is, so the rule is a check:
 *
 *   two consecutive headings with the same text = fail.
 *
 * Repeats that are far apart are legitimate (a "Code" subsection under each of
 * five scenarios), so only adjacency is flagged. Fenced code is skipped: a
 * `# comment` inside a shell sample is not a heading.
 *
 * Usage: node scripts/check-content.mjs   (npm run check:content)
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const CONTENT = process.env.CONTENT_DIR ?? join(here, "../src/content/blog");

const problems = [];
const files = readdirSync(CONTENT).filter((name) => name.endsWith(".md"));

for (const name of files) {
  const lines = readFileSync(join(CONTENT, name), "utf8").split("\n");
  let fence = null;
  let previous = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      fence = fence ? null : trimmed.slice(3).trim() || "text";
      return;
    }
    if (fence) return;
    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (!heading) return;
    const key = heading[2].trim();
    if (previous && previous.key === key) {
      problems.push({
        file: name,
        line: index + 1,
        text: `"${key}" repeats the previous heading (line ${previous.line}) — the section above it has no body of its own`,
      });
    }
    previous = { key, line: index + 1 };
  });
}

console.log(`checked ${files.length} articles`);
if (problems.length) {
  console.error(`\n${problems.length} content problem(s):`);
  for (const problem of problems) console.error(`  - ${problem.file}:${problem.line} ${problem.text}`);
  process.exit(1);
}
console.log("no consecutive duplicate headings.");
