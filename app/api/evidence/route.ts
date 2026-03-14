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
    const { title, description, nickname, evidenceUrl, importance } = body;

    // Validate required fields
    if (!title || !description || !nickname) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate importance if provided
    const validImportance = ["High", "Medium", "Low"];
    const trimmedImportance = importance && validImportance.includes(importance) ? importance : "Medium";

    // Validate title
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 5) {
      return NextResponse.json(
        { error: "Title must be at least 5 characters" },
        { status: 400 }
      );
    }
    if (trimmedTitle.length > 100) {
      return NextResponse.json(
        { error: "Title must be less than 100 characters" },
        { status: 400 }
      );
    }

    // Validate description
    const trimmedDescription = description.trim();
    if (trimmedDescription.length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters" },
        { status: 400 }
      );
    }
    if (trimmedDescription.length > 500) {
      return NextResponse.json(
        { error: "Description must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Validate nickname
    const trimmedNickname = nickname.trim();
    if (trimmedNickname.length < 2) {
      return NextResponse.json(
        { error: "Nickname must be at least 2 characters" },
        { status: 400 }
      );
    }
    if (trimmedNickname.length > 30) {
      return NextResponse.json(
        { error: "Nickname must be less than 30 characters" },
        { status: 400 }
      );
    }
    if (!/^[a-zA-Z0-9_\s]+$/.test(trimmedNickname)) {
      return NextResponse.json(
        { error: "Nickname can only contain letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    // Validate evidence URL (if provided)
    if (evidenceUrl && !/^https?:\/\/.+$/.test(evidenceUrl)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const evidence = readEvidence();
    const newEvidence: Evidence = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      description: trimmedDescription,
      nickname: trimmedNickname,
      evidenceUrl: evidenceUrl || "",
      likes: 0,
      createdAt: new Date().toISOString(),
      importance: trimmedImportance,
    };

    evidence.push(newEvidence);
    writeEvidence(evidence);

    return NextResponse.json(newEvidence, { status: 201 });
  } catch (error) {
    console.error("Evidence submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit evidence" },
      { status: 500 }
    );
  }
}
