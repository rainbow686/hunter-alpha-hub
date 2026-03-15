export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  url: string;
  category: "Hunter Alpha" | "AI Analysis" | "Context Technology";
  description?: string;
}

// Hunter Alpha 相关视频和相关技术分析视频
export const featuredVideos: YouTubeVideo[] = [
  {
    id: "video-001",
    title: "Hunter Alpha - 1M Context AI Model Explained",
    channel: "AI Model Watch",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Hunter Alpha",
    description: "Deep dive into Hunter Alpha's 1M token context window and agentic capabilities"
  },
  {
    id: "video-002",
    title: "OpenRouter Hunter Alpha Review - Free 1T Parameter Model",
    channel: "AI Tools Hub",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Hunter Alpha",
    description: "Testing Hunter Alpha's capabilities and comparing with other free models"
  },
  {
    id: "video-003",
    title: "Hunter Alpha vs Claude - Which Free Model is Better?",
    channel: "LLM Compare",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Hunter Alpha",
    description: "Head-to-head comparison of Hunter Alpha and Claude on various tasks"
  },
  {
    id: "video-004",
    title: "1 Million Context Window AI - Game Changer or Hype?",
    channel: "AI Analysis Pro",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Context Technology",
    description: "Analyzing the practical benefits and limitations of ultra-long context windows"
  },
  {
    id: "video-005",
    title: "How to Use Long Context AI Models Effectively",
    channel: "Prompt Engineering",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Context Technology",
    description: "Best practices for leveraging 100K+ context windows in real applications"
  },
  {
    id: "video-006",
    title: "AI Model Architecture Explained - Transformers to Modern LLMs",
    channel: "Tech Explained",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    category: "AI Analysis",
    description: "Understanding how modern AI models like Hunter Alpha are built and trained"
  }
];
