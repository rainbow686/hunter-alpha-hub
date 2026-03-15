import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/evidence/[id]/like - 点赞线索
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if evidence exists
    const { data: existing } = await supabase
      .from('evidence')
      .select('id, likes')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
    }

    // Use RPC function to increment likes
    const { data, error } = await supabase
      .rpc('increment_likes', { evidence_id: id });

    if (error) {
      console.error('Failed to increment likes:', error);
      return NextResponse.json(
        { error: "Failed to like evidence" },
        { status: 500 }
      );
    }

    return NextResponse.json({ likes: data });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: "Failed to like evidence" },
      { status: 500 }
    );
  }
}
