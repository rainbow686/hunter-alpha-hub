"use client";

// Native Banner - Best for content pages, looks like content
export function NativeBanner() {
  return (
    <div className="ad-native-wrapper my-8">
      <script async src="https://pl29147948.profitablecpmratenetwork.com/916abc105b9a8c12c10ffdd9f6291bcc/invoke.js" />
      <div id="container-916abc105b9a8c12c10ffdd9f6291bcc"></div>
    </div>
  );
}

// Banner 728x90 - Desktop leaderboard
export function BannerLeaderboard({ className = "" }: { className?: string }) {
  return (
    <div className={`ad-banner-728x90 flex justify-center my-6 ${className}`}>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            atOptions = {
              'key' : '16a6aee3a87f7fef1577ccbd24baafa3',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
          `,
        }}
      />
      <script async src="https://www.highperformanceformat.com/16a6aee3a87f7fef1577ccbd24baafa3/invoke.js" />
    </div>
  );
}

// Banner 320x50 - Mobile banner
export function BannerMobile({ className = "" }: { className?: string }) {
  return (
    <div className={`ad-banner-320x50 flex justify-center my-4 ${className}`}>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            atOptions = {
              'key' : '2d7900b6dbc60a966a57766a6fa8d45e',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          `,
        }}
      />
      <script async src="https://www.highperformanceformat.com/2d7900b6dbc60a966a57766a6fa8d45e/invoke.js" />
    </div>
  );
}

// Banner 300x250 - Medium rectangle
export function BannerRectangle({ className = "" }: { className?: string }) {
  return (
    <div className={`ad-banner-300x250 flex justify-center my-4 ${className}`}>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            atOptions = {
              'key' : '1ebb84962e9f0ffe0098bf65dc2c91d5',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          `,
        }}
      />
      <script async src="https://www.highperformanceformat.com/1ebb84962e9f0ffe0098bf65dc2c91d5/invoke.js" />
    </div>
  );
}

// Responsive Banner - shows 728x90 on desktop, 320x50 on mobile
export function BannerResponsive({ className = "" }: { className?: string }) {
  return (
    <div className={`ad-banner-responsive ${className}`}>
      {/* Desktop: 728x90 */}
      <div className="hidden md:flex justify-center my-6">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : '16a6aee3a87f7fef1577ccbd24baafa3',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            `,
          }}
        />
        <script async src="https://www.highperformanceformat.com/16a6aee3a87f7fef1577ccbd24baafa3/invoke.js" />
      </div>
      {/* Mobile: 320x50 */}
      <div className="flex md:hidden justify-center my-4">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : '2d7900b6dbc60a966a57766a6fa8d45e',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
              };
            `,
          }}
        />
        <script async src="https://www.highperformanceformat.com/2d7900b6dbc60a966a57766a6fa8d45e/invoke.js" />
      </div>
    </div>
  );
}