import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { EvidenceDB, fromEvidenceDB } from "@/lib/types";

// GET /api/evidence - 获取线索列表
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch evidence:', error);
      return NextResponse.json(
        { error: "Failed to fetch evidence" },
        { status: 500 }
      );
    }

    // 转换数据库格式为应用格式
    const evidence = (data as EvidenceDB[] || []).map(fromEvidenceDB);
    return NextResponse.json(evidence);
  } catch (error) {
    console.error('Evidence fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch evidence" },
      { status: 500 }
    );
  }
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

    // Validate importance
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

    // Insert into Supabase
    const { data, error } = await supabase
      .from('evidence')
      .insert([{
        title: trimmedTitle,
        description: trimmedDescription,
        nickname: trimmedNickname,
        evidence_url: evidenceUrl || null,
        importance: trimmedImportance,
        likes: 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: "Failed to submit evidence" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      nickname: data.nickname,
      evidenceUrl: data.evidence_url,
      likes: data.likes,
      createdAt: data.created_at,
      importance: data.importance,
    }, { status: 201 });
  } catch (error) {
    console.error("Evidence submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit evidence" },
      { status: 500 }
    );
  }
}
