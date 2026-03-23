import { Metadata } from "next";
import HomeClient from "./home-client";
import { WebSiteSchema, BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Hunter Alpha = Xiaomi mimo-v2: Identity Revealed",
  description: "Hunter Alpha has been confirmed as Xiaomi's mimo-v2 AI model. This site archives the community investigation, evidence, and timeline of the mystery.",
  keywords: ["Hunter Alpha", "Xiaomi mimo-v2", "AI model", "OpenRouter", "LLM", "1M context", "free AI", "1T parameters"],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Hunter Alpha = Xiaomi mimo-v2: Identity Revealed",
    description: "Hunter Alpha has been confirmed as Xiaomi's mimo-v2 AI model. Archive of the community investigation.",
    url: baseUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hunter Alpha = Xiaomi mimo-v2: Identity Revealed",
    description: "Hunter Alpha has been confirmed as Xiaomi's mimo-v2 AI model. Archive of the community investigation.",
  },
};

export default function Home() {
  return (
    <>
      <HomeClient />
      <WebSiteSchema
        name="Hunter Alpha Hub"
        url={baseUrl}
        description="Archive of Hunter Alpha (Xiaomi mimo-v2) community investigation. Evidence, timeline, and analysis of the AI mystery."
      />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
        ]}
      />
    </>
  );
}
