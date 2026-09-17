"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/card";
import { NativeBanner } from "@/components/adsterra-ads";
// Same array the JSON-LD is built from — see lib/faq.ts for why that matters.
import { siteFaqs as faqs } from "@/lib/faq";

const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

export default function FAQClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        {/*
          Crawl path to the Chinese FAQ. hreflang alone does not create one, and
          /zh/faq had no inbound link from anywhere on the site.
        */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300">
            English
          </span>
          <Link
            href="/zh/faq"
            className="text-xs px-3 py-1 rounded-full border border-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            中文
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Frequently Asked Questions</span>
        </h1>
        <p className="max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          Hunter Alpha, the Alpha line, and how we separate facts from claims
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

      {/* Native Banner Ad - After category filter */}
      <NativeBanner />

      {/*
        FAQ list.

        Each row is a native <details>, not React state. That matters twice over:
        the answers and their internal links stay in the server-rendered HTML, so
        a crawler that never clicks still reads all ten; and a link inside a
        <button> (the previous structure) is invalid markup to begin with.
        Collapsing here is presentation only.
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
                <h3
                  className="text-lg font-medium mt-2"
                  style={{ color: "var(--foreground)" }}
                >
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
