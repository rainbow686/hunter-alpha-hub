import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/achievements/[nickname] - 获取用户的成就
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  try {
    const { nickname } = await params;

    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('nickname', nickname)
      .order('achieved_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch user achievements:', error);
      return NextResponse.json(
        { error: "Failed to fetch user achievements" },
        { status: 500 }
      );
    }

    // 获取成就定义
    const { data: definitions } = await supabase
      .from('achievement_definitions')
      .select('*');

    const achievementMap = new Map(definitions?.map(d => [d.type, d]));

    const achievements = data?.map(a => ({
      ...a,
      definition: achievementMap.get(a.achievement_type),
    })) || [];

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('User achievements fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch user achievements" },
      { status: 500 }
    );
  }
}
