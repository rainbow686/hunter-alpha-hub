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
  /**
   * Retired routes (ADR-0012). The pages are gone, but the URLs are still in
   * Google's index and in a handful of old links, so they get a permanent
   * redirect rather than a 404 — a bare 404 throws away whatever signal those
   * URLs have accumulated, and 301 is the only form of "gone" that keeps it.
   *
   * statusCode 301 rather than `permanent: true` on purpose: Next emits 308 for
   * the latter, and 301 is what the guidance says.
   */
  async redirects() {
    return [
      { source: "/leaderboard", destination: "/", statusCode: 301 },
      { source: "/monitor", destination: "/", statusCode: 301 },
      { source: "/evidence", destination: "/", statusCode: 301 },
      { source: "/timeline", destination: "/", statusCode: 301 },
      { source: "/videos", destination: "/", statusCode: 301 },
      { source: "/profile/:nickname", destination: "/", statusCode: 301 },
    ];
  },
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
