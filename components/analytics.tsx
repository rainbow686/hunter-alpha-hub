"use client";

import Script from "next/script";

interface AnalyticsProps {
  gaId?: string;
  adsenseId?: string;
}

export function Analytics({ gaId, adsenseId }: AnalyticsProps) {
  if (!gaId && !adsenseId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {/* Google AdSense */}
      {adsenseId && (
        <>
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          <Script id="google-adsense" strategy="afterInteractive">
            {`
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "${adsenseId}",
                enable_page_level_ads: true
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}
