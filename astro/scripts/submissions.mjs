#!/usr/bin/env node
/**
 * submissions.mjs — the operator's side of /submit.
 *
 * Why this exists at all, and why the endpoint does not just write into the
 * candidate queues: `check:intake` requires every queue row to carry a `url`,
 * an `author` and a `publishedAt`, and a link somebody pasted has none of the
 * last two. Writing raw submissions into `lib/data/jev-*.json` would either fail
 * that guard or force it to be weakened — and the guard is the thing that keeps a
 * column from becoming a link dump.
 *
 * So the two sides are deliberately different shapes:
 *
 *   D1 `submissions`  = the door. What arrived, from whom, in what order, with no
 *                       claim about the world. Cheap to write, one row per link.
 *   the JSON queues   = the desk. Rows that have been enriched (author, date,
 *                       metrics from the platform's API) and read by a person.
 *
 * This script is the hand that moves things from the door to the desk, and it only
 * moves what it can move honestly:
 *
 *   list   what is waiting, grouped by platform
 *   seed   append seedable rows to their source's URL list and mark them pulled
 *   mark   mark rows handled without seeding (when they went in another way)
 *
 * X is the only seedable source today: `ingest-x.mjs` reads URLs rather than
 * search terms, because there is no affordable read API to query. GitHub, YouTube,
 * Hacker News and dev.to are searched by their ingest scripts instead, so a
 * submitted link from those waits for a query that matches it — or for a row
 * written by hand, which is the same work either way and is not automated here on
 * purpose.
 *
 * Usage:
 *   node scripts/submissions.mjs list [--all]
 *   node scripts/submissions.mjs seed [--dry]
 *   node scripts/submissions.mjs mark 12 13 14
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const TABLE = JSON.parse(readFileSync(resolve(ROOT, "lib/data/submission-sources.json"), "utf8"));
const SOURCES = new Map(TABLE.sources.map((s) => [s.source, s]));
const DB = "hunter-alpha-hub-subscribers";
const ACCOUNT = "de677f38b96340f3a63a53e5044a1c98";

const args = process.argv.slice(2);
const command = args[0] ?? "list";
const flag = (name) => args.includes(`--${name}`);
const positional = args.slice(1).filter((a) => !a.startsWith("--"));

/** D1 through the wrangler CLI — the same route `npm run db:migrate` takes. */
function sql(statement) {
  const out = execFileSync(
    "npx",
    ["wrangler", "d1", "execute", DB, "--remote", "--json",
     "--config", resolve(import.meta.dirname, "../wrangler.production.jsonc"),
     "--command", statement],
    { cwd: resolve(import.meta.dirname, ".."), env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT }, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
  const start = out.indexOf("[");
  return JSON.parse(out.slice(start))[0].results ?? [];
}

const label = (source) => SOURCES.get(source)?.label ?? source;

function list({ all }) {
  const where = all ? "" : "WHERE pulled_at IS NULL";
  const rows = sql(
    `SELECT id, topic, source, url, name, email, summary, created_at, pulled_at FROM submissions ${where} ORDER BY id`,
  );
  if (!rows.length) {
    console.log(all ? "submissions: none at all" : "submissions: nothing waiting — all pulled");
    return;
  }
  const bySource = new Map();
  for (const row of rows) bySource.set(row.source, [...(bySource.get(row.source) ?? []), row]);
  console.log(`${rows.length} waiting${all ? " (including pulled)" : ""}\n`);
  for (const [source, list] of [...bySource.entries()].sort((a, b) => b[1].length - a[1].length)) {
    const meta = SOURCES.get(source);
    console.log(`${label(source)} — ${list.length}`);
    console.log(`  ${meta?.seed ? `seedable → ${meta.seed}` : meta?.column ? `no seed; ingest searches for it, or write the row by hand` : "no column: a person reads these"}`);
    for (const row of list) {
      const who = row.name ? `${row.name} <${row.email}>` : row.email;
      console.log(`  #${row.id} ${row.url}`);
      console.log(`      ${row.topic} · ${row.created_at} · from ${who}${row.pulled_at ? " · pulled" : ""}`);
      if (row.summary) console.log(`      "${row.summary.slice(0, 110)}"`);
    }
    console.log();
  }
}

function seed({ dry }) {
  const rows = sql("SELECT id, source, url FROM submissions WHERE pulled_at IS NULL ORDER BY id");
  if (!rows.length) return console.log("nothing waiting");
  const grouped = new Map();
  for (const row of rows) grouped.set(row.source, [...(grouped.get(row.source) ?? []), row]);

  const moved = [];
  const untouched = [];
  for (const [source, list] of grouped) {
    const meta = SOURCES.get(source);
    if (!meta?.seed) {
      untouched.push([source, list.length, meta?.column ? "no seed list — ingest searches, or write the row by hand" : "no column — a person reads these"]);
      continue;
    }
    const file = resolve(ROOT, meta.seed);
    const doc = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : { note: "", sources: [] };
    const known = new Set((doc.sources ?? []).map((s) => s.url));
    const add = list.filter((row) => !known.has(row.url));
    if (!dry) {
      doc.sources = [...(doc.sources ?? []), ...add.map((row) => ({ url: row.url }))];
      writeFileSync(file, JSON.stringify(doc, null, 2) + "\n");
    }
    moved.push([source, add.length, list.length - add.length, meta.seed]);
    if (!dry && list.length) {
      sql(`UPDATE submissions SET pulled_at = datetime('now') WHERE id IN (${list.map((r) => r.id).join(",")})`);
    }
  }

  console.log(`${dry ? "[dry] " : ""}seeded:`);
  for (const [source, added, already, file] of moved) {
    console.log(`  ${label(source)}: +${added} into ${file}${already ? ` (${already} already there)` : ""}`);
    if (added) console.log(`     now run: node scripts/ingest-${source === "x" ? "x" : source}.mjs`);
  }
  if (untouched.length) {
    console.log(`\nleft in the queue:`);
    for (const [source, n, why] of untouched) console.log(`  ${label(source)} (${n}): ${why}`);
  }
}

function mark(ids) {
  if (!ids.length) return console.error("mark needs at least one id");
  sql(`UPDATE submissions SET pulled_at = datetime('now') WHERE id IN (${ids.join(",")})`);
  console.log(`marked ${ids.length} row(s) pulled`);
}

if (command === "list") list({ all: flag("all") });
else if (command === "seed") seed({ dry: flag("dry") });
else if (command === "mark") mark(positional.map(Number).filter(Number.isFinite));
else {
  console.error(`unknown command "${command}". Try: list | seed | mark`);
  process.exit(1);
}
