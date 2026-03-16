import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/evidence/[id]/comments - 获取特定证据的评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const evidenceId = id;

    const { data: comments, error } = await supabase
      .from('evidence_comments')
      .select('*')
      .eq('evidence_id', evidenceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Comments fetch error:', error);
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 500 }
      );
    }

    return NextResponse.json(comments || []);
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/evidence/[id]/comments - 提交新评论
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const evidenceId = id;
    const body = await request.json();
    const { nickname, content } = body;

    if (!nickname || !content) {
      return NextResponse.json(
        { error: "Nickname and content are required" },
        { status: 400 }
      );
    }

    // 验证证据是否存在
    const { data: evidence } = await supabase
      .from('evidence')
      .select('id')
      .eq('id', evidenceId)
      .single();

    if (!evidence) {
      return NextResponse.json(
        { error: "Evidence not found" },
        { status: 404 }
      );
    }

    const { data: comment, error } = await supabase
      .from('evidence_comments')
      .insert({
        evidence_id: evidenceId,
        nickname,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error('Comment create error:', error);
      return NextResponse.json(
        { error: "Failed to create comment" },
        { status: 500 }
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Comment create error:', error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
