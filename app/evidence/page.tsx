import { Metadata } from "next";
import EvidenceClient from "./evidence-client";
import { BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Evidence Wall - Hunter Alpha Hub",
  description: "Browse and submit community evidence about Hunter Alpha AI model. Each clue brings us closer to solving the identity mystery.",
  keywords: ["Hunter Alpha evidence", "AI model clues", "Hunter Alpha mystery", "OpenRouter evidence"],
  alternates: {
    canonical: `${baseUrl}/evidence`,
  },
  openGraph: {
    title: "Evidence Wall - Hunter Alpha Hub",
    description: "Browse and submit community evidence about Hunter Alpha AI model.",
    url: `${baseUrl}/evidence`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evidence Wall - Hunter Alpha Hub",
    description: "Browse and submit community evidence about Hunter Alpha AI model.",
  },
};

export default function EvidencePage() {
  return (
    <>
      <EvidenceClient />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Evidence Wall", url: `${baseUrl}/evidence` },
        ]}
      />
    </>
  );
}
