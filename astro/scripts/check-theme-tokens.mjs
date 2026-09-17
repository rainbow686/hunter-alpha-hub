#!/usr/bin/env node
/**
 * Theme token guard for the frozen design system.
 *
 * Two jobs, both because the night palette lives in a second block:
 *   1. Drift check — the light `:root` and every dark block must declare exactly
 *      the same keys. A token added to one and forgotten in the other is the one
 *      bug class that renders as "invisible text on dark".
 *   2. Contrast audit — WCAG 2.1 AA ratios for every foreground/background pair
 *      the system actually puts on screen. Fails the build below threshold, so
 *      "it looks fine on my screen" is never the argument.
 *
 * Run: node scripts/check-theme-tokens.mjs [path-to-css]   (npm run check:theme)
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const CSS = readFileSync(process.argv[2] ?? join(here, "../src/styles/system.css"), "utf8");

/** Crude but sufficient: find `SELECTOR {` (any indent) and read to its closing brace. */
function block(selector) {
  const start = CSS.search(new RegExp(`^\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{`, "m"));
  if (start === -1) throw new Error(`block not found: ${selector}`);
  const open = CSS.indexOf("{", start);
  const close = CSS.indexOf("\n}", open);
  return CSS.slice(open + 1, close);
}

function tokens(body) {
  const out = {};
  for (const m of body.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

const light = tokens(CSS.slice(CSS.indexOf(":root {"), CSS.indexOf("\n}", CSS.indexOf(":root {"))));
const darkAuto = tokens(block(':root:not([data-theme="light"])'));
const darkForced = tokens(block(':root[data-theme="dark"]'));

/* --- 1. drift check ------------------------------------------------------ */
const lightKeys = Object.keys(light).filter((k) => k.startsWith("--") && !k.startsWith("--serif") && !k.startsWith("--text-4xl"));
const problems = [];
for (const [k, v] of Object.entries(darkAuto)) if (!(k in light)) problems.push(`dark declares ${k}=${v} but light does not`);
for (const k of lightKeys) if (!(k in darkAuto)) problems.push(`light declares ${k} but dark does not`);
for (const k of Object.keys(darkAuto)) if (darkAuto[k] !== darkForced[k]) problems.push(`dark blocks diverge on ${k}: auto=${darkAuto[k]} forced=${darkForced[k]}`);
for (const k of Object.keys(darkForced)) if (!(k in darkAuto)) problems.push(`forced-only dark token ${k}`);

/* --- 2. contrast audit --------------------------------------------------- */
const hex = (s) => {
  const m = /^#([0-9a-f]{6})$/i.exec(s.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rel = (c) => {
  const [r, g, b] = c.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [rel(a), rel(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/* fg, bg, minimum (null = report only, no pass/fail), where it appears.
   Rules are decorative hairlines, so they are reported rather than enforced —
   WCAG 1.4.11 covers UI components and meaningful graphics, not table rules.
   When a real form lands, add its input border as an enforced 3.0 pair. */
const PAIRS = [
  ["--text", "--bg", 4.5, "body copy on page"],
  ["--text", "--surface", 4.5, "card headings"],
  ["--text", "--bg-sunken", 4.5, "band / table header"],
  ["--text-muted", "--bg", 4.5, "lede, secondary copy"],
  ["--text-muted", "--surface", 4.5, "footer text, table vendor"],
  ["--text-muted", "--bg-sunken", 4.5, "table head labels"],
  ["--text-faint", "--bg", 4.5, "kicker, provenance (12px)"],
  ["--text-faint", "--surface", 4.5, "footer meta"],
  ["--text-faint", "--bg-sunken", 4.5, "stat labels"],
  ["--accent", "--bg", 4.5, "links in body copy"],
  ["--accent", "--surface", 4.5, "links in cards"],
  ["--accent", "--accent-soft", 4.5, "link on hover row"],
  ["--text", "--accent-soft", 4.5, "row hover under body text"],
  ["--on-accent", "--accent", 4.5, "primary button label"],
  ["--success", "--success-soft", 4.5, "live badge / free price"],
  ["--success", "--surface", 4.5, "free cell in table"],
  ["--warn", "--warn-soft", 4.5, "claimed badge"],
  ["--danger", "--danger-soft", 4.5, "gone/expired badge"],
  ["--field-border", "--bg", 3.0, "email field boundary (UI component)"],
  ["--field-border", "--surface", 3.0, "email field boundary inside a card"],
  ["--text", "--field-bg", 4.5, "text typed into the field"],
  ["--text-faint", "--field-bg", 4.5, "placeholder text"],
  ["--border-strong", "--bg", null, "rule weight — decorative"],
  ["--border", "--surface", null, "card edge — decorative"],
  ["--bg-sunken", "--bg", null, "band fill off the page"],
  ["--row-alt", "--bg", null, "zebra row separation (must survive at night)"],
  ["--header-fill", "--bg", null, "table header band"],
  ["--surface", "--bg", null, "card lift off the page"],
  ["--text", "--text-muted", null, "hierarchy step: body vs secondary"],
  ["--text-muted", "--text-faint", null, "hierarchy step: secondary vs faint"],
];

function audit(name, t) {
  const rows = [];
  for (const [fg, bg, min, where] of PAIRS) {
    const a = hex(t[fg] ?? "");
    const b = hex(t[bg] ?? "");
    if (!a || !b) {
      problems.push(`${name}: cannot parse ${fg}=${t[fg]} or ${bg}=${t[bg]}`);
      continue;
    }
    const r = ratio(a, b);
    rows.push({ fg, bg, r, min, where, ok: min == null || r >= min, info: min == null });
  }
  console.log(`\n== ${name}`);
  for (const row of rows) {
    const flag = row.info ? "info" : row.ok ? "ok" : "FAIL";
    console.log(
      `  ${flag.padEnd(4)} ${row.r.toFixed(2).padStart(5)}:1  ${(row.min == null ? "--" : `min ${row.min}`).padEnd(8)}  ${row.fg} on ${row.bg}  — ${row.where}`,
    );
  }
  const fails = rows.filter((r) => !r.ok && !r.info);
  for (const f of fails) problems.push(`${name}: ${f.fg} on ${f.bg} = ${f.r.toFixed(2)}:1 < ${f.min} (${f.where})`);
  return rows;
}

audit("light", light);
audit("dark (auto + forced)", { ...light, ...darkAuto });

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("\nTheme tokens OK: keys aligned across light/dark, all contrast pairs pass AA.");
