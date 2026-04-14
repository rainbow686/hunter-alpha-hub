"use client";

import { useState } from "react";
import { Card } from "@/components/card";
import { NativeBanner } from "@/components/adsterra-ads";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "General",
    question: "What is Hunter Alpha?",
    answer: "Hunter Alpha is a 1 Trillion parameter AI model with a 1M token context window, available on OpenRouter. It's designed for agentic use cases including long-horizon planning, complex reasoning, and multi-step task execution. The model was added to OpenRouter on March 12, 2026.",
  },
  {
    category: "General",
    question: "Who created Hunter Alpha?",
    answer: "The creator is unknown. OpenRouter lists the provider simply as 'Hunter Alpha' with no additional company or organization information. This anonymity has fueled speculation in the AI community.",
  },
  {
    category: "Access",
    question: "How do I access Hunter Alpha?",
    answer: "Hunter Alpha is available on OpenRouter, a platform that provides access to various AI models. You can sign up at openrouter.ai and search for Hunter Alpha. As of now, it's free to use with no API costs.",
  },
  {
    category: "Access",
    question: "Is Hunter Alpha really free?",
    answer: "Yes, Hunter Alpha is currently free to use on OpenRouter. This means you can send prompts and receive responses without any charges. However, this could change in the future, so it's worth monitoring the model status page for updates.",
  },
  {
    category: "Technical",
    question: "What is Hunter Alpha's context window?",
    answer: "Hunter Alpha has a 1M (1,048,576 tokens) context window, which is one of the largest available in any AI model. This allows it to process extremely long documents or conversations while maintaining coherence and recall.",
  },
  {
    category: "Technical",
    question: "Does Hunter Alpha support images?",
    answer: "No, Hunter Alpha is a text-only model. It can only process and generate text. If you need image analysis capabilities, you would need to use a different multimodal model.",
  },
  {
    category: "Technical",
    question: "What base model is Hunter Alpha?",
    answer: "The base model is unknown. According to OpenRouter, Hunter Alpha has 1 Trillion parameters and is built for agentic use. Community speculation includes possibilities like a heavily modified Claude, a custom fine-tune, or a novel architecture.",
  },
  {
    category: "Community",
    question: "How can I contribute evidence?",
    answer: "You can submit evidence through our Evidence Wall. This could include interesting responses, observed behaviors, technical analysis, or any information that might help identify the model. Each submission helps the community investigation.",
  },
  {
    category: "Community",
    question: "Where can I discuss Hunter Alpha?",
    answer: "The main discussion hubs are Reddit's r/LocalLLaMA, Twitter/X, and various AI Discord servers. Our Evidence Wall also serves as a centralized place to view and discuss community findings.",
  },
];

const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

export default function FAQClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Frequently Asked Questions</span>
        </h1>
        <p className="max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          Everything you need to know about Hunter Alpha
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-violet-500 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {/* First 3 FAQs */}
        {filteredFaqs.slice(0, 3).map((faq, index) => (
          <Card key={index} className="p-6">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-violet-400 mb-2">
                  {faq.category}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-medium mt-2 mb-3"
                style={{ color: "var(--foreground)" }}
              >
                {faq.question}
              </h3>
              {openIndex === index && (
                <p
                  className="text-sm mt-4 pt-4 border-t"
                  style={{ color: "var(--muted)" }}
                >
                  {faq.answer}
                </p>
              )}
            </button>
          </Card>
        ))}
      </div>

      {/* Native Banner Ad - After first 3 FAQs */}
      <NativeBanner />

      {/* Remaining FAQs */}
      {filteredFaqs.length > 3 && (
        <div className="space-y-4">
          {filteredFaqs.slice(3).map((faq, index) => (
            <Card key={index + 3} className="p-6">
              <button
                onClick={() => setOpenIndex(openIndex === index + 3 ? null : index + 3)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-violet-400 mb-2">
                    {faq.category}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      openIndex === index + 3 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <h3
                  className="text-lg font-medium mt-2 mb-3"
                  style={{ color: "var(--foreground)" }}
                >
                  {faq.question}
                </h3>
                {openIndex === index + 3 && (
                  <p
                    className="text-sm mt-4 pt-4 border-t"
                    style={{ color: "var(--muted)" }}
                  >
                    {faq.answer}
                  </p>
                )}
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
