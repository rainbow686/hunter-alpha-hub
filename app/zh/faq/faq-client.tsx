"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/card";
import { NativeBanner } from "@/components/adsterra-ads";
import { chineseFaqs } from "@/lib/zh-faq";



const categories = ["全部", ...Array.from(new Set(chineseFaqs.map((faq) => faq.category)))];

export default function ChineseFaqClient() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs =
    activeCategory === "全部"
      ? chineseFaqs
      : chineseFaqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" lang="zh-CN">
      <div className="text-center mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300">
            中文
          </span>
          <Link
            href="/faq"
            className="text-xs px-3 py-1 rounded-full border border-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            English
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Hunter Alpha 中文 FAQ</span>
        </h1>
        <p className="max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          关于小米 mimo-v2、访问方式、价格、1M 上下文和安全使用的中文答案。
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setActiveCategory(category);
              setOpenIndex(null);
            }}
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

      <NativeBanner />

      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <Card key={faq.question} className="p-6">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-violet-400 mb-2">{faq.category}</span>
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
              <h3 className="text-lg font-medium mt-2 mb-3" style={{ color: "var(--foreground)" }}>
                {faq.question}
              </h3>
              {openIndex === index && (
                <p className="text-sm mt-4 pt-4 border-t" style={{ color: "var(--muted)" }}>
                  {faq.answer}
                </p>
              )}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
