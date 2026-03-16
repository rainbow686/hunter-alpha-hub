import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/achievements/check - 检查并授予用户成就
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nickname, achievementType, metadata = {} } = body;

    if (!nickname || !achievementType) {
      return NextResponse.json(
        { error: "Nickname and achievementType are required" },
        { status: 400 }
      );
    }

    // 检查是否已经拥有该成就
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('nickname', nickname)
      .eq('achievement_type', achievementType)
      .single();

    if (existing) {
      return NextResponse.json({ granted: false, message: "Already has achievement" });
    }

    // 授予成就
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        nickname,
        achievement_type: achievementType,
        metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to grant achievement:', error);
      return NextResponse.json(
        { error: "Failed to grant achievement" },
        { status: 500 }
      );
    }

    // 获取成就定义
    const { data: definition } = await supabase
      .from('achievement_definitions')
      .select('*')
      .eq('type', achievementType)
      .single();

    return NextResponse.json({
      granted: true,
      achievement: {
        ...data,
        definition,
      },
    });
  } catch (error) {
    console.error('Achievement grant error:', error);
    return NextResponse.json(
      { error: "Failed to grant achievement" },
      { status: 500 }
    );
  }
}
