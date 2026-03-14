import { NextResponse } from "next/server";

// Hunter Alpha 模型在 OpenRouter 上的 ID
const HUNTER_ALPHA_MODEL = "openrouter/hunter-alpha";

// GET /api/status - Hunter Alpha 模型状态
export async function GET() {
  try {
    // 调用 OpenRouter 免费模型列表 API
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // 不需要 API Key，免费接口
    });

    if (!response.ok) {
      throw new Error("Failed to fetch models from OpenRouter");
    }

    const data = await response.json();
    const models = data.data || [];

    // 检查 Hunter Alpha 模型是否在列表中
    const hunterAlphaModel = models.find(
      (model: any) => model.id === HUNTER_ALPHA_MODEL || model.name?.toLowerCase().includes("hunter")
    );

    if (hunterAlphaModel) {
      // 检查模态是否支持图像
      const modality = hunterAlphaModel.architecture?.modality || "";
      const isMultimodal = modality.includes("image") || modality.includes("multimodal");

      return NextResponse.json({
        online: true,
        lastSeen: new Date().toISOString(),
        specs: {
          parameters: hunterAlphaModel.parameters || "Unknown",
          contextWindow: hunterAlphaModel.context_length ? `${hunterAlphaModel.context_length.toLocaleString()} tokens` : "Unknown",
          multimodal: isMultimodal,
          pricing: hunterAlphaModel.pricing || {},
          description: hunterAlphaModel.description || "",
          architecture: hunterAlphaModel.architecture || {},
        },
      });
    } else {
      // 模型不在列表中，返回离线状态
      return NextResponse.json({
        online: false,
        lastSeen: new Date().toISOString(),
        specs: {
          parameters: "Unknown",
          contextWindow: "Unknown",
          multimodal: false,
        },
        error: "Model not found in OpenRouter",
      });
    }
  } catch (error) {
    console.error("Error fetching model status:", error);
    // 返回降级数据
    return NextResponse.json({
      online: false,
      lastSeen: new Date().toISOString(),
      specs: {
        parameters: "Unknown",
        contextWindow: "Unknown",
        multimodal: false,
      },
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
