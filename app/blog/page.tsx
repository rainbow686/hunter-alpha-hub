import { Metadata } from "next";
import Link from "next/link";
import BlogList from "./blog-list";
import { BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Blog - OpenRouter Model Hub",
  description: "Practical articles, comparisons and tutorials for choosing and using AI models on OpenRouter.",
  keywords: ["OpenRouter blog", "AI model comparison", "OpenRouter guide", "AI model tutorial", "long context models"],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: "Blog - OpenRouter Model Hub",
    description: "Practical articles and guides for choosing AI models on OpenRouter.",
    url: `${baseUrl}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - OpenRouter Model Hub",
    description: "Practical articles and guides for choosing AI models on OpenRouter.",
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
