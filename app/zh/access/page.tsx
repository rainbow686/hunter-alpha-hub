import { Metadata } from "next";
import AccessClient from "./access-client";
import { BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "如何使用 OpenRouter：模型、Playground 与 API（中文指南）",
  description:
    "OpenRouter 中文上手指南：注册账号、按任务选模型、在 playground 试跑、估算每月成本，把 OpenAI 兼容接口接进生产。附匿名 Alpha 模型的选型提醒。",
  keywords: [
    "OpenRouter 中文教程",
    "OpenRouter 怎么用",
    "OpenRouter API 中文",
    "OpenRouter playground",
    "OpenRouter 模型选择",
  ],
  alternates: {
    canonical: `${baseUrl}/zh/access`,
    languages: {
      "en-US": `${baseUrl}/access`,
      "zh-CN": `${baseUrl}/zh/access`,
      "x-default": `${baseUrl}/access`,
    },
  },
  openGraph: {
    title: "如何使用 OpenRouter：模型、Playground 与 API",
    description: "从注册、选型、playground 试跑到成本估算与接入生产的中文五步指南。",
    url: `${baseUrl}/zh/access`,
    type: "website",
    locale: "zh_CN",
  },
};

export default function ChineseAccessPage() {
  return (
    <>
      <AccessClient />
      <BreadcrumbListSchema
        items={[
          { name: "首页", url: baseUrl },
          { name: "中文指南：如何使用 OpenRouter", url: `${baseUrl}/zh/access` },
        ]}
      />
    </>
  );
}
