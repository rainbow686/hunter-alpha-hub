#!/usr/bin/env node
/**
 * Traffic report for hunteralphahub.com from Cloudflare Web Analytics.
 *
 * Why this exists: GA4 tells you what people do on the site, but the Cloudflare
 * beacon is already installed and gives a Google-free read on how many people
 * arrive at all. Use it for the "are we getting traffic?" question.
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=... node scripts/traffic-report.mjs [days]
 *
 * Requires a token with Account Analytics read access. No third-party deps.
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "de677f38b96340f3a63a53e5044a1c98";
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DAYS = Number(process.argv[2] || 7);
const SITE_HOST = process.env.SITE_HOST || "hunteralphahub.com";

if (!TOKEN) {
  console.error("CLOUDFLARE_API_TOKEN is required (Account Analytics read).");
  process.exit(1);
}

const api = (path) =>
  fetch(`https://api.cloudflare.com/client/v4${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  }).then((r) => r.json());

const gql = (query) =>
  fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((r) => r.json());

function isoDay(date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(n) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - n);
  return isoDay(date);
}

async function resolveSiteTag() {
  const zones = await api(`/zones?per_page=50`);
  const zone = (zones.result || []).find((z) => z.name === SITE_HOST);
  if (!zone) throw new Error(`Zone not found for ${SITE_HOST}`);

  const sites = await api(`/accounts/${ACCOUNT_ID}/rum/site_info/list`);
  const site = (sites.result || []).find((s) => s.ruleset?.zone_tag === zone.id);
  if (!site) throw new Error(`No Web Analytics site for zone ${zone.name}`);

  return site.site_tag;
}

function table(title, rows, formatDimension) {
  console.log(`\n== ${title}`);
  if (!rows?.length) {
    console.log("   (no data)");
    return 0;
  }
  let total = 0;
  for (const row of rows) {
    total += row.count;
    const visits = row.sum?.visits != null ? String(row.sum.visits).padStart(5) : "     ";
    console.log(`   ${String(row.count).padStart(6)} pv  ${visits} visits  ${formatDimension(row.dimensions)}`);
  }
  return total;
}

const siteTag = await resolveSiteTag();
const from = daysAgo(DAYS);
const to = isoDay(new Date());
const filter = `siteTag: "${siteTag}", date_geq: "${from}", date_leq: "${to}"`;

const result = await gql(`query {
  viewer {
    accounts(filter: {accountTag: "${ACCOUNT_ID}"}) {
      byDate: rumPageloadEventsAdaptiveGroups(limit: 100, filter: {${filter}}, orderBy: [date_ASC]) {
        count
        sum { visits }
        dimensions { date }
      }
      byPath: rumPageloadEventsAdaptiveGroups(limit: 15, filter: {${filter}}, orderBy: [count_DESC]) {
        count
        sum { visits }
        dimensions { requestPath }
      }
      byRef: rumPageloadEventsAdaptiveGroups(limit: 10, filter: {${filter}}, orderBy: [count_DESC]) {
        count
        dimensions { refererHost }
      }
      byCountry: rumPageloadEventsAdaptiveGroups(limit: 10, filter: {${filter}}, orderBy: [count_DESC]) {
        count
        dimensions { countryName }
      }
    }
  }
}`);

if (result.errors) {
  console.error(JSON.stringify(result.errors, null, 2));
  process.exit(1);
}

const data = result.data.viewer.accounts[0];
const totalPv = (data.byDate || []).reduce((sum, row) => sum + row.count, 0);
const totalVisits = (data.byDate || []).reduce((sum, row) => sum + (row.sum?.visits || 0), 0);

console.log(`Cloudflare Web Analytics — ${SITE_HOST} — last ${DAYS} days (${from} → ${to})`);
console.log(`Total: ${totalPv} page views across ${totalVisits} visits`);
console.log(
  totalVisits > 0
    ? `Average: ${(totalPv / totalVisits).toFixed(2)} pages per visit, ${(totalVisits / DAYS).toFixed(1)} visits/day`
    : "Average: no visits recorded in this window",
);

const daily = table("BY DAY", data.byDate, (d) => d.date);
table("TOP PATHS", data.byPath, (d) => d.requestPath);
table("REFERRERS", data.byRef, (d) => d.refererHost || "(direct / no referrer)");
table("COUNTRIES", data.byCountry, (d) => d.countryName);

const searchReferrers = (data.byRef || []).filter((row) =>
  /google|bing|duckduckgo|yandex|baidu|ecosia|brave/i.test(row.dimensions.refererHost || ""),
);

console.log(
  `\nSearch referrals: ${searchReferrers.reduce((s, r) => s + r.count, 0)} page views` +
    (searchReferrers.length ? "" : " — none of the top referrers are search engines"),
);
console.log(`Daily rows: ${daily}`);
