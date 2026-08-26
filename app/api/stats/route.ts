import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getOxAlphaDimensionMeta, STOP_LOSS_THRESHOLD, stopLossKeywords } from "@/lib/gsc-keywords";

// GET /api/stats - 获取社区统计数据 + OX-Alpha 维度（RAINBOW686-12）
// Backward-compatible: existing fields unchanged; adds `oxAlpha` and `keywordGroups` for GSC grouping.
// Query: ?dimension=ox_alpha returns filtered view; default returns all.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dimension = searchParams.get("dimension"); // e.g. "ox_alpha" | "hunter_alpha"

    // 并行获取所有统计数据
    const [evidenceResult, likesResult, contributorsResult, videoResult] = await Promise.all([
      supabase.from('evidence').select('*', { count: 'exact', head: true }),
      supabase.from('evidence').select('likes'),
      supabase
        .from('evidence')
        .select('nickname', { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('videos').select('*', { count: 'exact', head: true }),
    ]);

    const totalEvidence = evidenceResult.count || 0;
    const totalLikes = (likesResult.data || []).reduce((sum: number, item: any) => sum + (item.likes || 0), 0);
    const uniqueNicknames = new Set(contributorsResult.data?.map(item => item.nickname) || []).size;
    const weeklyContributors = uniqueNicknames;
    const totalVideos = videoResult.count || 0;

    // OX-Alpha dimension meta (GSC keyword grouping + stop-loss config)
    // Live GSC volumes are manual until Search Console API is wired; see docs/GSC-OX-Alpha-Setup.md
    const oxAlphaMeta = getOxAlphaDimensionMeta();

    // Optional: if ?dimension=ox_alpha, return only that slice (useful for dashboards)
    const base = {
      totalEvidence,
      totalLikes,
      weeklyContributors,
      totalVideos,
      // New fields for RAINBOW686-12 — additive, does not break existing consumers
      keywordGroups: oxAlphaMeta.groups,
      oxAlpha: {
        dimension: oxAlphaMeta,
        // Placeholder for live GSC metrics (null until API wired or manual input)
        gsc: {
          status: "manual_pending",
          note: "Wire GSC Search Analytics API or paste Keyword Planner volumes via /api/gsc-keywords (manual step by 孙斌). See docs/GSC-OX-Alpha-Setup.md",
          lastSyncedAt: null as string | null,
        },
        stopLoss: {
          threshold: STOP_LOSS_THRESHOLD,
          keywords: [...stopLossKeywords],
          rule: "Any >200/mo → Phase1 GO (tasks 1.1/1.2); all <200 → PAUSE, keep Hunter Alpha long-tail",
          // Volumes are null until manual Planner check completes — evaluate via lib/gsc-keywords.evaluateStopLoss()
          volumes: stopLossKeywords.map((k) => ({ keyword: k, volume: null, source: "keyword_planner" as const })),
        },
        trends: oxAlphaMeta.trendsRef,
      },
    };

    if (dimension === "ox_alpha") {
      return NextResponse.json({
        dimension: "ox_alpha",
        oxAlpha: base.oxAlpha,
        keywordGroups: base.keywordGroups.filter((g: any) => g.id === "ox_alpha" || g.id === "comparison"),
      });
    }

    return NextResponse.json(base);
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
