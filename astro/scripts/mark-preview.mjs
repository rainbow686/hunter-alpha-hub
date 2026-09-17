#!/usr/bin/env node
/**
 * Stamp the preview build as noindex.
 *
 * Why this exists: ADR-0009 says every non-canonical host must answer
 * `noindex, nofollow` — the preview Worker is a full copy of the site on
 * *.workers.dev, and a full copy that Google can index is a duplicate-content
 * problem with our own domain.
 *
 * Why it runs at deploy time instead of living in `public/`:
 *   - `_headers` matches paths, not hosts. A committed `X-Robots-Tag: noindex`
 *     would travel with the build and silently deindex the real domain the day
 *     this Worker takes over production (Phase 4). That trap is worse than the
 *     problem it solves, so the stamp is written into `dist/` only by the
 *     preview deploy command and never committed.
 *   - `robots.txt` is blocked the same way, plus `X-Robots-Tag` for crawlers
 *     that fetch a URL they found somewhere without reading robots.txt first.
 *
 * If you are reading this during Phase 4: do not add this step to the
 * production deploy. Delete this file when the preview Worker is retired.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dist = join(dirname(fileURLToPath(import.meta.url)), "../dist");

writeFileSync(
  join(dist, "robots.txt"),
  [
    "# Preview build — not the public site.",
    "# The public site is https://www.hunteralphahub.com (see ADR-0009).",
    "User-agent: *",
    "Disallow: /",
    "",
  ].join("\n"),
);

/**
 * `_headers` is now committed (security headers, same set as next.config.ts), so
 * the stamp **adds** the noindex line instead of replacing the file — otherwise
 * the preview would be the only build without a CSP. If the file is missing the
 * noindex block is written on its own.
 */
const headersPath = join(dist, "_headers");
const ROBOTS_LINE = "  X-Robots-Tag: noindex, nofollow";
if (existsSync(headersPath)) {
  const existing = readFileSync(headersPath, "utf8");
  // Match a header *line* (`  X-Robots-Tag: …`), not the word inside the comment
  // block above it — that mistake shipped a preview build that was indexable.
  const stamped = /^\s*X-Robots-Tag:/m.test(existing)
    ? existing.replace(/^\s*X-Robots-Tag:.*$/m, ROBOTS_LINE)
    : existing.replace(/^\/\*$/m, `/*\n${ROBOTS_LINE}`);
  writeFileSync(headersPath, stamped);
} else {
  writeFileSync(headersPath, ["/*", ROBOTS_LINE, ""].join("\n"));
}

console.log("preview stamp written:");
console.log("  dist/robots.txt  → User-agent: * / Disallow: /");
console.log("  dist/_headers    → X-Robots-Tag: noindex, nofollow");
