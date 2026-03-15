"use client";

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
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `,
            }}
          />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
        </>
      )}

      {/* Google AdSense */}
      {adsenseId && (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
