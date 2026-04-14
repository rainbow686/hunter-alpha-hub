"use client";

import Script from "next/script";

interface AnalyticsProps {
  gaId?: string;
}

export function Analytics({ gaId }: AnalyticsProps) {
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

      {/* Adsterra Popunder */}
      <script async src="https://pl29147944.profitablecpmratenetwork.com/1d/c9/c5/1dc9c5101c754a566067a70e2718618e.js" />

      {/* Adsterra Social Bar */}
      <script async src="https://pl29147949.profitablecpmratenetwork.com/0c/a6/f5/0ca6f5bfea3d69bc643d7eac78aca2a8.js" />
    </>
  );
}