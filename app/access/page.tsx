import { Metadata } from "next";
import AccessClient from "./access-client";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "How to Access Hunter Alpha (Xiaomi mimo-v2)",
  description: "Step-by-step guide to access Hunter Alpha (Xiaomi mimo-v2) on OpenRouter. Create account, find model, and start chatting for free.",
  keywords: ["Hunter Alpha how to access", "Xiaomi mimo-v2", "Hunter Alpha guide", "OpenRouter Hunter Alpha", "Hunter Alpha tutorial"],
  alternates: {
    canonical: `${baseUrl}/access`,
  },
  openGraph: {
    title: "How to Access Hunter Alpha (Xiaomi mimo-v2)",
    description: "Step-by-step guide to access Hunter Alpha (Xiaomi mimo-v2) on OpenRouter.",
    url: `${baseUrl}/access`,
    type: "website",
  },
};

export default function AccessPage() {
  return <AccessClient />;
}
