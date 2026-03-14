import { NextRequest, NextResponse } from "next/server";
import { readEvidence, writeEvidence } from "@/lib/data";
import { Evidence } from "@/lib/types";

// GET /api/evidence - 获取线索列表
export async function GET() {
  const evidence = readEvidence();
  // 按时间倒序排列
  const sorted = evidence.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}

// POST /api/evidence - 提交新线索
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, nickname, evidenceUrl } = body;

    if (!title || !description || !nickname) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const evidence = readEvidence();
    const newEvidence: Evidence = {
      id: crypto.randomUUID(),
      title,
      description,
      nickname,
      evidenceUrl: evidenceUrl || "",
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    evidence.push(newEvidence);
    writeEvidence(evidence);

    return NextResponse.json(newEvidence, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit evidence" },
      { status: 500 }
    );
  }
}
