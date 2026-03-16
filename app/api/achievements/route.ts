import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/achievements - 获取成就定义列表
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('achievement_definitions')
      .select('*')
      .order('requirement');

    if (error) {
      console.error('Failed to fetch achievements:', error);
      return NextResponse.json(
        { error: "Failed to fetch achievements" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Achievements fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
