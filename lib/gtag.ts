/**
 * GA4 event helpers for Hunter Alpha Hub
 * Covers RAINBOW686-12: ox_alpha_subscribe / tracker_click / ox_alpha_view
 *
 * Usage: import { trackOxAlphaSubscribe, trackTrackerClick, trackOxAlphaView, gtagEvent } from "@/lib/gtag"
 * All helpers are no-ops when GA is not loaded (safe for local/dev without NEXT_PUBLIC_GA_ID)
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
 * tracker_click — fires when user clicks a "Mystery Tracker" entry point.
 * Use for hero CTAs, monitor links, comparison cards, OX-Alpha teaser cards.
 */
export function trackTrackerClick(opts: {
  tracker_id: string;      // e.g. "ox_alpha_card" | "hunter_alpha_card" | "mystery_tracker_nav"
  target_url?: string;
  location?: string;       // page_path or component name, e.g. "home_hero" | "monitor_page"
}) {
  gtagEvent("tracker_click", {
    tracker_id: opts.tracker_id,
    link_url: opts.target_url,
    location: opts.location,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
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

export function trackOxAlphaView(opts?: {
  source?: string;       // e.g. "direct" | "internal_link" | "gsc"
  page_path?: string;
  page_location?: string;
}) {
  gtagEvent("ox_alpha_view", {
    source: opts?.source ?? "direct",
    page_path: opts?.page_path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
    page_location: opts?.page_location ?? (typeof window !== "undefined" ? window.location.href : undefined),
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
