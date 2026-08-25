"use client";

import { useEffect } from "react";

interface AnalyticsProps {
  gaId?: string;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

function trackSocialUTM(gaId?: string) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const utm_source = params.get("utm_source");
  const utm_medium = params.get("utm_medium");
  const utm_campaign = params.get("utm_campaign");
  const path = window.location.pathname;
  // ox_alpha_view for any ox-alpha page view
  if (path.includes("ox-alpha") && window.gtag) {
    window.gtag("event", "ox_alpha_view", {
      page_path: path,
      utm_source: utm_source || "(direct)",
      utm_medium: utm_medium || "(none)",
      utm_campaign: utm_campaign || "(none)",
    });
  }
  // social_referral when utm present
  if (utm_source && window.gtag) {
    window.gtag("event", "social_referral", {
      utm_source,
      utm_medium: utm_medium || "(none)",
      utm_campaign: utm_campaign || "(none)",
      page_path: path,
    });
  }
}

export function Analytics({ gaId }: AnalyticsProps) {
  useEffect(() => {
    // Google Analytics
    if (gaId) {
      const gtagScript = document.createElement("script");
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gtagScript);

      const inlineScript = document.createElement("script");
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(inlineScript);

      // fire UTM + ox_alpha_view after gtag loads
      setTimeout(() => trackSocialUTM(gaId), 1200);
      // also on SPA navigation
      const onUrlChange = () => trackSocialUTM(gaId);
      window.addEventListener("popstate", onUrlChange);
      return () => window.removeEventListener("popstate", onUrlChange);
    }

    // Adsterra Popunder - disabled (causes click-anywhere issue)
    // const popunderScript = document.createElement("script");
    // popunderScript.async = true;
    // popunderScript.setAttribute("data-cfasync", "false");
    // popunderScript.src = "https://developdomicile.com/1d/c9/c5/1dc9c5101c754a566067a70e2718618e.js";
    // document.head.appendChild(popunderScript);

    // Adsterra Social Bar - testing
    const socialBarScript = document.createElement("script");
    socialBarScript.async = true;
    socialBarScript.setAttribute("data-cfasync", "false");
    socialBarScript.src = "https://developdomicile.com/0c/a6/f5/0ca6f5bfea3d69bc643d7eac78aca2a8.js";
    document.body.appendChild(socialBarScript);
  }, [gaId]);

  return null;
}
