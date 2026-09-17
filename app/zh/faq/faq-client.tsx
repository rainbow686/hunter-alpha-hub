"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/card";
import { NativeBanner } from "@/components/adsterra-ads";
import { chineseFaqs } from "@/lib/zh-faq";



const categories = ["全部", ...Array.from(new Set(chineseFaqs.map((faq) => faq.category)))];

export default function ChineseFaqClient() {
  const [activeCategory, setActiveCategory] = useState("全部");

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
          Hunter Alpha、Alpha 这条线，以及本站怎么把事实和声称分开。
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
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

      <NativeBanner />

      {/*
        与英文 FAQ 同样的理由：答案放在 <details> 里而不是 React state 里，
        这样正文和其中的内链都在服务端渲染的 HTML 中 —— 不点开也能被读到。
      */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <Card key={faq.question} className="px-6">
            <details className="group">
              <summary className="cursor-pointer list-none py-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-violet-400">{faq.category}</span>
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 shrink-0 transition-transform group-open:rotate-180"
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
                <h3 className="text-lg font-medium mt-2" style={{ color: "var(--foreground)" }}>
                  {faq.question}
                </h3>
              </summary>
              <div
                className="text-sm pb-6 pt-4 border-t"
                style={{ color: "var(--muted)", borderColor: "var(--card-border)" }}
              >
                <p>{faq.answer}</p>
                {faq.links && faq.links.length > 0 && (
                  <p className="mt-3">
                    {faq.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-violet-400 hover:underline mr-4 inline-block"
                      >
                        {link.label} →
                      </Link>
                    ))}
                  </p>
                )}
              </div>
            </details>
          </Card>
        ))}
      </div>
    </div>
  );
}
