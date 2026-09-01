import { Metadata } from "next";
import AccessClient from "./access-client";
import { ArticleSchema, BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/access`;

export const metadata: Metadata = {
  title: "How to Use OpenRouter: Models, Playground & API",
  description:
    "A practical guide to OpenRouter: create an account, choose a model, test in the playground, estimate monthly cost and wire the API into production.",
  keywords: [
    "openrouter guide",
    "how to use openrouter",
    "openrouter api guide",
    "openrouter playground",
    "openrouter model guide",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "How to Use OpenRouter: Models, Playground & API",
    description:
      "A practical guide to choosing, testing and using AI models on OpenRouter.",
    url: pageUrl,
    type: "website",
  },
};

export default function AccessPage() {
  return (
    <>
      <AccessClient />
      <ArticleSchema
        title="How to Use OpenRouter: Models, Playground & API"
        description="A practical guide to creating an account, choosing a model, testing in the playground, estimating cost and using the OpenRouter API."
        url={pageUrl}
      />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "How to Use OpenRouter", url: pageUrl },
        ]}
      />
    </>
  );
}
