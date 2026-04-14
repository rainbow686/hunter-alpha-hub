"use client";

import { useEffect } from "react";

// Native Banner - Best for content pages
export function NativeBanner() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl29147948.profitablecpmratenetwork.com/916abc105b9a8c12c10ffdd9f6291bcc/invoke.js";

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

// Banner 300x250 - Best for sidebars
export function Banner300() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl29147947.profitablecpmratenetwork.com/1e/a8/34/1ea834d0129c5e18a4a70e277b8f0de6/invoke.js";

    const container = document.getElementById("container-1ea834d0129c5e18a4a70e277b8f0de6");
    if (container && container.parentElement) {
      container.parentElement.appendChild(script);
    }
  }, []);

  return (
    <div className="ad-banner-wrapper">
      <div id="container-1ea834d0129c5e18a4a70e277b8f0de6"></div>
    </div>
  );
}