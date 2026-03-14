export interface Evidence {
  id: string;
  title: string;
  description: string;
  nickname: string;
  evidenceUrl: string;
  likes: number;
  createdAt: string;
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
