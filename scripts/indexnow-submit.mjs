#!/usr/bin/env node
/**
 * Submits the site's sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * IndexNow needs a key file at the site root: /<key>.txt containing the key.
 * This script reads that key from public/ so there is a single source for it.
 *
 * Google is NOT covered by IndexNow — use Search Console for Google.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs            # submit every sitemap URL
 *   node scripts/indexnow-submit.mjs <url> ...  # submit specific URLs
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SITE = process.env.SITE_ORIGIN || "https://www.hunteralphahub.com";
const HOST = new URL(SITE).host;
const PUBLIC_DIR = join(process.cwd(), "public");

function readKey() {
  const candidate = readdirSync(PUBLIC_DIR).find((name) => /^[a-f0-9]{16,128}\.txt$/.test(name));
  if (!candidate) throw new Error("No IndexNow key file found in public/ (expected <hex>.txt)");
  const key = readFileSync(join(PUBLIC_DIR, candidate), "utf8").trim();
  const name = candidate.replace(/\.txt$/, "");
  if (key !== name) throw new Error(`Key file ${candidate} content does not match its filename`);
  return { key, keyLocation: `${SITE}/${candidate}` };
}

async function sitemapUrls() {
  const response = await fetch(`${SITE}/sitemap.xml`);
  if (!response.ok) throw new Error(`sitemap fetch failed: ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

const { key, keyLocation } = readKey();
const explicit = process.argv.slice(2);
const urlList = explicit.length ? explicit : await sitemapUrls();

if (!urlList.length) throw new Error("No URLs to submit");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
});

const body = await response.text();
console.log(`IndexNow: ${response.status} ${response.statusText} — submitted ${urlList.length} URLs`);
if (body) console.log(body.slice(0, 300));
console.log(`key file: ${keyLocation}`);

// 200/202 = accepted. 403 = key file missing or mismatch. 422 = malformed.
if (![200, 202].includes(response.status)) process.exit(1);
