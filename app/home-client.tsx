"use client";

import Link from "next/link";
import { Card } from "@/components/card";
import { SubscriptionForm } from "@/components/subscription-form";
import { EvidenceCard } from "@/components/evidence-card";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import { HighlightCard } from "@/components/highlight-card";
import { NativeBanner } from "@/components/adsterra-ads";
import { Evidence, Video } from "@/lib/types";
import { BlogPost, getAllPosts } from "@/lib/blog";
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
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

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

    // 获取博客文章
    setFeaturedPosts(getAllPosts().slice(0, 6));
  }, []);

  const tlDrItems = [
    {
      question: "What is Hunter Alpha?",
      answer: "Hunter Alpha = Xiaomi's mimo-v2. It's a 1 trillion parameter AI with a 1M token context window — available free on OpenRouter since March 2026.",
    },
    {
      question: "Is it really free?",
      answer: "Yes, 100% free on OpenRouter. No credit card needed, no charges for prompts or completions.",
    },
    {
      question: "Is there a mimo-v2-pro?",
      answer: "Nope. As of late March 2026, only mimo-v2 exists. Search interest for 'mimo-v2-pro' is rising but Xiaomi hasn't announced a Pro version.",
    },
  ];

  const knownFacts = [
    {
      title: "1M Context Window",
      description: "1,048,576 tokens — roughly 700K words or 200+ pages. Paste entire books or codebases and get coherent answers.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "1 Trillion Parameters",
      description: "According to OpenRouter, mimo-v2 packs ~1T parameters for frontier-level reasoning capabilities.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Free to Use",
      description: "Currently free on OpenRouter with no charges. This could change, so experiment while it lasts.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Text-Only Model",
      description: "Processes text input and output only. No image analysis, but excels at long-document understanding.",
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
      description: "Books, legal contracts, technical manuals — paste it all. 1M context = ~700K words in a single prompt.",
      icon: "📄",
    },
    {
      title: "Codebase Review",
      description: "Multiple files in one go. Get refactoring suggestions, bug reports, and explanations.",
      icon: "💻",
    },
    {
      title: "Research Synthesis",
      description: "Load 10-20 papers and ask for comparisons, methodology extraction, and contradiction detection.",
      icon: "🔬",
    },
  ];

  return (
    <>
      {/* Identity Revealed Banner */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-4 px-4 mb-0">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white font-medium text-lg mb-1">
            Identity Revealed
          </p>
          <p className="text-emerald-100 text-sm">
            Hunter Alpha is confirmed to be <span className="font-semibold text-white">Xiaomi's mimo-v2</span> model. This site is now a <span className="font-medium text-white">community-driven resource hub</span> for mimo-v2 users.
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
          Community resource for <span className="font-mono" style={{ color: "var(--foreground)" }}>Xiaomi mimo-v2</span> — the 1M context AI model.
        </p>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-violet-400">
          Tutorials, guides, and tools for developers.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--accent)" }}>
            1M Context
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--accent)" }}>
            Free on OpenRouter
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--accent)" }}>
            Developer Tools
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
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>Evidence Submitted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-400">
                {stats?.totalLikes || 0}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>Community Likes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">
                {stats?.weeklyContributors || 0}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>Weekly Contributors</div>
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
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Community Spotlight</h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Featured discovery from the community</p>
          </div>
          <HighlightCard evidence={highlightedEvidence} />
        </section>
      )}

      {/* TL;DR Section - Quick Answers */}
      <section className="py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Quick Answers</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Common questions, answered in 30 seconds</p>
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
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>Key Specifications</h2>
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

      {/* Native Banner Ad */}
      <NativeBanner />

      {/* mimo-v2 Use Cases Section */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>Common Use Cases</h2>
        <p className="text-center mb-6 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          What mimo-v2 is best used for — real scenarios from developers
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
          In-depth analysis, reviews, and discussions about mimo-v2 and long-context AI technology
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
            Compare mimo-v2 with other AI models <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* Latest Evidence */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Community Submissions</h2>
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
            Access Guide <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-8">
        <Card className="p-8 glow-border" glow>
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="mb-2" style={{ color: "var(--muted)" }}>
            Join <span className="font-semibold text-violet-400">200+ subscribers</span> getting new mimo-v2 tutorials and guides.
          </p>
          <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>
            We send updates when new deep-dive articles drop. No spam, unsubscribe anytime.
          </p>
          <SubscriptionForm />
        </Card>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--foreground)" }}>Featured Articles</h2>
          <p className="text-lg" style={{ color: "var(--muted)" }}>
            Deep dives, tutorials, and practical guides for getting the most out of mimo-v2
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPosts.length > 0 ? featuredPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`rounded-xl border p-6 transition-colors hover:border-violet-500/50 ${
                index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-violet-900/30 text-violet-400 border border-violet-800">
                    {post.category}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    · {post.readTime} min read
                  </span>
                </div>

                <h3 className={`font-bold mb-3 hover:text-violet-400 transition-colors ${
                  index === 0 ? 'text-xl' : 'text-lg'
                }`} style={{ color: "var(--foreground)" }}>
                  {post.title}
                </h3>

                <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-violet-400 text-sm font-medium inline-flex items-center gap-1">
                    Read <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
            </article>
          )) : (
            // 骨架屏加载
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`rounded-xl border p-6 animate-pulse ${
                i === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`} style={{ borderColor: "var(--card-border)" }}>
                <div className="flex gap-2 mb-3">
                  <div className="h-5 w-16 bg-gray-800 rounded-full"></div>
                  <div className="h-5 w-20 bg-gray-800 rounded"></div>
                </div>
                <div className="h-6 w-3/4 bg-gray-800 rounded mb-3"></div>
                <div className="h-4 w-full bg-gray-800 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-800 rounded"></div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            View all articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 mt-8 border-t" style={{ borderColor: "var(--card-border)" }}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--foreground)" }}>
          About Hunter Alpha / Xiaomi mimo-v2
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3" style={{ color: "var(--foreground)" }}>
              What is Hunter Alpha / Xiaomi mimo-v2?
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Hunter Alpha is Xiaomi's mimo-v2 model — a 1 trillion parameter AI with a 1M token context window.
              It appeared on OpenRouter in March 2026 and was initially a mystery. The community investigation solved that mystery:
              Hunter Alpha = Xiaomi mimo-v2.
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              This site started as a mystery tracker. Now it's a resource for developers and researchers using mimo-v2.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3" style={{ color: "var(--foreground)" }}>
              How to access mimo-v2
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Go to <a href="https://openrouter.ai" className="text-violet-400 hover:underline">openrouter.ai</a>, search for "mimo-v2" or "Hunter Alpha", and start using it.
              No credit card needed — it's free.
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              The 1M context means you can paste entire books, codebases, or long transcripts and get coherent answers.
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
              1,048,576 token context window (1M tokens) — roughly 700K words or 200+ pages
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              ~1 Trillion parameters
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              Free on OpenRouter (no credit card required)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              Text-only (no image input/output)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              Best for: long document analysis, codebase review, research synthesis
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-400">•</span>
              Response time: 20-60 seconds for long contexts
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
            Read in-depth guides and tutorials
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
