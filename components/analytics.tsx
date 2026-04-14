"use client";

import { useEffect } from "react";

interface AnalyticsProps {
  gaId?: string;
}

export function Analytics({ gaId }: AnalyticsProps) {
  useEffect(() => {
    // Debug: Log when component mounts
    console.log("[Adsterra Debug] Analytics component mounted");

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
      console.log("[GA Debug] Google Analytics scripts injected");
    }

    // Adsterra Popunder - key attribute: data-cfasync="false"
    const popunderScript = document.createElement("script");
    popunderScript.async = true;
    popunderScript.setAttribute("data-cfasync", "false");
    popunderScript.src = "https://pl29147944.profitablecpmratenetwork.com/1d/c9/c5/1dc9c5101c754a566067a70e2718618e.js";
    document.head.appendChild(popunderScript);
    console.log("[Adsterra Debug] Popunder script injected to head", popunderScript);

    // Adsterra Social Bar - key attribute: data-cfasync="false"
    const socialBarScript = document.createElement("script");
    socialBarScript.async = true;
    socialBarScript.setAttribute("data-cfasync", "false");
    socialBarScript.src = "https://pl29147949.profitablecpmratenetwork.com/0c/a6/f5/0ca6f5bfea3d69bc643d7eac78aca2a8.js";
    document.body.appendChild(socialBarScript);
    console.log("[Adsterra Debug] Social Bar script injected to body", socialBarScript);
  }, [gaId]);

  return null;
}