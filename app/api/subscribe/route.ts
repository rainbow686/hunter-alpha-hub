import { NextRequest, NextResponse } from "next/server";
import { readSubscribers, writeSubscribers } from "@/lib/data";

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

    const subscribers = readSubscribers();

    // 检查是否已订阅
    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 409 }
      );
    }

    subscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
    });

    writeSubscribers(subscribers);

    // TODO: 集成 ConvertKit API
    // await convertKit.addSubscriber(email);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
