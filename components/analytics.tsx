"use client";

import { useEffect } from "react";

interface AnalyticsProps {
  gaId?: string;
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
    }

    // Adsterra Popunder - temporarily disabled for testing
    // const popunderConfig = document.createElement("script");
    // popunderConfig.setAttribute("data-cfasync", "false");
    // popunderConfig.innerHTML = `
    //   var ad_idzone = "29147944",
    //     ad_popup_fallback = false,
    //     ad_popup_force = false,
    //     ad_new_tab = false,
    //     ad_period = 5,
    //     ad_open_period = 0,
    //     ad_type = "popunder",
    //     ad_effect_in_days = 1,
    //     ad_close_in_days = 99,
    //     ad_close_event = false,
    //     ad_remove_event = false,
    //     ad_popup_auto_close = false;
    // `;
    // document.head.appendChild(popunderConfig);

    // const popunderScript = document.createElement("script");
    // popunderScript.async = true;
    // popunderScript.setAttribute("data-cfasync", "false");
    // popunderScript.src = "https://pl29147944.profitablecpmratenetwork.com/1d/c9/c5/1dc9c5101c754a566067a70e2718618e.js";
    // document.head.appendChild(popunderScript);

    // Adsterra Social Bar - with proper config
    const socialBarConfig = document.createElement("script");
    socialBarConfig.setAttribute("data-cfasync", "false");
    socialBarConfig.innerHTML = `
      var ad_idzone = "29147950",
        ad_frequency_period = 720,
        ad_frequency_count = 1;
    `;
    document.head.appendChild(socialBarConfig);

    const socialBarScript = document.createElement("script");
    socialBarScript.async = true;
    socialBarScript.setAttribute("data-cfasync", "false");
    socialBarScript.src = "https://pl29147950.profitablecpmratenetwork.com/0c/a6/f5/0ca6f5bfea3d69bc643d7eac78aca2a8.js";
    document.body.appendChild(socialBarScript);
  }, [gaId]);

  return null;
}