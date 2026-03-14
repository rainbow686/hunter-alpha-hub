import { NextResponse } from "next/server";

// GET /api/status - Hunter Alpha 模型状态
export async function GET() {
  // Mock 数据 - 后期替换为 OpenRouter API 调用
  const status = {
    online: true,
    lastSeen: new Date().toISOString(),
    specs: {
      parameters: "1T",
      contextWindow: "1M tokens",
      multimodal: true,
    },
  };

  // TODO: 集成 OpenRouter API
  // const response = await fetch('https://openrouter.ai/api/v1/models/hunter-alpha', {
  //   headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
  // });

  return NextResponse.json(status);
}
