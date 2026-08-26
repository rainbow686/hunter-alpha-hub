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
          send_page_view: true,
          debug_mode: ${process.env.NODE_ENV !== "production" ? "true" : "false"}
        });
      `;
    document.head.appendChild(inlineScript);
  }, [gaId]);

  // SPA page_view on route change (GA4 also does this via config, this is explicit for DebugView visibility)
  useEffect(() => {
    if (!gaId || typeof window.gtag !== "function") return;
    const url = pathname + (typeof window !== "undefined" ? window.location.search : "");
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: url,
      page_title: document.title,
    });
  }, [pathname, gaId]);

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
