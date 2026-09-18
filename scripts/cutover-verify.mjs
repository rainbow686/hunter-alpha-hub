#!/usr/bin/env node
/**
 * Phase 4 cutover, in two halves that can be run separately:
 *
 *   node scripts/cutover-verify.mjs --origin https://<preview>.workers.dev
 *       Verify a deployed origin against every gate we know about (headers,
 *       redirects, 404, robots, sitemap, OG cards, hreflang, GA4 tag, the two
 *       dynamic endpoints). Run this against the preview any time.
 *
 *   node scripts/cutover-verify.mjs --deploy
 *       Build, deploy the production Worker (astro/wrangler.production.jsonc) and
 *       then verify https://www.hunteralphahub.com. This is the moment the domain
 *       moves; it refuses to run if the pre-flight gates fail, and prints the
 *       rollback command before it touches anything.
 *
 * Why a script: the cutover is the only irreversible-feeling step in this project
 * and it has ~10 independent things that can be wrong (a noindex stamp leaking in,
 * Supabase secrets missing, redirects not carried over, an apex rule that never
 * got created). A checklist in a document relies on nobody being in a hurry; this
 * runs the checks and prints what failed.
 *
 * It does NOT create the apex → www Redirect Rule (needs zone-level API access);
 * it checks whether that redirect is in place and tells you if it is not.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const ASTRO = join(here, "../astro");
const args = process.argv.slice(2);
const flagValue = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);

const ORIGIN = (flagValue("--origin") ?? (args.includes("--deploy") ? "https://www.hunteralphahub.com" : "")).replace(/\/$/, "");
if (!ORIGIN) {
  console.error("usage: node scripts/cutover-verify.mjs --origin <url>   |   node scripts/cutover-verify.mjs --deploy");
  process.exit(2);
}

const results = [];
const pass = (name, detail) => results.push({ ok: true, name, detail });
const fail = (name, detail) => results.push({ ok: false, name, detail });

const run = (command, commandArgs, options = {}) =>
  execFileSync(command, commandArgs, { cwd: ASTRO, encoding: "utf8", stdio: "pipe", ...options });

const head = async (path) => {
  const response = await fetch(`${ORIGIN}${path}`, { redirect: "manual" });
  return { status: response.status, headers: response.headers, location: response.headers.get("location") ?? "" };
};
const body = async (path) => (await fetch(`${ORIGIN}${path}`)).text();

if (args.includes("--deploy")) {
  console.log("pre-flight: build + all six guards (astro-checks)");
  try {
    run("npm", ["run", "checks"]);
    pass("pre-flight", "npm run checks (build, theme, content, analytics, parity, files, verify:pages)");
  } catch (error) {
    fail("pre-flight", String(error.stdout ?? error).split("\n").slice(-12).join("\n"));
  }

  const blocking = results.filter((entry) => !entry.ok);
  if (blocking.length) {
    console.error("\nREFUSING TO DEPLOY — pre-flight failed:");
    for (const entry of blocking) console.error(`  - ${entry.name}: ${entry.detail}`);
    process.exit(1);
  }

  if (!existsSync(join(ASTRO, "dist", "index.html"))) {
    fail("build output", "astro/dist/index.html missing after build");
  } else {
    pass("build output", "astro/dist is built");
  }

  console.log(`
ROLLBACK (run this if anything below fails):
  Cloudflare dashboard → Workers & Pages → hunter-alpha-hub-astro → Settings → Domains
  → remove both custom domains. Then re-add them on the old Worker "hunter-alpha-hub"
  (it is intentionally NOT deleted). Seconds, not minutes.
`);

  try {
    const output = run("npx", ["wrangler", "deploy", "--config", "wrangler.production.jsonc"]);
    pass("deploy", output.trim().split("\n").slice(-3).join(" | "));
  } catch (error) {
    fail("deploy", String(error.stdout ?? error).split("\n").slice(-12).join("\n"));
  }
}

// ── origin gates (run against whatever --origin points at) ──────────────────
try {
  const home = await head("/");
  if (home.status !== 200) fail("homepage", `expected 200, got ${home.status}`);
  else pass("homepage", "200");

  const robots = home.headers.get("x-robots-tag") ?? "";
  const isPreviewHost = !/hunteralphahub\.com$/.test(new URL(ORIGIN).hostname);
  if (isPreviewHost) {
    if (/noindex/i.test(robots)) pass("x-robots-tag", `preview host correctly noindex ("${robots}")`);
    else fail("x-robots-tag", `preview host must be noindex, got "${robots || "(none)"}"`);
  } else if (/index, follow/i.test(robots) && !/noindex/i.test(robots)) {
    pass("x-robots-tag", `canonical host indexable ("${robots}")`);
  } else {
    fail("x-robots-tag", `canonical host must be "index, follow…", got "${robots || "(none)"}" — is the preview stamp in this build?`);
  }

  const csp = home.headers.get("content-security-policy") ?? "";
  if (csp.includes("default-src")) pass("content-security-policy", csp.slice(0, 60) + "…");
  else fail("content-security-policy", "missing");

  for (const [label, path, expected, check] of [
    ["retired route 301", "/evidence", 301, (r) => r.location.endsWith("/")],
    ["trailing slash 308", "/faq/", 308, (r) => r.location.endsWith("/faq")],
    ["unknown path 404", "/no-such-page-cutover-check", 404, () => true],
  ]) {
    const result = await head(path);
    if (result.status === expected && check(result)) {
      pass(label, `${path} → ${result.status}${result.location ? ` → ${result.location}` : ""}`);
    } else {
      fail(label, `${path} → ${result.status}${result.location ? ` → ${result.location}` : ""} (expected ${expected})`);
    }
  }

  const notFound = await body("/no-such-page-cutover-check");
  if (/That page is not here/.test(notFound)) pass("404 page", "branded not-found page served");
  else fail("404 page", "unknown path does not render the build's 404");

  /*
   * robots.txt is host-dependent on purpose. `astro/scripts/mark-preview.mjs`
   * overwrites it with `Disallow: /` in the preview build (ADR-0009), which is
   * correct for a non-canonical host — so demanding the production Sitemap line
   * here made the preview report a failure that cannot be fixed and should not
   * be. The gate now checks the expectation that belongs to the host it is
   * pointed at, and says which one it applied.
   */
  const robotsTxt = await body("/robots.txt");
  const declaresSitemap = /Sitemap: https:\/\/www\.hunteralphahub\.com\/sitemap\.xml/.test(robotsTxt);
  const blocksAll = /User-agent: \*\s*\nDisallow: \//.test(robotsTxt);
  if (isPreviewHost) {
    if (blocksAll && !declaresSitemap) pass("robots.txt", "preview host correctly disallows all crawling");
    else fail("robots.txt", "preview host must serve the preview robots.txt (Disallow: /), not the production one");
  } else if (declaresSitemap) {
    pass("robots.txt", "Sitemap line present");
  } else {
    fail("robots.txt", "canonical host has no Sitemap line — is the preview stamp in this build?");
  }

  const sitemap = await body("/sitemap.xml");
  const urlCount = (sitemap.match(/<loc>/g) ?? []).length;
  if (urlCount >= 85 && !sitemap.includes("/404")) pass("sitemap", `${urlCount} URLs, no 404 entry`);
  else fail("sitemap", `${urlCount} URLs (expected ≥85, and no 404 entry)`);

  const unionAlpha = await body("/union-alpha");
  if (/googletagmanager\.com\/gtag\/js/.test(unionAlpha)) pass("GA4 tag", "gtag present on /union-alpha");
  else fail("GA4 tag", "no gtag script — the analytics probe is missing from this build");
  if (/hreflang="x-default"/.test(unionAlpha) || /hreflang="zh-CN"/.test(await body("/zh/faq"))) {
    pass("hreflang", "bilingual pairs declared");
  } else {
    fail("hreflang", "no hreflang alternates on the bilingual pages");
  }

  const card = await head("/og/union-alpha.png");
  if (card.status === 200 && (card.headers.get("content-type") ?? "").includes("image/png")) {
    pass("OG card", "/og/union-alpha.png 200 image/png");
  } else {
    fail("OG card", `/og/union-alpha.png → ${card.status} ${card.headers.get("content-type") ?? ""}`);
  }

  const status = await fetch(`${ORIGIN}/api/union-alpha/status`).then((response) => response.json()).catch(() => null);
  if (status && typeof status.online !== "undefined") pass("api: status", `online=${status.online}`);
  else fail("api: status", "/api/union-alpha/status did not return a status payload");

  const subscribe = await fetch(`${ORIGIN}/api/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: `cutover-check+${Date.now()}@example.com` }),
  });
  if (subscribe.status === 200 || subscribe.status === 409) {
    pass("api: subscribe", `${subscribe.status} (Supabase credentials are configured)`);
  } else {
    /*
     * Report the server's own reason. The first version of this gate assumed the
     * only cause was missing secrets, and said so — which was wrong on
     * 2026-09-18, when the secrets were present and the project behind them had
     * been deleted. A gate that names the wrong cause sends the operator to the
     * wrong screen.
     */
    const payload = await subscribe.json().catch(() => ({}));
    const detail = payload.detail || payload.error || "(no body)";
    const configured = !/Not configured/i.test(payload.error ?? "");
    fail(
      "api: subscribe",
      configured
        ? `${subscribe.status} — credentials are present but the store did not answer: ${detail}`
        : `${subscribe.status} — no Supabase credentials on this Worker, so every signup fails. Set SUPABASE_URL and SUPABASE_ANON_KEY before switching. ${detail}`,
    );
  }

  if (!isPreviewHost) {
    const apex = await fetch("https://hunteralphahub.com/", { redirect: "manual" });
    if (apex.status === 308 && (apex.headers.get("location") ?? "").includes("www.hunteralphahub.com")) {
      pass("apex → www", `308 → ${apex.headers.get("location")}`);
    } else {
      fail(
        "apex → www",
        `hunteralphahub.com answered ${apex.status} ${apex.headers.get("location") ?? ""} — create the zone Redirect Rule (host equals hunteralphahub.com → 308 to www + path) or both hosts serve the same pages.`,
      );
    }
  }
} catch (error) {
  fail("origin checks", String(error));
}

const width = Math.max(...results.map((entry) => entry.name.length));
console.log(`\ncutover gates against ${ORIGIN}`);
for (const entry of results) {
  console.log(`  ${entry.ok ? "PASS" : "FAIL"}  ${entry.name.padEnd(width)}  ${entry.detail}`);
}
const failed = results.filter((entry) => !entry.ok);
console.log(`\n${results.length - failed.length}/${results.length} gates passed`);
process.exit(failed.length ? 1 : 0);
