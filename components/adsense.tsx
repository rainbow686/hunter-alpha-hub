"use client";

import Script from "next/script";

interface AdSenseProps {
  clientId: string;
}

/**
 * Google AdSense 主脚本 - 全局加载
 * clientId: ca-pub-4516753695428109
 */
export function AdSense({ clientId }: AdSenseProps) {
  if (!clientId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
