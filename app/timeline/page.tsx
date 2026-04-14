import { Metadata } from "next";
import TimelineClient from "./timeline-client";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Timeline - Hunter Alpha (Xiaomi mimo-v2) Hub",
  description: "Complete timeline of Hunter Alpha events from first sighting to identity reveal as Xiaomi's mimo-v2 model.",
  keywords: ["Hunter Alpha timeline", "Hunter Alpha history", "Xiaomi mimo-v2", "AI model events", "identity revealed"],
  alternates: {
    canonical: `${baseUrl}/timeline`,
  },
  openGraph: {
    title: "Timeline - Hunter Alpha (Xiaomi mimo-v2) Hub",
    description: "Complete timeline of Hunter Alpha events.",
    url: `${baseUrl}/timeline`,
    type: "website",
  },
};

export default function TimelinePage() {
  return <TimelineClient />;
}
