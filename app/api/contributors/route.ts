import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/contributors - 获取贡献者排行榜
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "all";

    // 计算时间范围
    let dateFilter = "";
    if (range === "week") {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      dateFilter = `.gte('created_at', '${weekAgo}')`;
    } else if (range === "month") {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      dateFilter = `.gte('created_at', '${monthAgo}')`;
    }

    // 获取所有证据（带时间过滤）
    let query = supabase
      .from('evidence')
      .select('nickname, likes, importance');

    if (range === "week" || range === "month") {
      const startDate = range === "week"
        ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('created_at', startDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch contributors:', error);
      return NextResponse.json(
        { error: "Failed to fetch contributors" },
        { status: 500 }
      );
    }

    // 按 nickname 聚合数据
    const stats = new Map<string, { evidenceCount: number; totalLikes: number; highImportanceCount: number }>();

    data?.forEach((item: any) => {
      const existing = stats.get(item.nickname) || { evidenceCount: 0, totalLikes: 0, highImportanceCount: 0 };
      existing.evidenceCount += 1;
      existing.totalLikes += item.likes || 0;
      if (item.importance === "High") {
        existing.highImportanceCount += 1;
      }
      stats.set(item.nickname, existing);
    });

    // 转换为数组并排序
    const contributors = Array.from(stats.entries())
      .map(([nickname, stats]) => ({
        nickname,
        ...stats,
      }))
      .sort((a, b) => {
        // 先按证据数排序，再按点赞数排序
        if (b.evidenceCount !== a.evidenceCount) {
          return b.evidenceCount - a.evidenceCount;
        }
        return b.totalLikes - a.totalLikes;
      })
      .map((contributor, index) => ({
        ...contributor,
        rank: index + 1,
      }));

    return NextResponse.json(contributors.slice(0, 50)); // 返回前 50 名
  } catch (error) {
    console.error('Contributors fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch contributors" },
      { status: 500 }
    );
  }
}
