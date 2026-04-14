"use client";

import { useEffect } from "react";

// Native Banner - Best for content pages
export function NativeBanner() {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://developdomicile.com/916abc105b9a8c12c10ffdd9f6291bcc/invoke.js";

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
    // Set atOptions
    (window as unknown as Record<string, unknown>).atOptions = {
      'key': '1ebb84962e9f0ffe0098bf65dc2c91d5',
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };

    const script = document.createElement("script");
    script.src = "https://developdomicile.com/1ebb84962e9f0ffe0098bf65dc2c91d5/invoke.js";

    const container = document.getElementById("container-1ebb84962e9f0ffe0098bf65dc2c91d5");
    if (container && container.parentElement) {
      container.parentElement.appendChild(script);
    }
  }, []);

  return (
    <div className="ad-banner-wrapper">
      <div id="container-1ebb84962e9f0ffe0098bf65dc2c91d5"></div>
    </div>
  );
}