import { Metadata } from "next";
import MonitorClient from "./monitor-client";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Model Status - Hunter Alpha Hub",
  description: "Real-time Hunter Alpha model status on OpenRouter. Check online status, specifications, pricing, and availability.",
  keywords: ["Hunter Alpha status", "AI model online", "OpenRouter status", "model availability"],
  alternates: {
    canonical: `${baseUrl}/monitor`,
  },
  openGraph: {
    title: "Model Status - Hunter Alpha Hub",
    description: "Real-time Hunter Alpha model status on OpenRouter.",
    url: `${baseUrl}/monitor`,
    type: "website",
  },
};

export default function MonitorPage() {
  return <MonitorClient />;
}
