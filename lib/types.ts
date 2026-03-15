export interface Evidence {
  id: string;
  title: string;
  description: string;
  nickname: string;
  evidenceUrl: string;
  externalDiscussionUrl?: string;
  likes: number;
  createdAt: string;
  importance?: "High" | "Medium" | "Low";
}

// Supabase 数据库返回的原始格式（snake_case）
export interface EvidenceDB {
  id: string;
  title: string;
  description: string;
  nickname: string;
  evidence_url: string | null;
  external_discussion_url: string | null;
  likes: number;
  created_at: string;
  importance: "High" | "Medium" | "Low";
}

// 从数据库格式转换为应用格式
export function fromEvidenceDB(db: EvidenceDB): Evidence {
  return {
    id: db.id,
    title: db.title,
    description: db.description,
    nickname: db.nickname,
    evidenceUrl: db.evidence_url || "",
    externalDiscussionUrl: db.external_discussion_url || undefined,
    likes: db.likes,
    createdAt: db.created_at,
    importance: db.importance,
  };
}

// 视频接口
export interface Video {
  id: string;
  title: string;
  channel: string;
  videoUrl: string;
  category: "Hunter Alpha" | "AI Analysis" | "Context Technology";
  description?: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  viewCount?: number;
  durationSeconds?: number;
  isFeatured?: boolean;
  createdAt: string;
}

// Supabase 视频表原始格式
export interface VideoDB {
  id: string;
  title: string;
  channel: string;
  video_url: string;
  category: "Hunter Alpha" | "AI Analysis" | "Context Technology";
  description: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  view_count: number;
  duration_seconds: number | null;
  is_featured: boolean;
  created_at: string;
}

// 从数据库格式转换为应用格式
export function fromVideoDB(db: VideoDB): Video {
  return {
    id: db.id,
    title: db.title,
    channel: db.channel,
    videoUrl: db.video_url,
    category: db.category,
    description: db.description || undefined,
    thumbnailUrl: db.thumbnail_url || undefined,
    publishedAt: db.published_at || undefined,
    viewCount: db.view_count,
    durationSeconds: db.duration_seconds || undefined,
    isFeatured: db.is_featured,
    createdAt: db.created_at,
  };
}

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

export interface ModelStatus {
  online: boolean;
  lastSeen: string;
  specs: {
    parameters: string;
    contextWindow: string;
    multimodal: boolean;
  };
}
