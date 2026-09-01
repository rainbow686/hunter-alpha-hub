import { Metadata } from "next";
import { PricingCalculator } from "@/components/pricing-calculator";
import { BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/openrouter-pricing-calculator`;

export const metadata: Metadata = {
  title: "OpenRouter Pricing Calculator",
  description:
    "Estimate monthly AI costs on OpenRouter by selecting models, token volume and input/output split.",
  keywords: [
    "openrouter pricing calculator",
    "openrouter cost calculator",
    "openrouter pricing",
    "ai cost calculator",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "OpenRouter Pricing Calculator",
    description: "Estimate monthly AI costs on OpenRouter.",
    url: pageUrl,
    type: "website",
  },
};

export default function PricingCalculatorPage() {
  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">OpenRouter Pricing Calculator</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg" style={{ color: "var(--muted)" }}>
            Choose models, set monthly token volume and adjust the input/output split to see
            estimated monthly cost.
          </p>
        </div>

        <PricingCalculator />
      </div>

      <BreadcrumbListSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "OpenRouter Pricing Calculator", url: pageUrl },
        ]}
      />
    </>
  );
}
