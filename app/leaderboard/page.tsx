import { Metadata } from "next";
import LeaderboardClient from "./leaderboard-client";
import { BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Contributor Leaderboard - Hunter Alpha Hub",
  description: "Top contributors investigating the Hunter Alpha AI mystery. See who's submitting the most evidence and earning the most likes.",
  keywords: ["Hunter Alpha contributors", "evidence leaderboard", "top detectives", "community rankings"],
  alternates: {
    canonical: `${baseUrl}/leaderboard`,
  },
  openGraph: {
    title: "Contributor Leaderboard - Hunter Alpha Hub",
    description: "Top contributors investigating the Hunter Alpha AI mystery.",
    url: `${baseUrl}/leaderboard`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contributor Leaderboard - Hunter Alpha Hub",
    description: "Top contributors investigating the Hunter Alpha AI mystery.",
  },
};

export default function LeaderboardPage() {
  return (
    <>
      <LeaderboardClient />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Leaderboard", url: `${baseUrl}/leaderboard` },
        ]}
      />
    </>
  );
}
