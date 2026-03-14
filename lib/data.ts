import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { Evidence, Subscriber } from "./types";

const dataDir = join(process.cwd(), "data");

// 初始种子数据（当 data/evidence.json 不存在时使用）
const SEED_EVIDENCE: Evidence[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Hunter Alpha mentions 1M context in response",
    description: "User reported that Hunter Alpha explicitly mentioned having 1M context window in a conversation about document analysis.",
    nickname: "ContextHunter",
    evidenceUrl: "https://openrouter.ai/openrouter/hunter-alpha",
    likes: 33,
    createdAt: "2026-03-10T14:30:00.000Z",
    importance: "High"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "1 Trillion parameters according to OpenRouter",
    description: "OpenRouter official description states Hunter Alpha is a 1 Trillion parameter model, built for agentic use cases.",
    nickname: "ParameterDetective",
    evidenceUrl: "https://openrouter.ai/openrouter/hunter-alpha",
    likes: 72,
    createdAt: "2026-03-12T16:45:00.000Z",
    importance: "High"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Free pricing confirmed",
    description: "Hunter Alpha is listed with $0 prompt and completion pricing on OpenRouter, making it completely free to use.",
    nickname: "BudgetAI",
    evidenceUrl: "https://openrouter.ai/api/v1/models",
    likes: 46,
    createdAt: "2026-03-12T09:15:00.000Z",
    importance: "Medium"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    title: "Text-only architecture",
    description: "Architecture specs show Hunter Alpha only supports text input/output, no image or audio capabilities.",
    nickname: "ArchitectureWatch",
    evidenceUrl: "https://openrouter.ai/openrouter/hunter-alpha",
    likes: 28,
    createdAt: "2026-03-13T11:20:00.000Z",
    importance: "Medium"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    title: "Added to OpenRouter on March 12, 2026",
    description: "Unix timestamp 1773260671 converts to March 12, 2026 - this is when Hunter Alpha was officially added to OpenRouter.",
    nickname: "TimelineKeeper",
    evidenceUrl: "https://openrouter.ai/api/v1/models",
    likes: 51,
    createdAt: "2026-03-13T14:00:00.000Z",
    importance: "High"
  }
];

export function readEvidence(): Evidence[] {
  const filePath = join(dataDir, "evidence.json");
  if (!existsSync(filePath)) {
    return SEED_EVIDENCE;
  }
  const file = readFileSync(filePath, "utf-8");
  const data = JSON.parse(file);
  // 如果文件为空数组，返回种子数据
  return data.length === 0 ? SEED_EVIDENCE : data;
}

export function writeEvidence(data: Evidence[]): void {
  const filePath = join(dataDir, "evidence.json");
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function readSubscribers(): Subscriber[] {
  const filePath = join(dataDir, "subscribers.json");
  if (!existsSync(filePath)) {
    return [];
  }
  const file = readFileSync(filePath, "utf-8");
  return JSON.parse(file).subscribers || [];
}

export function writeSubscribers(data: Subscriber[]): void {
  const filePath = join(dataDir, "subscribers.json");
  writeFileSync(filePath, JSON.stringify({ subscribers: data }, null, 2));
}
