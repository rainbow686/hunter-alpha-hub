import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Parity with the policy that used to live only in vercel.json, so the
    // Cloudflare Worker (the real deployment) enforces it too. Keep every
    // third-party origin the site actually loads: Adsterra, GA4, AdSense.
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://developdomicile.com https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://static.cloudflareinsights.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https: https://tpc.googlesyndication.com https://googleads.g.doubleclick.net; " +
      "connect-src 'self' https: https://www.google-analytics.com https://cloudflareinsights.com; " +
      "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
