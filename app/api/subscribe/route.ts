import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// POST /api/subscribe - 邮件订阅
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // 检查是否已订阅
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 409 }
      );
    }

    // 添加到数据库
    const { error } = await supabase.from("subscribers").insert({
      email,
      subscribed_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    /*
     * "Our side cannot store this" is a 503, not a 500: the submission was fine,
     * the database is the problem. Two variants, because the fix differs — no
     * credentials (an operator configures something) versus a configured project
     * that does not answer (an operator looks at the project).
     *
     * Measured on 2026-09-18: production has never had NEXT_PUBLIC_SUPABASE_*
     * set, so every submit since launch landed here and the form could only say
     * "failed". Telling the truth is the difference between a user retyping their
     * address and an operator noticing there is no database at all.
     */
    const message = error instanceof Error ? error.message : String(error);
    const notConfigured = /Missing NEXT_PUBLIC_SUPABASE/.test(message);
    console.error("Subscribe error:", message);
    return NextResponse.json(
      notConfigured
        ? {
            error: "Not configured on this deployment",
            detail:
              "This deployment has no Supabase credentials, so nothing was stored. Email contact@hunteralphahub.com and we will add you by hand.",
          }
        : {
            error: "Subscription store unavailable",
            detail:
              "The subscription database could not be reached, so nothing was stored. Email contact@hunteralphahub.com and we will add you by hand.",
          },
      { status: 503 }
    );
  }
}
