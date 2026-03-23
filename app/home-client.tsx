"use client";

import Link from "next/link";
import { Card } from "@/components/card";
import { SubscriptionForm } from "@/components/subscription-form";
import { EvidenceCard } from "@/components/evidence-card";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import { HighlightCard } from "@/components/highlight-card";
import { NewbieGuide } from "@/components/newbie-guide";
import { Evidence, Video } from "@/lib/types";
import { useState, useEffect } from "react";

interface CommunityStats {
  totalEvidence: number;
  totalLikes: number;
  weeklyContributors: number;
  totalVideos: number;
}

export default function HomeClient() {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);
  const [highlightedEvidence, setHighlightedEvidence] = useState<Evidence | null>(null);
  const [stats, setStats] = useState<CommunityStats | null>(null);

  useEffect(() => {
    // 并行获取所有数据
    Promise.all([
      fetch('/api/evidence?limit=3')
        .then(res => res.json())
        .catch(err => { console.error('Failed to fetch evidence:', err); return []; }),
      fetch('/api/videos?limit=3')
        .then(res => res.json())
        .catch(err => { console.error('Failed to fetch videos:', err); return []; }),
      fetch('/api/evidence?featured=true')
        .then(res => res.json())
        .catch(err => { console.error('Failed to fetch featured evidence:', err); return null; }),
      fetch('/api/stats')
        .then(res => res.json())
        .catch(err => { console.error('Failed to fetch stats:', err); return null; })
    ]).then(([evidenceData, videoData, featuredData, statsData]) => {
      setEvidenceList(evidenceData.slice(0, 3));
      setLatestVideos(videoData);
      setHighlightedEvidence(featuredData);
      setStats(statsData);
    });
  }, []);

  const tlDrItems = [
    {
      question: "What is Hunter Alpha?",
      answer: "Hunter Alpha is now confirmed to be Xiaomi's mimo-v2 model - a 1 Trillion parameter AI with 1M token context window, available free on OpenRouter.",
    },
    {
      question: "Is Hunter Alpha free?",
      answer: "Yes, Hunter Alpha (mimo-v2) is currently 100% free on OpenRouter with no costs for prompts or completions.",
    },
    {
      question: "Is there a mimo-v2-pro?",
      answer: "No. As of March 2026, only mimo-v2 exists. Search interest for 'mimo-v2-pro' is surging but no Pro version has been announced by Xiaomi.",
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

  const mimoV2UseCases = [
    {
      title: "Long Document Analysis",
      description: "Process entire books, legal contracts, or technical manuals in a single prompt. 1M context means ~700,000 words.",
      icon: "📄",
    },
    {
      title: "Codebase Review",
      description: "Paste multiple files for comprehensive code review, refactoring suggestions, and bug detection.",
      icon: "💻",
    },
    {
      title: "Research Synthesis",
      description: "Compare findings across multiple research papers, extract methodologies, and identify contradictions.",
      icon: "🔬",
    },
  ];

  return (
    <>
      <NewbieGuide />
      {/* Identity Revealed Banner */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-4 px-4 mb-0">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white font-medium text-lg mb-1">
            Identity Revealed
          </p>
          <p className="text-emerald-100 text-sm">
            Hunter Alpha is confirmed to be <span className="font-semibold text-white">Xiaomi's mimo-v2</span> model. This site is now an archive of the investigation.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">
          <span className="gradient-text">Hunter Alpha</span> Hub
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-2" style={{ color: "var(--muted)" }}>
          Now serving as a community resource for <span className="font-mono" style={{ color: "var(--foreground)" }}>Xiaomi mimo-v2</span> users.
        </p>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-violet-400">
          Join <span className="font-bold">500+ users</span> exploring 1M context AI capabilities.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--accent)" }}>
            1M Context AI
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--accent)" }}>
            Free to Use
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--accent)" }}>
            Community Resources
          </span>
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="py-6 mb-8">
        <Card className="p-6" >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-violet-400">
                {stats?.totalEvidence || 0}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>Total Evidence</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-400">
                {stats?.totalLikes || 0}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>Total Likes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">
                {stats?.weeklyContributors || 0}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>Active Detectives</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">
                {stats?.totalVideos || 0}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>Videos</div>
            </div>
          </div>
        </Card>
      </section>

      {/* Today's Highlight Section */}
      {highlightedEvidence && (
        <section className="py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Today&apos;s Highlight</h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>The most important evidence discovered today</p>
          </div>
          <HighlightCard evidence={highlightedEvidence} />
        </section>
      )}

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
        <div className="text-center">
          <Link href="/faq" className="text-violet-400 hover:text-violet-300 text-sm inline-flex items-center gap-1">
            See all FAQs <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
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
        <div className="text-center">
          <Link href="/monitor" className="text-violet-400 hover:text-violet-300 text-sm inline-flex items-center gap-1">
            View real-time model status <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* mimo-v2 Use Cases Section */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>mimo-v2 Use Cases</h2>
        <p className="text-center mb-6 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          What makes Xiaomi mimo-v2 unique — and when to use it
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {mimoV2UseCases.map((useCase, index) => (
            <Card key={index} className="p-6">
              <div className="text-3xl mb-3">{useCase.icon}</div>
              <h3 className="font-medium mb-2" style={{ color: "var(--foreground)" }}>{useCase.title}</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{useCase.description}</p>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Link href="/blog/xiaomi-mimo-v2-complete-guide" className="text-violet-400 hover:text-violet-300 text-sm inline-flex items-center gap-1">
            Read complete guide <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
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
        <div className="text-center mt-6">
          <Link href="/comparison" className="text-violet-400 hover:text-violet-300 text-sm inline-flex items-center gap-1">
            Compare Hunter Alpha with other AI models <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
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
        <div className="text-center mt-6">
          <Link href="/access" className="text-violet-400 hover:text-violet-300 text-sm inline-flex items-center gap-1">
            How to access Hunter Alpha <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-8">
        <Card className="p-8 glow-border" glow>
          <h2 className="text-2xl font-bold mb-2">Get Notified</h2>
          <p className="mb-2" style={{ color: "var(--muted)" }}>
            Join <span className="font-semibold text-violet-400">200+ subscribers</span>. Be first to know when Hunter Alpha&apos;s identity is revealed.
          </p>
          <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>
            We&apos;ll send you a single email when the mystery is solved. No spam, unsubscribe anytime.
          </p>
          <SubscriptionForm />
        </Card>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>Latest from the Blog</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Breaking
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>March 23, 2026</span>
            </div>
            <h3 className="font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Is There a mimo-v2-pro? What We Know
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Search interest in 'mimo-v2-pro' is surging. We clarify: there is no Pro version. Only mimo-v2 exists.
            </p>
            <Link href="/blog/is-there-mimo-v2-pro-explained" className="text-violet-400 hover:text-violet-300 text-sm inline-flex items-center gap-1">
              Read more <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                中文
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>March 23, 2026</span>
            </div>
            <h3 className="font-medium mb-2" style={{ color: "var(--foreground)" }}>
              小米 mimo-v2 完全指南 (Chinese Guide)
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              小米 mimo-v2 完全使用指南，包含 OpenRouter 访问方法、代码示例和典型使用场景。
            </p>
            <Link href="/blog/xiaomi-mimo-v2-chinese-guide" className="text-violet-400 hover:text-violet-300 text-sm inline-flex items-center gap-1">
              阅读指南 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </Card>
        </div>
        <div className="text-center">
          <Link href="/blog" className="text-violet-400 hover:text-violet-300 text-sm inline-flex items-center gap-1">
            View all blog posts <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 mt-8 border-t" style={{ borderColor: "var(--card-border)" }}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>
          About Hunter Alpha AI Model
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3" style={{ color: "var(--foreground)" }}>
              What is Hunter Alpha?
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Hunter Alpha is a mysterious 1 Trillion parameter AI language model with an unprecedented 1M token context window.
              Discovered on OpenRouter in March 2026, it has captivated the AI community with its advanced capabilities and unknown origins.
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              The model excels at agentic tasks including long-horizon planning, complex reasoning, and multi-step task execution,
              making it a powerful tool for developers and researchers.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3" style={{ color: "var(--foreground)" }}>
              How to Use Hunter Alpha
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Access Hunter Alpha through OpenRouter, a unified API platform for AI models.
              Simply create an account at openrouter.ai, search for Hunter Alpha, and start using it via API or compatible interfaces.
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Currently, Hunter Alpha is free to use with no charges for prompts or completions, making it accessible for experimentation and development.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3" style={{ color: "var(--foreground)" }}>
            Key Features & Specifications
          </h3>
          <ul className="grid md:grid-cols-2 gap-2 text-sm" style={{ color: "var(--muted)" }}>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              1,048,576 token context window (1M tokens)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              Approximately 1 Trillion parameters
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              Free to use on OpenRouter
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              Text-only input and output
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              Optimized for agentic use cases
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              Supports long-horizon planning
            </li>
          </ul>
        </div>
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Read our blog for in-depth guides and analysis
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
