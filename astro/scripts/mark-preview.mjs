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
import { writeFileSync } from "node:fs";
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

writeFileSync(
  join(dist, "_headers"),
  ["/*", "  X-Robots-Tag: noindex, nofollow", ""].join("\n"),
);

console.log("preview stamp written:");
console.log("  dist/robots.txt  → User-agent: * / Disallow: /");
console.log("  dist/_headers    → X-Robots-Tag: noindex, nofollow");
