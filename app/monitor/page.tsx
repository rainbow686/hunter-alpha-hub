import { Metadata } from "next";
import MonitorClient from "./monitor-client";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Model Status - Hunter Alpha (Xiaomi mimo-v2) Hub",
  description: "Real-time status for Hunter Alpha (Xiaomi mimo-v2) on OpenRouter. Check online status, specifications, pricing, and availability.",
  keywords: ["Hunter Alpha status", "Xiaomi mimo-v2", "AI model online", "OpenRouter status", "model availability"],
  alternates: {
    canonical: `${baseUrl}/monitor`,
  },
  openGraph: {
    title: "Model Status - Hunter Alpha (Xiaomi mimo-v2) Hub",
    description: "Real-time status for Hunter Alpha (Xiaomi mimo-v2) on OpenRouter.",
    url: `${baseUrl}/monitor`,
    type: "website",
  },
};

export default function MonitorPage() {
  return <MonitorClient />;
}
