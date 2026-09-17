/**
 * GA4 event layer — the Astro side of `lib/gtag.ts`.
 *
 * The Next app already had this layer, verified in production with real
 * browser payload captures. Phase 4 replaces the Next app, so if the cutover
 * shipped without this file the site would keep serving pages while GA4 went
 * dark — a silent, expensive loss: it is the only way to see traffic while the
 * search data is still too thin to read (GSC shows 10 of 49 routes indexed).
 *
 * ── Event map (single source of truth; add here before firing anywhere) ─────
 *   page_view                  every page load — GA4's own config hit, one per load
 *   stealth_view               a page about one stealth model was opened
 *   stealth_line_view          a page about the line itself was opened
 *   stealth_status             the live status endpoint resolved, with its answer
 *   cluster_click              a click between pages of the stealth cluster
 *   subscribe_submit           an email was submitted to /api/subscribe
 *   subscribe_result           what the endpoint answered (ok / duplicate / error)
 *   ox_alpha_subscribe         legacy alias fired on success, kept for continuity
 *   outbound_openrouter_click  any click that leaves for openrouter.ai
 *
 * Names match `lib/gtag.ts` exactly and on purpose: the two apps must be
 * comparable in GA4 across the cutover, so a renamed event would look like a
 * traffic change. Do not invent a second name for something already on this list.
 */

/**
 * The measurement ID is public — it ships in the HTML of every page. It is
 * hardcoded as the default instead of left to an env var alone because a missing
 * probe fails silently: pages keep rendering and the traffic dashboard just goes
 * quiet. `PUBLIC_GA_ID` can still override it at build time.
 */
export const GA_MEASUREMENT_ID =
  ((import.meta.env.PUBLIC_GA_ID as string | undefined) ?? "").trim() || "G-4ZEGQ7J3TY";

export type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Safe to call before GA has loaded: falls back to the dataLayer queue. */
export function gtagEvent(eventName: string, params?: GtagParams) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...params });
  }
}

/** A stealth model's own page: the reader's intent groups the codename cluster. */
export function stealthViewFor(pathname: string): { model_id: string; page_group: string } | null {
  const path = pathname.replace(/\/$/, "");
  const modelPage = /^\/union-alpha(?:-|$)/.test(path);
  if (!modelPage) return null;
  const page_group =
    path === "/union-alpha"
      ? "tracker"
      : path.endsWith("-free")
        ? "pricing"
        : path.endsWith("-opencode")
          ? "opencode"
          : path.endsWith("-not-working")
            ? "troubleshooting"
            : "cluster_other";
  return { model_id: "stealth/union-alpha", page_group };
}

/** A page about the Alpha line as a whole (register, explainer, archive). */
export function stealthLineViewFor(pathname: string): { page_group: string } | null {
  const path = pathname.replace(/\/$/, "");
  const page_group =
    path === "/stealth-models"
      ? "index"
      : path === "/alpha-models"
        ? "explainer"
        : path === "/hunter-alpha"
          ? "archive_hunter"
          : path === "/ox-alpha"
            ? "archive_ox"
            : path === "/hunter-alpha-benchmarks"
              ? "benchmarks"
              : null;
  return page_group ? { page_group } : null;
}

/** Internal movement inside the stealth cluster — the one funnel worth watching here. */
export function isClusterPath(pathname: string): boolean {
  return (
    /^\/(union-alpha|stealth-models|alpha-models|hunter-alpha|ox-alpha|hunter-alpha-benchmarks)(-|$|\/)/.test(
      pathname,
    ) || pathname === "/union-alpha"
  );
}
