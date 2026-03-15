import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export interface CommunityDiscussion {
  id: string;
  title: string;
  description: string;
  source: "reddit" | "twitter" | "evidence";
  url: string;
  author: string;
  likes: number;
  createdAt: string;
  importance?: "High" | "Medium" | "Low";
}

// GET /api/community - 获取社区讨论聚合数据
export async function GET() {
  try {
    // 获取所有带外部讨论链接的证据
    const { data: evidenceWithUrls, error: evidenceError } = await supabase
      .from('evidence')
      .select('*')
      .not('external_discussion_url', 'is', null)
      .neq('external_discussion_url', '')
      .order('created_at', { ascending: false })
      .limit(10);

    if (evidenceError) {
      console.error('Failed to fetch community discussions:', evidenceError);
      return NextResponse.json(
        { error: "Failed to fetch community discussions" },
        { status: 500 }
      );
    }

    // 转换为社区讨论格式
    const discussions: CommunityDiscussion[] = (evidenceWithUrls || []).map((evidence) => {
      // 根据 URL 判断来源
      const externalUrl = evidence.external_discussion_url;
      let source: "reddit" | "twitter" | "evidence" = "evidence";

      if (externalUrl) {
        if (externalUrl.includes('reddit.com')) {
          source = "reddit";
        } else if (externalUrl.includes('twitter.com') || externalUrl.includes('x.com')) {
          source = "twitter";
        }
      }

      return {
        id: evidence.id,
        title: evidence.title,
        description: evidence.description,
        source,
        url: externalUrl || `/evidence`,
        author: evidence.nickname,
        likes: evidence.likes || 0,
        createdAt: evidence.created_at,
        importance: evidence.importance as "High" | "Medium" | "Low",
      };
    });

    return NextResponse.json(discussions);
  } catch (error) {
    console.error("Community discussions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch community discussions" },
      { status: 500 }
    );
  }
}
