"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/card";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import { Video } from "@/lib/types";

const VIDEOS_PER_PAGE = 9;

export default function VideosClient() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Hunter Alpha", "AI Analysis", "Context Technology"];

  // 加载视频
  const loadVideos = useCallback(async (offset: number, category: string, append: boolean = false) => {
    if (!append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        limit: VIDEOS_PER_PAGE.toString(),
        offset: offset.toString(),
      });

      if (category !== "All") {
        params.append("category", category);
      }

      const response = await fetch(`/api/videos?${params}`);
      const data = await response.json();

      if (data.length < VIDEOS_PER_PAGE) {
        setHasMore(false);
      }

      setVideos(prev => append ? [...prev, ...data] : data);
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadVideos(0, selectedCategory, false);
  }, [selectedCategory, loadVideos]);

  // 无限滚动加载
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadVideos(videos.length, selectedCategory, true);
    }
  };

  // 分类筛选改变时重置
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setHasMore(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Featured Videos</span>
        </h1>
        <p className="max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          Watch in-depth analysis, reviews, and discussions about Hunter Alpha and long-context AI technology
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-violet-500 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--muted)" }}>
          <div className="inline-block animate-spin">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="mt-4">Loading videos...</p>
        </div>
      ) : videos.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {videos.map((video) => (
              <YouTubeVideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  loadingMore
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-violet-500 text-white hover:bg-violet-600"
                }`}
              >
                {loadingMore ? "Loading..." : "Load More Videos"}
              </button>
            </div>
          )}

          {/* No More Videos */}
          {!hasMore && videos.length >= VIDEOS_PER_PAGE && (
            <div className="text-center py-8" style={{ color: "var(--muted)" }}>
              <p>You&apos;ve seen all videos!</p>
            </div>
          )}
        </>
      ) : (
        <Card className="p-12 text-center" style={{ color: "var(--muted)" }}>
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">No videos found</h3>
          <p>Try selecting a different category</p>
        </Card>
      )}
    </div>
  );
}
