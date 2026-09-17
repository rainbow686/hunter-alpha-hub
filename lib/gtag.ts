/**
 * GA4 event layer for Hunter Alpha Hub.
 *
 * All helpers are no-ops when GA is not loaded (safe for local/dev without NEXT_PUBLIC_GA_ID)
 *
 * ── Event map (single source of truth; add here before firing anywhere) ─────
 *   page_view                  every navigation — components/analytics.tsx
 *   stealth_view               a page about one stealth model was opened
 *   stealth_line_view          a page about the line itself was opened
 *   stealth_status             the live status endpoint resolved, with its answer
 *   cluster_click              a click between pages of the stealth cluster
 *   subscribe_submit           an email was submitted to /api/subscribe
 *   subscribe_result           what the endpoint answered (ok / duplicate / error)
 *   ox_alpha_subscribe         legacy alias fired on success, kept for continuity
 *   outbound_openrouter_click  any click that leaves for openrouter.ai
 *
 * Naming rules: snake_case names and params; every event carries page_path so a
 * funnel can be rebuilt per page. Do not invent a second name for something
 * already on this list — a duplicated event is worse than no event.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

type GtagParams = Record<string, string | number | boolean | undefined>;

/**
 * Low-level GA4 event sender. Safe to call even when gtag is not loaded.
 */
export function gtagEvent(eventName: string, params?: GtagParams) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  } else if (Array.isArray(window.dataLayer)) {
    // Fallback: push to dataLayer if gtag not yet initialized (GTM-style)
    window.dataLayer.push({ event: eventName, ...params });
  }
  // Debug visibility in dev
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(`[GA4] ${eventName}`, params);
  }
}

/**
 * ox_alpha_subscribe — fires when user subscribes via any form.
 * GA4 recommended: keep value/currency optional; add method for funnel analysis.
 * Triggered in SubscriptionForm after successful POST /api/subscribe.
 */
export function trackOxAlphaSubscribe(opts?: {
  method?: string;        // e.g. "home_form" | "ox_alpha_page" | "footer"
  page_location?: string; // window.location.href
  page_path?: string;     // window.location.pathname
}) {
  gtagEvent("ox_alpha_subscribe", {
    method: opts?.method ?? "form",
    page_location: opts?.page_location ?? (typeof window !== "undefined" ? window.location.href : undefined),
    page_path: opts?.page_path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
  });
}

/**
 * ox_alpha_view — fires on OX-Alpha page view (or teaser impression).
 * Call once per page view in /ox-alpha layout/client effect.
 */
export function trackOutboundOpenRouterClick(opts: {
  model_id?: string;
  target_url: string;
  location: string;
}) {
  gtagEvent("outbound_openrouter_click", {
    model_id: opts.model_id,
    link_url: opts.target_url,
    location: opts.location,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}

/**
 * Helper to fire page_view for SPA navigations if needed.
 * GA4 automatically tracks page_view on gtag config, but this allows custom titles.
 */
export function trackPageView(url: string, title?: string) {
  gtagEvent("page_view", {
    page_location: url,
    page_title: title,
  });
}

/**
 * stealth_view — one stealth model's page was opened.
 * `page_group` is the reader's intent, not the URL: somebody on the free-window
 * page is asking a different question than somebody on the tracker.
 */
export function trackStealthView(opts: { model_id: string; page_group: string }) {
  gtagEvent("stealth_view", {
    model_id: opts.model_id,
    page_group: opts.page_group,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}

/** stealth_line_view — a page about the Alpha line as a whole (index, explainer, archive). */
export function trackStealthLineView(opts: { page_group: string }) {
  gtagEvent("stealth_line_view", {
    page_group: opts.page_group,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}

/**
 * stealth_status — the live endpoint answered, and what it said.
 * This is the metric that dates the end of the window: the day `delisted`
 * becomes the common value, the codename is historical.
 */
export function trackStealthStatus(opts: {
  model_id: string;
  online: boolean | null;
  free?: boolean;
  context_window?: number | null;
  latency_ms?: number;
  error?: string;
}) {
  gtagEvent("stealth_status", {
    model_id: opts.model_id,
    online: opts.online === null ? "unknown" : opts.online ? "live" : "delisted",
    free: opts.free === undefined ? undefined : opts.free ? "yes" : "no",
    context_window: opts.context_window ?? undefined,
    latency_ms: opts.latency_ms,
    error_type: opts.error,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}

/** cluster_click — movement inside the stealth cluster (fired from analytics.tsx). */
export function trackClusterClick(opts: { to_path: string; from_path?: string; link_text?: string }) {
  gtagEvent("cluster_click", {
    to_path: opts.to_path,
    from_path: opts.from_path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
    link_text: opts.link_text,
  });
}

/** subscribe_submit / subscribe_result — the only conversion on this site. */
export function trackSubscribeSubmit(opts?: { page_path?: string }) {
  gtagEvent("subscribe_submit", {
    page_path: opts?.page_path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
  });
}

export function trackSubscribeResult(opts: { result: "ok" | "duplicate" | "error"; http_status?: number }) {
  gtagEvent("subscribe_result", {
    result: opts.result,
    http_status: opts.http_status,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}
