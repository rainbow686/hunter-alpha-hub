"use client";

import Link from "next/link";
import { Card } from "@/components/card";
import { SubscriptionForm } from "@/components/subscription-form";
import { EvidenceCard } from "@/components/evidence-card";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import { Evidence, Video } from "@/lib/types";
import { useState, useEffect } from "react";

export default function Home() {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);

  useEffect(() => {
    // 获取最新 3 条证据
    fetch('/api/evidence')
      .then(res => res.json())
      .then(data => setEvidenceList(data.slice(0, 3)))
      .catch(err => console.error('Failed to fetch evidence:', err));

    // 获取最新 3 个视频
    fetch('/api/videos?limit=3')
      .then(res => res.json())
      .then(data => setLatestVideos(data))
      .catch(err => console.error('Failed to fetch videos:', err));
  }, []);

  const tlDrItems = [
    {
      question: "What is Hunter Alpha?",
      answer: "Hunter Alpha is a 1 Trillion parameter AI model with 1M token context window, available free on OpenRouter. It's designed for agentic use cases including long-horizon planning, complex reasoning, and multi-step task execution.",
    },
    {
      question: "Is Hunter Alpha free?",
      answer: "Yes, Hunter Alpha is currently 100% free on OpenRouter with no costs for prompts or completions.",
    },
    {
      question: "Who created Hunter Alpha?",
      answer: "The creator remains unknown. OpenRouter lists the provider simply as 'Hunter Alpha' with no additional company information.",
    },
  ];

  const knownFacts = [
    {
      title: "1M Context Window",
      description: "Hunter Alpha supports 1,048,576 tokens context length, enabling long-horizon planning and sustained multi-step task execution.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "1 Trillion Parameters",
      description: "According to OpenRouter, Hunter Alpha is built with approximately 1T parameters for frontier intelligence.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Free to Use",
      description: "Currently available at no cost on OpenRouter with free prompt and completion tokens.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Text-Only Model",
      description: "Hunter Alpha processes text input and output only, optimized for agentic use cases and complex reasoning.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
  ];

  const popularTheories = [
    {
      title: "Claude 3.5 Sonnet Variant",
      description: "Performance characteristics suggest a heavily modified Sonnet base with specialized RLHF training focused on roleplay scenarios.",
      confidence: "Medium",
    },
    {
      title: "Custom Fine-tune",
      description: "Could be a custom fine-tuned model trained on specific datasets for character embodiment and emotional responses.",
      confidence: "High",
    },
    {
      title: "Proprietary Architecture",
      description: "Some outputs show unusual patterns not seen in known models, suggesting potentially novel architecture.",
      confidence: "Low",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">
          <span className="gradient-text">Hunter Alpha</span> Hub
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-6" style={{ color: "var(--muted)" }}>
          Tracking the <span className="font-mono" style={{ color: "var(--foreground)" }}>Hunter Alpha</span> identity mystery.
          Submit evidence, discuss clues, and stay updated.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--accent)" }}>
            AI Mystery
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--accent)" }}>
            Community Investigation
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--accent)" }}>
            Open Source Intelligence
          </span>
        </div>
      </section>

      {/* TL;DR Section - Quick Answers */}
      <section className="py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>TL;DR - Quick Answers</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Everything you need to know in 30 seconds</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {tlDrItems.map((item, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-medium mb-3 text-violet-400">{item.question}</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Known Facts Section */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>Known Facts</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {knownFacts.map((fact, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--card-bg)", color: "var(--accent)" }}>
                  {fact.icon}
                </div>
                <div>
                  <h3 className="font-medium mb-2" style={{ color: "var(--foreground)" }}>{fact.title}</h3>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>{fact.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Theories Section */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>Popular Theories</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {popularTheories.map((theory, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium" style={{ color: "var(--foreground)" }}>{theory.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  theory.confidence === "High"
                    ? "bg-green-900/50 text-green-400"
                    : theory.confidence === "Medium"
                    ? "bg-yellow-900/50 text-yellow-400"
                    : "bg-gray-700 text-gray-400"
                }`}>
                  {theory.confidence}
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{theory.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Featured Videos</h2>
          <Link
            href="/videos"
            className="text-violet-400 hover:text-violet-300 text-sm"
          >
            View all →
          </Link>
        </div>
        <p className="mb-8 max-w-2xl" style={{ color: "var(--muted)" }}>
          Watch in-depth analysis, reviews, and discussions about Hunter Alpha and long-context AI technology
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestVideos.length > 0 ? (
            latestVideos.map((video) => (
              <YouTubeVideoCard key={video.id} video={video} />
            ))
          ) : (
            <div className="col-span-full text-center py-8" style={{ color: "var(--muted)" }}>
              Loading videos...
            </div>
          )}
        </div>
      </section>

      {/* Latest Evidence */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Latest Evidence</h2>
          <Link
            href="/evidence"
            className="text-violet-400 hover:text-violet-300 text-sm"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-4">
          {evidenceList.length > 0 ? (
            evidenceList.map((evidence) => (
              <EvidenceCard key={evidence.id} evidence={evidence} />
            ))
          ) : (
            <Card className="p-8 text-center" style={{ color: "var(--muted)" }}>
              No evidence submitted yet. Be the first!
            </Card>
          )}
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-8">
        <Card className="p-8 glow-border" glow>
          <h2 className="text-2xl font-bold mb-2">Get Notified</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Subscribe to receive an email when Hunter Alpha&apos;s identity is revealed.
          </p>
          <SubscriptionForm />
        </Card>
      </section>
    </div>
  );
}
