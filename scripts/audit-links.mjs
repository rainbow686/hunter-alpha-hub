#!/usr/bin/env node
/**
 * Internal-link audit — crawl the live sitemap and report pages nothing links to.
 *
 * Why this exists: this site grows by adding a page per model codename, and a
 * page that nothing links to is invisible twice over — readers cannot reach it,
 * and Google has no path to it. On 2026-09-18 this found /zh/access with zero
 * inbound links while GSC showed only 3 of 25 routes known to Google at all.
 * Adding a page is easy; remembering to link it is the part that rots.
 *
 * Usage:
 *   node scripts/audit-links.mjs                      # against production
 *   node scripts/audit-links.mjs --base http://localhost:3000
 *   node scripts/audit-links.mjs --min-inbound 2      # stricter, for money pages
 *   node scripts/audit-links.mjs --allow /path,/other # documented exceptions
 *
 * Exit code is 1 when any page is below the threshold, so CI can hold the line.
 */

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const BASE = flag("base", "https://www.hunteralphahub.com").replace(/\/$/, "");
const MIN_INBOUND = Number(flag("min-inbound", 1));
const ALLOW = new Set(
  (flag("allow", "") || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean),
);
const CONCURRENCY = 6;
const TIMEOUT_MS = 20_000;

/** Normalise a URL or path to a comparable key: "/", "/access", "/blog/x". */
const key = (u) => {
  const path = u.replace(/^https?:\/\/[^/]+/, "").replace(/[?#].*$/, "");
  return path.replace(/\/+$/, "") || "/";
};

async function get(url) {
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": "hunteralphahub-link-audit/1.0" },
  });
  return { status: res.status, body: res.ok ? await res.text() : "" };
}

const sitemap = await get(`${BASE}/sitemap.xml`);
if (sitemap.status !== 200) {
  console.error(`sitemap not readable: HTTP ${sitemap.status} at ${BASE}/sitemap.xml`);
  process.exit(1);
}

