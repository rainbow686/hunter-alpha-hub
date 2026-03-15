import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/evidence/[id]/like - 点赞线索
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment likes using Supabase
    const { data, error } = await supabase
      .from('evidence')
      .update({ likes: supabase.rpc('increment_likes', { evidence_id: id }) })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Fallback: read current likes and increment
      const { data: current } = await supabase
        .from('evidence')
        .select('likes')
        .eq('id', id)
        .single();

      if (!current) {
        return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
      }

      const { data: updated, error: updateError } = await supabase
        .from('evidence')
        .update({ likes: current.likes + 1 })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update likes:', updateError);
        return NextResponse.json(
          { error: "Failed to like evidence" },
          { status: 500 }
        );
      }

      return NextResponse.json({ likes: updated.likes });
    }

    return NextResponse.json({ likes: data.likes });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: "Failed to like evidence" },
      { status: 500 }
    );
  }
}
