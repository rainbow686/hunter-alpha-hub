/**
 * The path a reader actually sees, from the URL Astro builds with.
 *
 * Astro's `build.format: "file"` (astro.config.mjs) emits `/typesafe-jev.html`, and
 * `Astro.url.pathname` inside a component carries that suffix. The browser never shows it —
 * the Cloudflare asset layer serves `/typesafe-jev` from that file — so anything that
 * compares a pathname to a link ends up comparing two different alphabets.
 *
 * Three places were comparing them, and two were quietly wrong:
 *
 *   - the og:image URL, which became `/og/access.html.png` (fixed 2026-09-20, and why this
 *     constant moved out of a layout-local one-liner);
 *   - the header's `aria-current`, which therefore never matched on any page whose route is
 *     a file — `/comparison.html` is not `/comparison`, so the site nav has been highlighting
 *     nothing since the Astro migration, and no guard looks at it;
 *   - the topic switcher, which vanished on exactly the two topic front pages
 *     (`/typesafe-jev.html`, `/laya.html`) and appeared on every page under them — the
 *     shape of bug that looks like a design decision.
 */
export function pagePath(url: URL): string {
  const path = url.pathname
    /* Directory indexes are the page itself, not a child of it. */
    .replace(/\/index\.html$/, "/")
    .replace(/\.html$/, "")
    .replace(/\/+$/, "");
  return path === "" ? "/" : path;
}
