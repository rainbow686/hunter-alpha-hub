#!/usr/bin/env node
/**
 * Per-page Open Graph cards, rendered from the pages themselves.
 *
 * Why this exists: the live site serves a **generated** card per model page and
 * for /ox-alpha (`/<page>/opengraph-image`, via next/og). The Astro rewrite had
 * only one site-wide `/og-image.png`, so every share of a page looked identical —
 * the one migration difference `check:page-parity` could not compare, because the
 * live URLs are not reproducible in a static build.
 *
 * How: run **after** `astro build`, walk the built HTML, and draw one 1200×630
 * card per page from that page's own `<title>` and description. Deriving the card
 * from the HTML (instead of a second content list) is the point — there is no
 * second source to drift, and every page gets a card without touching any page.
 *
 * The card is drawn in the frozen paper palette (system.css), so a link preview
 * looks like the site rather than like the old dark UI.
 *
 * Guard: `npm run check:parity` asserts that every declared og:image on our own
 * host exists in dist and is a real PNG — a card URL that points at nothing is
 * worse than no card.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(here, "../dist");
const OUT = join(DIST, "og");

if (!existsSync(DIST)) {
  console.error("FAIL: dist/ is missing — run `astro build` first (this runs after it)");
  process.exit(1);
}

// ── paper palette, copied from src/styles/system.css ────────────────────────
const PAPER = "#faf6f0";
const WASH = "#fdf8f0";
const SURFACE = "#fffcf6";
const BORDER = "#e6ddcd";
const BORDER_STRONG = "#d5c9b4";
const INK = "#1c1a16";
const MUTED = "#5f5849";
const FAINT = "#6f6859";
const ACCENT = "#14507d";
const SERIF = "Noto Serif, Iowan Old Style, Georgia, DejaVu Serif, 'Times New Roman', serif";
const SANS = "Noto Sans, DejaVu Sans, Liberation Sans, Arial, sans-serif";
const MONO = "DejaVu Sans Mono, Menlo, Consolas, monospace";

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** `<title>` and stat values come out of the HTML already escaped — undo that once. */
const decodeEntities = (value) =>
  String(value)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

/** The live site's title suffix, so the card says the page's name, not the site's. */
const stripSuffix = (title) => title.replace(/\s*\|\s*OpenRouter Model Hub\s*$/, "").trim();

