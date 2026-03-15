export interface Evidence {
  id: string;
  title: string;
  description: string;
  nickname: string;
  evidenceUrl: string;
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
    likes: db.likes,
    createdAt: db.created_at,
    importance: db.importance,
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
