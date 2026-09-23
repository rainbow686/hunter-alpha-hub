#!/usr/bin/env node
/**
 * Build the ⌘K index from the finished build.
 *
 * Why a script and not `npx pagefind --site dist`: Pagefind computes a result URL
 * from the file it found, and this site is built with `build.format: "file"`, so
 * every page is `/about.html` on disk and `/about` in every link, canonical tag and
 * sitemap entry. Indexing the directory as-is would hand the reader
 * `https://www.hunteralphahub.com/about.html` — a URL that works, is not canonical,
 * and would be the first thing a search result told Google about. Adding the files
 * one at a time with an explicit `url` removes the guesswork.
 *
 * The same pass is the guard the search UI needs anyway: a page is searchable only
 * if it marks its content with `data-pagefind-body`, and a page that forgets the
 * marker fails the build here instead of quietly missing from every search. That is
 * the same failure mode as the empty facet pages (docs/lessons/), one layer up.
 */
import { readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import * as pagefind from "pagefind";

const DIST = "dist";
const OUTPUT = join(DIST, "pagefind");

/**
 * Pages that are deliberately not in the index, with the reason.
 *
 * The 404 page is a title, an apology and a search box — indexing it would put a
 * dead end in the results of the one control a reader reaches for after a bad link.
 */
const EXCLUDED = new Map([["/404", "the 404 page is a dead end, not a document"]]);

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "pagefind") continue;
      out.push(...htmlFiles(full));
    } else if (entry.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

/** `/blog/foo.html` on disk is `/blog/foo` on the wire; `/index.html` is `/`. */
function servedPath(file) {
  const parts = relative(DIST, file).split(sep);
  if (parts[parts.length - 1] === "index.html") parts.pop();
  else parts[parts.length - 1] = parts[parts.length - 1].replace(/\.html$/, "");
  return `/${parts.join("/")}`.replace(/\/$/, "") || "/";
}

const pages = [];
const unmarked = [];
for (const file of htmlFiles(DIST).sort()) {
  const url = servedPath(file);
  if (EXCLUDED.has(url)) continue;
  const content = readFileSync(file, "utf8");
  if (!/data-pagefind-body/.test(content)) {
    unmarked.push(file);
    continue;
  }
  pages.push({ url, content });
}

if (unmarked.length) {
  console.error("These pages carry no data-pagefind-body, so search would skip them:");
  for (const file of unmarked) console.error(`  ${file}`);
  console.error("Add the attribute to the layout's main region, or list the page in EXCLUDED.");
  process.exit(1);
}

rmSync(OUTPUT, { recursive: true, force: true });

const { index, errors } = await pagefind.createIndex();
if (!index) {
  console.error("pagefind could not start:", errors);
  process.exit(1);
}

let indexed = 0;
let words = 0;
for (const { url, content } of pages) {
  const { file, errors: fileErrors } = await index.addHTMLFile({ url, content });
  if (fileErrors?.length) {
    console.error(`  ${url}: ${fileErrors.join(", ")}`);
    process.exit(1);
  }
  indexed += 1;
  words += file.uniqueWords ?? 0;
}

await index.writeFiles({ outputPath: OUTPUT });
await pagefind.close();

console.log(
  `search index: ${indexed} pages (${words.toLocaleString("en-US")} unique words) -> ${OUTPUT}/`,
);
