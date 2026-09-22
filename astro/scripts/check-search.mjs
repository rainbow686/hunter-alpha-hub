#!/usr/bin/env node
/**
 * Guards for the ⌘K index.
 *
 * The index is the one feature on this site whose failure is invisible: a page that
 * drops out of search still renders, still passes the parity check, and still gets
 * indexed by Google — it just stops being findable from inside the site. So the
 * checks here are about *counts and wiring*, not about the index existing:
 *
 *   - every page that should be searchable is in the index (counted against the
 *     HTML on disk, so a new page cannot be added and silently left out);
 *   - the trigger and the dialog are both present in the built HTML;
 *   - `pagefind.js` is never referenced from the markup, i.e. search is still lazy
 *     and a reader who never opens the dialog pays nothing for it.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const failures = [];
const DIST = "dist";
const INDEX = join(DIST, "pagefind");

function read(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
}

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

const bundle = read(join(INDEX, "pagefind.js"));
if (!bundle) failures.push("dist/pagefind/pagefind.js is missing — the index was not built");
else if (bundle.length < 1000) failures.push(`dist/pagefind/pagefind.js is ${bundle.length} bytes`);

const entry = read(join(INDEX, "pagefind-entry.json"));
let indexed = 0;
if (!entry) {
  failures.push("dist/pagefind/pagefind-entry.json is missing");
} else {
  try {
    const parsed = JSON.parse(entry);
    indexed = Object.values(parsed.languages ?? {}).reduce((sum, l) => sum + (l.page_count ?? 0), 0);
    if (!Object.keys(parsed.languages ?? {}).length) failures.push("the index reports no languages");
  } catch (error) {
    failures.push(`pagefind-entry.json does not parse: ${error.message}`);
  }
}

/*
 * `/404` is the one page we exclude on purpose (scripts/build-search-index.mjs).
 * Everything else on disk must be counted in the index — a mismatch means a page
 * lost its `data-pagefind-body` marker, or the index is stale relative to the build.
 */
const pages = htmlFiles(DIST);
const excluded = 1;
const expected = pages.length - excluded;
if (indexed && indexed !== expected) {
  failures.push(`the index holds ${indexed} pages but ${expected} were built (${pages.length} on disk, minus /404)`);
}

const home = read(join(DIST, "index.html")) ?? "";
if (!/data-search-open/.test(home)) failures.push("the built pages have no search trigger");
if (!/id="site-search"/.test(home)) failures.push("the built pages have no search dialog");
/*
 * The client resolves the index with a runtime `new URL("/pagefind/pagefind.js")`
 * inside the bundled script, so the string is expected in the HTML and is not the
 * signal. What must never appear is a load the browser performs on page load: a
 * script tag or a static import. Either one would pull ~90 KB of JS and wasm for
 * every reader, including the ones who never search.
 */
if (/<script[^>]+src="[^"]*\/pagefind\//.test(home) || /(?:^|[\s;"'])import\s*\(\s*["']\/pagefind\//.test(home)) {
  failures.push("a page loads pagefind at parse time — search must load the index only when opened");
}

const missingMarker = pages.filter((file) => {
  const html = readFileSync(file, "utf8");
  return !/data-pagefind-body/.test(html) && !file.endsWith("404.html");
});
for (const file of missingMarker) failures.push(`${file} has no data-pagefind-body`); 

if (failures.length) {
  console.error("search index checks failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`  ok   search index — ${indexed} pages, trigger and dialog wired, still lazy`);