const KICKERS = [
  [/^\/blog\//, "Article"],
  [/^\/compare\//, "Model comparison"],
  [/^\/openrouter-models\//, "Model reference"],
  [/^\/union-alpha/, "Stealth line · live tracker"],
  [/^\/stealth-models/, "Stealth line · register"],
  [/^\/alpha-models/, "Stealth line · explainer"],
  [/^\/ox-alpha/, "Archive · revealed"],
  [/^\/hunter-alpha/, "Archive · revealed"],
  [/^\/openrouter-pricing-calculator/, "Tool · cost estimate"],
  [/^\/openrouter-free-models/, "Reference · free routes"],
  [/^\/comparison/, "Reference · comparison"],
  [/^\/openrouter-models$/, "Reference · index"],
  [/^\/best-openrouter-models/, "Reference · picks"],
  [/^\/access|^\/zh\/access/, "Guide"],
  [/^\/faq|^\/zh\/faq/, "FAQ"],
];
const kickerFor = (path) => KICKERS.find(([re]) => re.test(path))?.[1] ?? "OpenRouter Model Hub";

/**
 * Width in "Latin character" units. CJK glyphs are full-width, so counting them
 * as one made every Chinese title run off the right edge of the card.
 */
const width = (value) => [...String(value)].reduce((total, char) => total + (/[\u2e80-\uffff]/.test(char) ? 2 : 1), 0);

/** Greedy wrap by weighted width; SVG has no auto-wrap of its own. */
function wrap(text, perLine) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (width(candidate) > perLine && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** The page's own stat cards (context window, prices, listed date…) as one mono line. */
function factsFrom(html) {
  const pairs = [];
  for (const match of html.matchAll(
    /<div class="stat"[^>]*>\s*<div class="label"[^>]*>(.*?)<\/div>\s*<div class="value"[^>]*>(.*?)<\/div>/gs,
  )) {
    const strip = (value) => decodeEntities(value.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
    const label = strip(match[1]);
    const value = strip(match[2]);
    if (label && value && value.length <= 24) pairs.push(`${label} ${value}`);
    if (pairs.length === 3) break;
  }
  return pairs.join("   ·   ");
}

function card({ title, description, kicker, facts }) {
  // Title size steps down as the headline gets longer, so card text never collides
  // with the description block.
  const titleWidth = width(title);
  const size = titleWidth <= 30 ? 68 : titleWidth <= 52 ? 58 : titleWidth <= 78 ? 48 : 40;
  const perLine = Math.floor((1104 - 96) / (size * 0.5));
  const titleLines = wrap(title, perLine).slice(0, 3);
  const titleSvg = titleLines
    .map((line, index) => `<text x="96" y="${232 + index * (size + 8)}" class="title">${escapeXml(line)}</text>`)
    .join("");
  const afterTitle = 232 + (titleLines.length - 1) * (size + 8);
  const wrapped = wrap(description || "", 78);
  const descLines = wrapped.slice(0, 3);
  // The ellipsis belongs to the text node it truncates — appending it after the
  // closing tag (the first attempt) rendered a stray glyph nobody could remove.
  const truncated = wrapped.length > descLines.length;
  const descSvg = descLines
    .map(
      (line, index) =>
        `<text x="96" y="${afterTitle + 64 + index * 35}" class="desc">${escapeXml(line)}${
          truncated && index === descLines.length - 1 ? "…" : ""
        }</text>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${WASH}" />
      <stop offset="100%" stop-color="${PAPER}" />
    </linearGradient>
    <style>
      .title { font-family: ${SERIF}; font-size: ${size}px; font-weight: 600; fill: ${INK}; letter-spacing: -0.5px; }
      .desc  { font-family: ${SANS}; font-size: 25px; fill: ${MUTED}; }
      .kicker{ font-family: ${SANS}; font-size: 17px; letter-spacing: 3.4px; text-transform: uppercase; fill: ${ACCENT}; }
      .mark  { font-family: ${SERIF}; font-size: 27px; font-weight: 600; fill: ${INK}; }
      .foot  { font-family: ${MONO}; font-size: 17px; fill: ${FAINT}; }
      .facts { font-family: ${MONO}; font-size: 19px; fill: ${ACCENT}; }
    </style>
  </defs>
  <rect width="1200" height="630" fill="url(#wash)" />
  <rect x="34" y="34" width="1132" height="562" rx="10" fill="${SURFACE}" stroke="${BORDER}" />
  <line x1="96" y1="140" x2="1104" y2="140" stroke="${BORDER}" />
  <line x1="96" y1="500" x2="1104" y2="500" stroke="${BORDER}" />
  <circle cx="101" cy="97" r="6" fill="${ACCENT}" />
  <text x="122" y="104" class="mark">HunterAlphaHub</text>
  <text x="1104" y="101" class="kicker" text-anchor="end">${escapeXml(kicker)}</text>
  ${titleSvg}
  ${descSvg}
  ${facts ? `<text x="96" y="462" class="facts">${escapeXml(facts)}</text>` : ""}
  <text x="96" y="548" class="foot">hunteralphahub.com</text>
  <text x="1104" y="548" class="foot" text-anchor="end">Independent reference · facts dated, claims labelled</text>
</svg>`;
}

function htmlFiles(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "og") continue;
      htmlFiles(path, found);
    } else if (entry.name.endsWith(".html")) {
      found.push(path);
    }
  }
  return found;
}

const pages = htmlFiles(DIST).filter((file) => !/\/404\.html$/.test(file));
let written = 0;
let bytes = 0;

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const rawTitle = decodeEntities(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  const path = canonical ? new URL(canonical).pathname.replace(/\/$/, "") || "/" : `/${relative(DIST, file).replace(/index\.html$/, "").replace(/\.html$/, "")}`;

  // Only the site's own pages get a card; anything without a canonical (a stray
  // preview file) is skipped rather than given a card nobody links to.
  if (!canonical) continue;

  const svg = card({
    title: stripSuffix(rawTitle) || "OpenRouter Model Hub",
    description: decodeEntities(description),
    kicker: kickerFor(path === "/" ? "/" : path),
    facts: factsFrom(html),
  });

  const target = join(OUT, path === "/" ? "home.png" : `${path.replace(/^\//, "")}.png`);
  mkdirSync(dirname(target), { recursive: true });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: false }).toFile(target);
  written++;
  bytes += statSync(target).size;
}

writeFileSync(
  join(OUT, "README.txt"),
  [
    "Generated by scripts/generate-og-images.mjs — do not edit, do not commit.",
    `cards: ${written}, total: ${(bytes / 1024 / 1024).toFixed(2)} MiB`,
    "",
  ].join("\n"),
);

console.log(`og cards: wrote ${written} PNGs (${(bytes / 1024 / 1024).toFixed(2)} MiB) to dist/og/`);
