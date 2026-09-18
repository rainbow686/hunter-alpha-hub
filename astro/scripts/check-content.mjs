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

/**
 * The one factual claim a proofread can catch without touching the catalogue.
 *
 * "The current X is free" was true until 2026-03-23 for Hunter Alpha and until
 * 2026-09-18 for Union Alpha; both are billed now. That sentence lived in 16
 * posts and nothing checked it, so it is now a rule: in any post that mentions
 * Hunter Alpha / MiMo, the patterns that assert a *current* free price fail.
 *
 * Historical phrasing stays legal on purpose — "was completely free only during
 * its preview" is in the corpus and is the wording this rule pushes people
 * toward. There is no "contains the word was" escape hatch, because the first
 * version of this rule had one and an injected `- Start with Hunter Alpha
 * (free!) — … during the March 2026 preview` slipped straight through it. The
 * patterns below only match *unqualified* forms instead, so a sentence has to
 * actually say the price to pass.
 *
 * Union Alpha is deliberately not covered: one page in its own cluster carries
 * a dated reveal banner, so a regex would add false positives without adding
 * coverage.
 */
const MENTIONS_RETIRED_PREVIEW = /\b(hunter alpha|mimo-v2|mimo-v2\.5)\b/i;
const STALE_FREE_CLAIMS = [
  [/\|\s*\*{0,2}(price|pricing)\*{0,2}\s*\|\s*free\s*\|/i, "a price row that still says Free"],
  [/\(free!\)/i, "a parenthetical '(free!)'"],
  [/completely free on openrouter/i, "the phrase 'completely free on OpenRouter'"],
  [/you need 1m context for free/i, "the phrase 'you need 1M context for free'"],
];

for (const name of files) {
  const file = readFileSync(join(CONTENT, name), "utf8");
  const lines = file.split("\n");
  /*
   * Scope is the *post*, not the line. The first version tested the mention on
   * the same line as the claim, and a table row (`| Price | Free | Paid tier |`)
   * never names the model — the header row above it does. So the check found
   * nothing and proved it by not firing on an injected row.
   */
  const postMentionsModel = MENTIONS_RETIRED_PREVIEW.test(file);
  let fence = null;
  let previous = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      fence = fence ? null : trimmed.slice(3).trim() || "text";
      return;
    }
    if (fence) return;
    if (postMentionsModel) {
      for (const [pattern, description] of STALE_FREE_CLAIMS) {
        if (pattern.test(trimmed)) {
          problems.push({
            file: name,
            line: index + 1,
            text: `states a current free price — ${description} — but Hunter Alpha has been billed since 2026-03-23`,
          });
        }
      }
    }
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
