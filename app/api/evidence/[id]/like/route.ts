import { NextRequest, NextResponse } from "next/server";
import { readEvidence, writeEvidence } from "@/lib/data";

// POST /api/evidence/[id]/like - 点赞线索
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const evidence = readEvidence();
    const index = evidence.findIndex((e) => e.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
    }

    evidence[index].likes += 1;
    writeEvidence(evidence);

    return NextResponse.json({ likes: evidence[index].likes });
  } catch {
    return NextResponse.json(
      { error: "Failed to like evidence" },
      { status: 500 }
    );
  }
}
