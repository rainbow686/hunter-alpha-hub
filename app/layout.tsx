import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s | Hunter Alpha Hub",
    default: "Hunter Alpha Hub - Track the AI Identity Mystery",
  },
  description: "Third-party tracker for Hunter Alpha AI model. Submit evidence, track real-time status, view specs, and get notified when identity is revealed.",
  keywords: ["Hunter Alpha", "AI model", "OpenRouter", "LLM", "AI mystery", "1M context", "Hunter Hub"],
  authors: [{ name: "Hunter Alpha Hub" }],
  creator: "Hunter Alpha Hub",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Hunter Alpha Hub - Track the AI Identity Mystery",
    description: "Third-party tracker for Hunter Alpha AI model. Submit evidence, track real-time status, and get notified when identity is revealed.",
    siteName: "Hunter Alpha Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hunter Alpha Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hunter Alpha Hub - Track the AI Identity Mystery",
    description: "Third-party tracker for Hunter Alpha AI model. Submit evidence, track real-time status, and get notified when identity is revealed.",
    creator: "@hunteralphahub",
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
  verification: {
    google: "your-google-verification-code",
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
        <Analytics
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          adsenseId={process.env.NEXT_PUBLIC_ADSENSE_ID}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
