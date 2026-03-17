import { Metadata } from "next";
import ProfileClient from "./profile-client";

const baseUrl = "https://www.hunteralphahub.com";

interface ProfilePageProps {
  params: Promise<{
    nickname: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { nickname } = await params;

  return {
    title: `${nickname}'s Profile - Hunter Alpha Hub`,
    description: `View ${nickname}'s contributions to the Hunter Alpha investigation. See their submitted evidence, achievements, and community stats.`,
    alternates: {
      canonical: `${baseUrl}/profile/${nickname}`,
    },
    openGraph: {
      title: `${nickname}'s Profile - Hunter Alpha Hub`,
      description: `View ${nickname}'s contributions to the Hunter Alpha investigation.`,
      url: `${baseUrl}/profile/${nickname}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${nickname}'s Profile - Hunter Alpha Hub`,
      description: `View ${nickname}'s contributions to the Hunter Alpha investigation.`,
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { nickname } = await params;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ProfileClient nickname={nickname} />
    </div>
  );
}
