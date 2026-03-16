import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { EvidenceDB, fromEvidenceDB } from "@/lib/types";

// GET /api/evidence/[id]/related - 获取相关证据
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const evidenceId = params.id;

    // 获取当前证据
    const { data: currentEvidence, error: fetchError } = await supabase
      .from('evidence')
      .select('*')
      .eq('id', evidenceId)
      .single();

    if (fetchError || !currentEvidence) {
      console.error('Failed to fetch current evidence:', fetchError);
      return NextResponse.json(
        { error: "Evidence not found" },
        { status: 404 }
      );
    }

    // 获取相关证据：相同重要性 OR 相同作者 OR 时间接近（前后 7 天内）
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const timeWindow = new Date(currentEvidence.created_at).getTime();
    const startTime = new Date(timeWindow - sevenDays).toISOString();
    const endTime = new Date(timeWindow + sevenDays).toISOString();

    const { data: relatedData, error } = await supabase
      .from('evidence')
      .select('*')
      .neq('id', evidenceId)
      .or(`importance.eq.${currentEvidence.importance},nickname.eq.${currentEvidence.nickname}`)
      .gte('created_at', startTime)
      .lte('created_at', endTime)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Failed to fetch related evidence:', error);
      return NextResponse.json(
        { error: "Failed to fetch related evidence" },
        { status: 500 }
      );
    }

    // 如果没有找到相关证据，尝试只按重要性推荐
    if (!relatedData || relatedData.length === 0) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('evidence')
        .select('*')
        .eq('importance', currentEvidence.importance)
        .neq('id', evidenceId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (fallbackError) {
        console.error('Failed to fetch fallback evidence:', fallbackError);
        return NextResponse.json([]);
      }

      const evidence = (fallbackData as EvidenceDB[] || []).map(fromEvidenceDB);
      return NextResponse.json(evidence);
    }

    const evidence = (relatedData as EvidenceDB[] || []).map(fromEvidenceDB);
    return NextResponse.json(evidence);
  } catch (error) {
    console.error('Related evidence fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch related evidence" },
      { status: 500 }
    );
  }
}
