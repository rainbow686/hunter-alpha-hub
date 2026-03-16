import { Metadata } from "next";
import HomeClient from "./home-client";
import { WebSiteSchema, BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Unraveling Hunter Alpha: The AI Mystery Hub",
  description: "Track Hunter Alpha, a free 1T parameter AI model with 1M context window on OpenRouter. Submit evidence, view videos, and solve the identity mystery.",
  keywords: ["Hunter Alpha", "AI model", "OpenRouter", "LLM", "1M context", "free AI", "1T parameters"],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Unraveling Hunter Alpha: The AI Mystery Hub",
    description: "Track Hunter Alpha, a free 1T parameter AI model with 1M context window. Submit evidence and solve the mystery.",
    url: baseUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unraveling Hunter Alpha: The AI Mystery Hub",
    description: "Track Hunter Alpha, a free 1T parameter AI model with 1M context window.",
  },
};

export default function Home() {
  return (
    <>
      <HomeClient />
      <WebSiteSchema
        name="Hunter Alpha Hub"
        url={baseUrl}
        description="Third-party tracker for Hunter Alpha AI model. Submit evidence, track real-time status, view specs, and get notified when identity is revealed."
      />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
        ]}
      />
    </>
  );
}
