import { Metadata } from "next";
import Link from "next/link";
import BlogList from "./blog-list";
import { BlogSchema, BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: { absolute: "Model Hub Blog — OpenRouter comparisons & guides" },
  description: "Practical articles, comparisons and tutorials for choosing and using AI models on OpenRouter.",
  keywords: ["OpenRouter blog", "AI model comparison", "OpenRouter guide", "AI model tutorial", "long context models"],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: { absolute: "Model Hub Blog — OpenRouter comparisons & guides" },
    description: "Practical articles and guides for choosing AI models on OpenRouter.",
    url: `${baseUrl}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: { absolute: "Model Hub Blog — OpenRouter comparisons & guides" },
    description: "Practical articles and guides for choosing AI models on OpenRouter.",
  },
};

export default function BlogPage() {
  return (
    <>
      <BlogList />
      <BlogSchema
        name="Model Hub Blog"
        url={`${baseUrl}/blog`}
        description="Practical articles, comparisons and tutorials for choosing and using AI models on OpenRouter."
      />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Blog", url: `${baseUrl}/blog` },
        ]}
      />
    </>
  );
}
