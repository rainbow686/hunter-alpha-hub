"use client";

import Link from "next/link";
import { Card } from "@/components/card";
import { BlogPost, getAllPosts } from "@/lib/blog";
import { useState, useEffect } from "react";

const allPosts = getAllPosts();

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(allPosts.map(post => post.category)))];

  const filteredPosts = selectedCategory === "All"
    ? allPosts
    : allPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Hunter Alpha Blog</span>
        </h1>
        <p className="text-lg" style={{ color: "var(--muted)" }}>
          In-depth articles, guides, and analysis about the mysterious AI model
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-violet-500 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6">
        {filteredPosts.map(post => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12" style={{ color: "var(--muted)" }}>
          <p>No posts in this category yet.</p>
        </div>
      )}
    </div>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="p-6 hover:border-violet-500/50 transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs px-3 py-1 rounded-full bg-violet-900/30 text-violet-400 border border-violet-800">
            {post.category}
          </span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            · {post.readTime} min read
          </span>
        </div>

        <h2 className="text-xl font-bold mb-2 hover:text-violet-400 transition-colors" style={{ color: "var(--foreground)" }}>
          {post.title}
        </h2>

        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                #{tag}
              </span>
            ))}
          </div>

          <span className="text-violet-400 text-sm font-medium inline-flex items-center gap-1">
            Read more <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </span>
        </div>
      </Card>
    </Link>
  );
}