const sitemapUrls = [...sitemap.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
if (sitemapUrls.length === 0) {
  console.error("sitemap parsed to zero URLs — refusing to report a clean bill of health");
  process.exit(1);
}

/**
 * A sitemap lists absolute URLs of the canonical site, so `--base <preview>`
 * would otherwise fetch that sitemap and then crawl *production* — which is what
 * happened the first time this was used to check the Astro preview: it reported
 * Next-era /_next asset 404s and looked like a preview failure. The base origin
 * wins; only the paths are taken from the sitemap.
 */
const urls = sitemapUrls.map((u) => {
  try {
    return `${BASE}${new URL(u).pathname}`;
  } catch {
    return u;
  }
});

/**
 * Links inside a page. We deliberately read only server-rendered href="..."
 * — a link that appears in the DOM after a click (an accordion body, a menu
 * that opens on state) is not a link a crawler ever follows, which is exactly
 * the bug this audit exists to catch.
 */
const linksOf = (html) => [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => key(m[1]));

const pages = new Map(); // path -> outgoing paths
const failures = [];
let cursor = 0;

async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    try {
      const { status, body } = await get(url);
      if (status !== 200) {
        failures.push(`${key(url)} → HTTP ${status}`);
        continue;
      }
      pages.set(key(url), linksOf(body));
    } catch (err) {
      failures.push(`${key(url)} → ${err.message}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const inbound = new Map([...pages.keys()].map((p) => [p, new Set()]));
for (const [from, tos] of pages) {
  for (const to of tos) {
    if (inbound.has(to)) inbound.get(to).add(from);
  }
}

const rows = [...inbound]
  .map(([page, from]) => ({ page, inbound: from.size, from: [...from].sort() }))
  .sort((a, b) => a.inbound - b.inbound || a.page.localeCompare(b.page));

const problems = rows.filter((r) => r.inbound < MIN_INBOUND && !ALLOW.has(r.page));

/**
 * Outbound half of the audit: crawlers follow every internal link, so a link to
 * a retired route (301) or to a page that no longer exists (404) wastes crawl
 * budget on every page that carries it. This is what caught 19 pages still
 * pointing at /evidence and /monitor after those routes were retired on
 * 2026-09-17 — inbound links were fine, the links themselves were dead.
 *
 * `redirect: "manual"` is the point: following redirects reports 200 and hides
 * exactly the case we care about.
 */
const targets = new Map(); // href -> Set of pages linking to it
for (const [from, tos] of pages) {
  for (const to of tos) {
    if (!targets.has(to)) targets.set(to, new Set());
    targets.get(to).add(from);
  }
}

const deadTargets = [];
/** Targets that answer 200 but are not in the sitemap: a live page nobody declares. */
const undeclared = [];
let targetCursor = 0;
const targetList = [...targets.keys()];

/**
 * Paths that legitimately answer 200 without belonging in a sitemap: endpoints
 * and files. Anything else that is linked, live, and missing from the sitemap
 * is a page we forgot to declare — which is how /privacy sat unlisted while
 * being linked from every footer. "Looks like a file" is the rule for assets,
 * so a build hash change never turns into a false alarm.
 */
const NOT_FOR_SITEMAP = /^\/api\/|\.(js|mjs|css|svg|png|jpe?g|webp|gif|ico|xml|txt|json|woff2?)$/i;
const declared = new Set(urls.map(key));

async function targetWorker() {
  while (targetCursor < targetList.length) {
    const href = targetList[targetCursor++];
    try {
      const res = await fetch(`${BASE}${href === "/" ? "/" : href}`, {
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "user-agent": "hunteralphahub-link-audit/1.0" },
      });
      // 200 is the only acceptable answer for a link we ourselves render.
      if (res.status !== 200) {
        deadTargets.push({ href, status: res.status, from: [...targets.get(href)].sort() });
      } else if (!declared.has(href) && !NOT_FOR_SITEMAP.test(href)) {
        undeclared.push({ href, from: [...targets.get(href)].sort() });
      }
    } catch (err) {
      deadTargets.push({ href, status: `error: ${err.message}`, from: [...targets.get(href)].sort() });
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, targetWorker));

console.log(`link audit — ${BASE}`);
console.log(`  pages in sitemap: ${urls.length}   fetched: ${pages.size}`);
console.log(`  threshold: at least ${MIN_INBOUND} inbound internal link(s)\n`);

for (const r of rows.slice(0, 12)) {
  console.log(`  ${String(r.inbound).padStart(3)} inbound  ${r.page}`);
  if (r.inbound > 0 && r.inbound <= 2) console.log(`              ← ${r.from.join(", ")}`);
}
if (rows.length > 12) {
  console.log(`  … ${rows.length - 12} more pages, all at or above the counts shown`);
}

if (failures.length) {
  console.log(`\n  ${failures.length} page(s) did not return 200:`);
  for (const f of failures) console.log(`    ${f}`);
}

if (deadTargets.length) {
  console.log(`\nFAIL — ${deadTargets.length} internal link target(s) do not answer 200:`);
  for (const t of deadTargets) {
    console.log(`    ${t.href} → ${t.status}`);
    console.log(`      linked from: ${t.from.slice(0, 6).join(", ")}${t.from.length > 6 ? ` (+${t.from.length - 6} more)` : ""}`);
  }
  console.log(`\nA 301 here means the page still links a retired route; a 404 means the`);
  console.log(`target was renamed and the link was not. Point the link at a live page.`);
}

if (undeclared.length) {
  console.log(`\nFAIL — ${undeclared.length} linked page(s) are live but missing from the sitemap:`);
  for (const u of undeclared) {
    console.log(`    ${u.href}`);
    console.log(`      linked from: ${u.from.slice(0, 4).join(", ")}${u.from.length > 4 ? ` (+${u.from.length - 4} more)` : ""}`);
  }
  console.log(`\nA sitemap is how Google learns about a page without following links to it.`);
  console.log(`Add it to app/sitemap.ts, or if it is an endpoint, ignore it in NOT_FOR_SITEMAP.`);
}

if (problems.length) {
  console.log(`\nFAIL — ${problems.length} page(s) below ${MIN_INBOUND} inbound link(s):`);
  for (const p of problems) console.log(`    ${p.page}  (${p.inbound})`);
  console.log(`\nFix by linking each page from a page that is already crawled — the`);
  console.log(`navbar or footer reaches every route with one rule. If a page is`);
  console.log(`intentionally unlinked, list it in --allow and say why in the PR.`);
}

process.exit(problems.length || failures.length || deadTargets.length || undeclared.length ? 1 : 0);
