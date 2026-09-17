"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackClusterClick, trackStealthLineView, trackStealthView } from "@/lib/gtag";

interface AnalyticsProps {
  gaId?: string;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function Analytics({ gaId }: AnalyticsProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId) return;
    // Avoid double-inject
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`)) return;

    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(gtagScript);

    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${gaId}', {
          // Page views are sent explicitly below so each navigation is counted
          // exactly once (config + explicit event would double-count the first hit).
          send_page_view: false,
          debug_mode: ${process.env.NODE_ENV !== "production" ? "true" : "false"}
        });
      `;
    document.head.appendChild(inlineScript);
  }, [gaId]);

  // Exactly one page_view per navigation: the first render and every SPA route change.
  useEffect(() => {
    if (!gaId || typeof window.gtag !== "function") return;
    const url = pathname + (typeof window !== "undefined" ? window.location.search : "");
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: url,
      page_title: document.title,
    });
  }, [pathname, gaId]);

  /**
   * Stealth-cluster classification, in one place instead of on every page.
   *
   * A new codename page gets its view event for free as long as it lives under
   * /<codename>, and the intent groups are the ones the content is actually
   * written for. Without this the cluster would only be visible in GA4 as
   * undifferentiated page_views, which is what we had until now.
   */
  useEffect(() => {
    if (!gaId) return;
    const path = pathname.replace(/\/$/, "");

    const modelPage = /^\/union-alpha(?:-|$)/.test(path);
    if (modelPage) {
      const group =
        path === "/union-alpha"
          ? "tracker"
          : path.endsWith("-free")
            ? "pricing"
            : path.endsWith("-opencode")
              ? "opencode"
              : path.endsWith("-not-working")
                ? "troubleshooting"
                : "cluster_other";
      trackStealthView({ model_id: "stealth/union-alpha", page_group: group });
      return;
    }

    const lineGroup =
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
    if (lineGroup) trackStealthLineView({ page_group: lineGroup });
  }, [pathname, gaId]);

  /**
   * cluster_click — internal movement between stealth pages, captured the same
   * way outbound clicks are. A capture-phase listener means the home page cards,
   * the footer column, the navbar and the in-page cards are all covered without
   * touching any of them.
   */
  useEffect(() => {
    if (!gaId) return;

    const isClusterPath = (path: string) =>
      /^\/(union-alpha|stealth-models|alpha-models|hunter-alpha|ox-alpha|hunter-alpha-benchmarks)(-|$|\/)/.test(path) ||
      path === "/union-alpha";

    const handler = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.host !== window.location.host) return;
      if (!isClusterPath(url.pathname)) return;
      if (url.pathname === window.location.pathname) return;

      trackClusterClick({
        to_path: url.pathname,
        link_text: anchor.textContent?.trim().slice(0, 80),
      });
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [gaId]);

  /**
   * Safety net for outbound clicks: any anchor pointing at openrouter.ai fires
   * outbound_openrouter_click, even on pages that do not use OutboundOpenRouterLink.
   * Capture phase so it runs before navigation.
   */
  useEffect(() => {
    if (!gaId) return;

    const handler = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      let host = "";
      try {
        host = new URL(anchor.href, window.location.href).host;
      } catch {
        return;
      }
      if (!host.endsWith("openrouter.ai")) return;

      window.gtag?.("event", "outbound_openrouter_click", {
        link_url: anchor.href,
        link_text: anchor.textContent?.trim().slice(0, 100),
        location: "auto_capture",
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [gaId]);

  useEffect(() => {
    // Adsterra Social Bar - testing (kept)
    if (document.querySelector('script[src*="developdomicile.com/0c/a6/f5"]')) return;
    const socialBarScript = document.createElement("script");
    socialBarScript.async = true;
    socialBarScript.setAttribute("data-cfasync", "false");
    socialBarScript.src = "https://developdomicile.com/0c/a6/f5/0ca6f5bfea3d69bc643d7eac78aca2a8.js";
    document.body.appendChild(socialBarScript);
  }, []);

  return null;
}
