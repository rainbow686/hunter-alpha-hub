import { Metadata } from "next";
import FAQClient from "./faq-client";

const baseUrl = "https://www.hunteralphahub.com";

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
};

export default function FAQPage() {
  return <FAQClient />;
}
