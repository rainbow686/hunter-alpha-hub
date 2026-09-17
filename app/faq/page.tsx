import { Metadata } from "next";
import FAQClient from "./faq-client";
import { FAQSchema, BreadcrumbListSchema } from "@/components/structured-data";
import { siteFaqs } from "@/lib/faq";

const baseUrl = "https://www.hunteralphahub.com";

/** The JSON-LD is built from the same array the page renders — lib/faq.ts. */
const faqData = siteFaqs.map(({ question, answer }) => ({ question, answer }));

export const metadata: Metadata = {
  title: "FAQ: Hunter Alpha, the Alpha Line and How We Verify Facts",
  description:
    "Hunter Alpha is now Xiaomi MiMo-V2.5, and its free preview is over. Answers on the Alpha line of anonymous OpenRouter models, current pricing, the live stealth release, and how this site separates catalogue facts from claims.",
  keywords: [
    "hunter alpha faq",
    "hunter alpha free",
    "alpha models",
    "stealth model openrouter",
    "union alpha free",
    "openrouter model hub faq",
  ],
  alternates: {
    canonical: `${baseUrl}/faq`,
    languages: {
      "en-US": `${baseUrl}/faq`,
      "zh-CN": `${baseUrl}/zh/faq`,
    },
  },
  openGraph: {
    title: "FAQ: Hunter Alpha, the Alpha Line and How We Verify Facts",
    description:
      "Answers on the Alpha line of anonymous OpenRouter models, current pricing, and how facts are separated from claims.",
    url: `${baseUrl}/faq`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ: Hunter Alpha and the Alpha Line",
    description: "Anonymous model releases, current pricing, and how this site verifies facts.",
  },
};

export default function FAQPage() {
  return (
    <>
      <FAQClient />
      <FAQSchema faqs={faqData} />
      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "FAQ", url: `${baseUrl}/faq` },
        ]}
      />
    </>
  );
}
