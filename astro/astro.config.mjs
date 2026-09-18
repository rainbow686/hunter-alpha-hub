import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

// Static-first: every content page is prerendered and served from the assets layer.
// Only the endpoints that need to read live data (model status, subscribe) opt into
// on-demand rendering with `export const prerender = false`.
export default defineConfig({
  site: "https://www.hunteralphahub.com",
  output: "static",
  adapter: cloudflare({ imageService: "compile" }),
  // The live URLs have no trailing slash (/union-alpha, not /union-alpha/), and
  // every canonical tag says so. Astro's default directory format emits
  // union-alpha/index.html, which Cloudflare then 307s to the slashed URL —
  // a redirect on the canonical URL is exactly what the migration must not do.
  // File format emits union-alpha.html, which the assets layer serves directly.
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "auto" },
  // Shiki ships a fixed theme; a light-theme code block inside the night edition
  // (or the reverse) is exactly the mismatch the design system exists to avoid.
  // Code is plain text on --bg-sunken here, which also keeps the HTML small.
  markdown: { syntaxHighlight: false },
  /*
   * Astro blocks form POSTs whose Origin does not match the host. That default is
   * right for a site with cookie sessions, and wrong for exactly one endpoint
   * here: /unsubscribe.
   *
   * The reveal email carries RFC 8058 one-click headers, so the mailbox provider
   * POSTs `List-Unsubscribe=One-Click` to our URL from its own servers — no
   * Origin header, and nothing to protect anyway. The token in the URL is the
   * only thing that identifies a row, there is no session to ride, and the worst
   * a forged request can do is remove the subscription of the person whose email
   * already contains that token. Measured before changing it: the browser form
   * got 200, the provider's one-click POST got 403 "Cross-site POST form
   * submissions are forbidden" — one promise, two behaviours. The Next app has no
   * such check, so leaving this on would also make the two deployments differ
   * behind the same URL.
   */
  security: { checkOrigin: false },
  vite: {
    resolve: {
      // The catalogue and tracker data still live in the Next app's lib/. Importing
      // them (instead of copying) keeps one source of truth during the migration;
      // Phase 2 flips this alias to point inside astro/ once the content moves.
      alias: { "@repo": fileURLToPath(new URL("..", import.meta.url)) },
    },
  },
});
