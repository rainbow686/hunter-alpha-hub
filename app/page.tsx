import { Metadata } from "next";
import HomeClient from "./home-client";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Home",
  description: "Track Hunter Alpha, a free 1T parameter AI model with 1M context window on OpenRouter. Submit evidence, view videos, and solve the identity mystery.",
  keywords: ["Hunter Alpha", "AI model", "OpenRouter", "LLM", "1M context", "free AI", "1T parameters"],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Hunter Alpha Hub - Home",
    description: "Track Hunter Alpha, a free 1T parameter AI model with 1M context window. Submit evidence and solve the mystery.",
    url: baseUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hunter Alpha Hub - Home",
    description: "Track Hunter Alpha, a free 1T parameter AI model with 1M context window.",
  },
};

export default function Home() {
  return <HomeClient />;
}
