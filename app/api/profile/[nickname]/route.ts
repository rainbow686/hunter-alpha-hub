import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/profile/[nickname] - 获取用户个人资料
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  try {
    const { nickname } = await params;

    // 获取用户提交的证据
    const { data: evidence, error: evidenceError } = await supabase
      .from('evidence')
      .select('*')
      .eq('nickname', nickname)
      .order('created_at', { ascending: false });

    if (evidenceError) {
      console.error('Evidence fetch error:', evidenceError);
      return NextResponse.json(
        { error: "Failed to fetch user evidence" },
        { status: 500 }
      );
    }

    // 获取用户的成就
    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_type, achieved_at, metadata')
      .eq('nickname', nickname);

    if (achievementsError) {
      console.error('Achievements fetch error:', achievementsError);
    }

    // 获取成就定义
    const { data: achievementDefinitions } = await supabase
      .from('achievement_definitions')
      .select('*');

    // 计算统计
    const stats = {
      totalEvidence: evidence?.length || 0,
      totalLikes: evidence?.reduce((sum, e) => sum + (e.likes || 0), 0) || 0,
      highImportanceCount: evidence?.filter(e => e.importance === 'High').length || 0,
      mediumImportanceCount: evidence?.filter(e => e.importance === 'Medium').length || 0,
      lowImportanceCount: evidence?.filter(e => e.importance === 'Low').length || 0,
    };

    // 合并成就信息
    const achievementsWithDetails = achievements?.map(ach => {
      const def = achievementDefinitions?.find(d => d.type === ach.achievement_type);
      return {
        ...ach,
        name: def?.name,
        description: def?.description,
        icon: def?.icon,
      };
    }) || [];

    return NextResponse.json({
      nickname,
      evidence: evidence || [],
      achievements: achievementsWithDetails,
      stats,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
