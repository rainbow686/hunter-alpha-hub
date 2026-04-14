"use client";

import { useEffect } from "react";

// Native Banner - Best for content pages, looks like content
// Uses useEffect to ensure container exists before script loads
export function NativeBanner() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl29147948.profitablecpmratenetwork.com/916abc105b9a8c12c10ffdd9f6291bcc/invoke.js";

    // Find the container and append script next to it
    const container = document.getElementById("container-916abc105b9a8c12c10ffdd9f6291bcc");
    if (container && container.parentElement) {
      container.parentElement.appendChild(script);
    }
  }, []);

  return (
    <div className="ad-native-wrapper my-8">
      <div id="container-916abc105b9a8c12c10ffdd9f6291bcc"></div>
    </div>
  );
}