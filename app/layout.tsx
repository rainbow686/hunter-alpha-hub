import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { AdSense } from "@/components/adsense";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s | OpenRouter Model Hub",
    default: "OpenRouter Model Hub — Compare AI Models: Pricing, Context & Benchmarks",
  },
  description:
    "Compare 15+ AI models on OpenRouter side-by-side. Pricing, context windows, modality support and practical recommendations for coding, long context, agents and budget workloads.",
  keywords: [
    "openrouter models comparison",
    "best openrouter models",
    "openrouter pricing calculator",
    "openrouter free models",
    "ai model comparison",
    "openrouter model hub",
  ],
  authors: [{ name: "OpenRouter Model Hub" }],
  creator: "OpenRouter Model Hub",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "OpenRouter Model Hub — Compare AI Models",
    description:
      "Compare OpenRouter models by pricing, context window, modality and best-use case.",
    siteName: "OpenRouter Model Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpenRouter Model Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenRouter Model Hub — Compare AI Models",
    description:
      "Compare OpenRouter models by pricing, context window, modality and best-use case.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300 flex flex-col">
        <AdSense clientId={process.env.NEXT_PUBLIC_ADSENSE_ID || ""} />
        {/* GA4 probe. NEXT_PUBLIC_GA_ID is inlined at build time; GA_MEASUREMENT_ID lets a
            runtime (Worker) variable switch it on without a rebuild. Both are public values. */}
        <Analytics
          gaId={process.env.NEXT_PUBLIC_GA_ID || process.env.GA_MEASUREMENT_ID}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
