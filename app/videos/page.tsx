import { Metadata } from "next";
import VideosClient from "./videos-client";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Featured Videos - Hunter Alpha Hub",
  description: "Watch in-depth analysis, reviews, and discussions about Hunter Alpha and long-context AI technology.",
  keywords: ["Hunter Alpha videos", "AI model review", "LLM analysis", "AI tutorial"],
  alternates: {
    canonical: `${baseUrl}/videos`,
  },
  openGraph: {
    title: "Featured Videos - Hunter Alpha Hub",
    description: "Watch in-depth analysis and reviews about Hunter Alpha AI model.",
    url: `${baseUrl}/videos`,
    type: "website",
  },
};

export default function VideosPage() {
  return <VideosClient />;
}
