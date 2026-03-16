import { Metadata } from "next";
import Link from "next/link";
import BlogList from "./blog-list";
import { BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Blog - Hunter Alpha Hub",
  description: "In-depth articles, guides, and analysis about Hunter Alpha AI model. Learn about capabilities, comparisons, and the ongoing identity investigation.",
  keywords: ["Hunter Alpha blog", "AI model guide", "Hunter Alpha analysis", "1M context AI", "Hunter Alpha tutorial"],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: "Blog - Hunter Alpha Hub",
    description: "In-depth articles and guides about Hunter Alpha AI model.",
    url: `${baseUrl}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Hunter Alpha Hub",
    description: "In-depth articles and guides about Hunter Alpha AI model.",
  },
};

export default function BlogPage() {
  return (
    <>
      <BlogList />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Blog", url: `${baseUrl}/blog` },
        ]}
      />
    </>
  );
}
