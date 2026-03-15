import { Metadata } from "next";
import EvidenceClient from "./evidence-client";

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
};

export default function EvidencePage() {
  return <EvidenceClient />;
}
