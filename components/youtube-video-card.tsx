"use client";

import { YouTubeVideo } from "@/lib/videos";

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
}

const categoryColors = {
  "Hunter Alpha": "bg-red-900/50 text-red-400 border-red-800",
  "AI Analysis": "bg-blue-900/50 text-blue-400 border-blue-800",
  "Context Technology": "bg-purple-900/50 text-purple-400 border-purple-800",
};

export function YouTubeVideoCard({ video }: YouTubeVideoCardProps) {
  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^&?/]+)/);
    return match ? match[1] : "";
  };

  const videoId = getYoutubeId(video.url);

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg overflow-hidden transition-transform hover:scale-105"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
        borderWidth: "1px",
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to hqdefault if maxresdefault doesn't exist
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* YouTube Logo Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-red-600 text-white text-xs font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          YouTube
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[video.category]}`}>
          {video.category}
        </span>

        {/* Title */}
        <h3 className="text-base font-medium mt-3 line-clamp-2" style={{ color: "var(--foreground)" }}>
          {video.title}
        </h3>

        {/* Channel */}
        <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
          {video.channel}
        </p>

        {/* Description */}
        {video.description && (
          <p className="text-sm mt-2 line-clamp-2" style={{ color: "var(--muted)" }}>
            {video.description}
          </p>
        )}

        {/* External Link Icon */}
        <div className="mt-3 flex items-center gap-1 text-sm text-violet-400 group-hover:text-violet-300 transition-colors">
          <span>Watch on YouTube</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </a>
  );
}
