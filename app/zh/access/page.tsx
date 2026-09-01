import { Metadata } from "next";
import AccessClient from "./access-client";
import { BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "如何使用 Hunter Alpha（小米 mimo-v2）",
  description:
    "Hunter Alpha（小米 mimo-v2）中文访问指南：注册 OpenRouter、找到模型、免费开始对话，并了解 1M tokens 上下文窗口。",
  keywords: [
    "Hunter Alpha 中文",
    "小米 mimo-v2 怎么用",
    "OpenRouter Hunter Alpha",
    "小米大模型 免费",
    "Hunter Alpha 访问指南",
  ],
  alternates: {
    canonical: `${baseUrl}/zh/access`,
    languages: {
      "en-US": `${baseUrl}/access`,
      "zh-CN": `${baseUrl}/zh/access`,
    },
  },
  openGraph: {
    title: "如何使用 Hunter Alpha（小米 mimo-v2）",
    description: "Hunter Alpha 的中文访问步骤、价格、上下文窗口和证据提交方式。",
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
          { name: "中文访问指南", url: `${baseUrl}/zh/access` },
        ]}
      />
    </>
  );
}
