/**
 * Apex → www, as its own Worker.
 *
 * Why a separate Worker instead of code in the Astro one: Workers Assets serve
 * static files *before* the Worker script runs, so the Astro Worker never sees an
 * apex request and cannot redirect it. The obvious fix — `assets.run_worker_first:
 * true` — was measured on 2026-09-18 and it costs more than it buys: with it on,
 * `/faq/` and `/evidence` stopped redirecting (200 instead of 308/301), because
 * the asset layer only applies `_redirects` when it handles the request itself.
 * That is 92 generated rules — 84 trailing-slash 308s and 6 retired-route 301s —
 * traded for one redirect.
 *
 * Binding a Worker to a *hostname* sidesteps the conflict: `hunteralphahub.com`
 * gets this small Worker (it has no assets and nothing to serve), and
 * `www.hunteralphahub.com` keeps the Astro Worker on the proven asset-first path.
 *
 * The alternative was a zone-level Cloudflare Redirect Rule. It works, but it
 * needs dashboard access this repo does not have, and it would live outside
 * version control.
 *
 * Deploy: `npm run deploy:apex`. Rollback: remove the custom domain, which
 * re-exposes whatever held it before.
 */

const APEX_HOST = "hunteralphahub.com";
const CANONICAL_HOST = "www.hunteralphahub.com";

export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    /*
     * Host *header*, not url.hostname: with a `routes` entry in the Wrangler
     * config, `wrangler dev` rewrites the request URL's host, so a local smoke
     * test against url.hostname answers every request as the apex. The header is
     * what the client actually asked for.
     */
    const host = (request.headers.get("host") ?? url.hostname).split(":")[0].toLowerCase();

    if (host !== APEX_HOST) {
      // Should be unreachable — this Worker is bound to the apex only. Answering
      // 404 keeps a mis-binding loud instead of silently redirecting traffic.
      return new Response("This Worker only serves the apex redirect.\n", { status: 404 });
    }

    return new Response(null, {
      status: 308,
      headers: {
        Location: `https://${CANONICAL_HOST}${url.pathname}${url.search}`,
        // Safe to cache: the mapping is permanent and path-independent.
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
