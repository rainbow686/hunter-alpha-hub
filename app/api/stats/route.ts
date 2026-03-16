import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/stats - 获取社区统计数据
export async function GET() {
  try {
    // 并行获取所有统计数据
    const [evidenceResult, likesResult, contributorsResult, videoResult] = await Promise.all([
      // 总证据数
      supabase.from('evidence').select('*', { count: 'exact', head: true }),
      // 总点赞数
      supabase.from('evidence').select('likes'),
      // 本周活跃贡献者（过去 7 天内提交证据的唯一用户数）
      supabase
        .from('evidence')
        .select('nickname', { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      // 总视频数
      supabase.from('videos').select('*', { count: 'exact', head: true }),
    ]);

    const totalEvidence = evidenceResult.count || 0;
    const totalLikes = (likesResult.data || []).reduce((sum: number, item: any) => sum + (item.likes || 0), 0);
    // 对昵称去重计算唯一贡献者数
    const uniqueNicknames = new Set(contributorsResult.data?.map(item => item.nickname) || []).size;
    const weeklyContributors = uniqueNicknames;
    const totalVideos = videoResult.count || 0;

    return NextResponse.json({
      totalEvidence,
      totalLikes,
      weeklyContributors,
      totalVideos,
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
