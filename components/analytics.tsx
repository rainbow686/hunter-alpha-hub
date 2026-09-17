"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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
