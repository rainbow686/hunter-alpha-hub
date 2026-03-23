import { Metadata } from "next";
import FAQClient from "./faq-client";
import { FAQSchema, BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";

const faqData = [
  {
    question: "Has Hunter Alpha's identity been revealed?",
    answer: "Yes! Hunter Alpha has been officially confirmed as Xiaomi's mimo-v2 AI model. The mystery that began in March 2026 has been solved. Read our announcement post for the full timeline and details.",
  },
  {
    question: "What is Hunter Alpha?",
    answer: "Hunter Alpha is Xiaomi's mimo-v2 model, a 1 Trillion parameter AI with a 1M token context window. It was added to OpenRouter on March 12, 2026, and is designed for agentic use cases including long-horizon planning, complex reasoning, and multi-step task execution.",
  },
  {
    question: "Who created Hunter Alpha?",
    answer: "Hunter Alpha is created by Xiaomi. It is their mimo-v2 large language model. This was officially confirmed in March 2026 after weeks of community speculation.",
  },
  {
    question: "How do I access Hunter Alpha?",
    answer: "Hunter Alpha is available on OpenRouter, a platform that provides access to various AI models. You can sign up at openrouter.ai and search for Hunter Alpha. As of now, it's free to use with no API costs.",
  },
  {
    question: "Is Hunter Alpha really free?",
    answer: "Yes, Hunter Alpha is currently free to use on OpenRouter. This means you can send prompts and receive responses without any charges. However, this could change in the future, so it's worth monitoring the model status page for updates.",
  },
  {
    question: "What is Hunter Alpha's context window?",
    answer: "Hunter Alpha has a 1M (1,048,576 tokens) context window, which is one of the largest available in any AI model. This allows it to process extremely long documents or conversations while maintaining coherence and recall.",
  },
  {
    question: "Does Hunter Alpha support images?",
    answer: "No, Hunter Alpha is a text-only model. It can only process and generate text. If you need image analysis capabilities, you would need to use a different multimodal model.",
  },
  {
    question: "What base model is Hunter Alpha?",
    answer: "Hunter Alpha is Xiaomi's mimo-v2 model. It has 1 Trillion parameters according to OpenRouter data and is built for agentic use cases with its industry-leading 1M token context window.",
  },
  {
    question: "How can I contribute evidence?",
    answer: "You can submit evidence through our Evidence Wall. This could include interesting responses, observed behaviors, technical analysis, or any information that might help identify the model. Each submission helps the community investigation.",
  },
  {
    question: "Where can I discuss Hunter Alpha?",
    answer: "The main discussion hubs are Reddit's r/LocalLLaMA, Twitter/X, and various AI Discord servers. Our Evidence Wall also serves as a centralized place to view and discuss community findings.",
  },
];

export const metadata: Metadata = {
  title: "FAQ - Hunter Alpha Hub",
  description: "Frequently asked questions about Hunter Alpha AI model. Learn how to access, pricing, context window, and technical specifications.",
  keywords: ["Hunter Alpha FAQ", "Hunter Alpha how to use", "Hunter Alpha free", "AI model guide"],
  alternates: {
    canonical: `${baseUrl}/faq`,
  },
  openGraph: {
    title: "FAQ - Hunter Alpha Hub",
    description: "Frequently asked questions about Hunter Alpha AI model.",
    url: `${baseUrl}/faq`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - Hunter Alpha Hub",
    description: "Frequently asked questions about Hunter Alpha AI model.",
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
