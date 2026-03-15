import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { VideoDB, fromVideoDB } from "@/lib/types";

// GET /api/videos - 获取视频列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");
    const category = searchParams.get("category");

    let query = supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch videos:', error);
      return NextResponse.json(
        { error: "Failed to fetch videos" },
        { status: 500 }
      );
    }

    const videos = (data as VideoDB[] || []).map(fromVideoDB);
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Videos fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST /api/videos - 添加新视频（管理员用途）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      channel,
      videoUrl,
      category,
      description,
      thumbnailUrl,
      publishedAt,
      viewCount,
      durationSeconds,
      isFeatured,
    } = body;

    // 验证必填字段
    if (!title || !channel || !videoUrl || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validCategories = ["Hunter Alpha", "AI Analysis", "Context Technology"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // 提取 YouTube 视频 ID 生成缩略图（如果没有提供）
    let finalThumbnailUrl = thumbnailUrl;
    if (!finalThumbnailUrl) {
      const videoId = extractYoutubeId(videoUrl);
      if (videoId) {
        finalThumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    const { data, error } = await supabase
      .from('videos')
      .insert([{
        title,
        channel,
        video_url: videoUrl,
        category,
        description: description || null,
        thumbnail_url: finalThumbnailUrl || null,
        published_at: publishedAt || null,
        view_count: viewCount || 0,
        duration_seconds: durationSeconds || null,
        is_featured: isFeatured !== false,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: "Failed to add video" },
        { status: 500 }
      );
    }

    return NextResponse.json(fromVideoDB(data as VideoDB), { status: 201 });
  } catch (error) {
    console.error("Video submission error:", error);
    return NextResponse.json(
      { error: "Failed to add video" },
      { status: 500 }
    );
  }
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^&?/]+)/);
  return match ? match[1] : null;
}
