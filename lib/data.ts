import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { Evidence, Subscriber } from "./types";

const dataDir = join(process.cwd(), "data");

export function readEvidence(): Evidence[] {
  const filePath = join(dataDir, "evidence.json");
  if (!existsSync(filePath)) {
    return [];
  }
  const file = readFileSync(filePath, "utf-8");
  return JSON.parse(file);
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
