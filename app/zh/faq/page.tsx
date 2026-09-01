import { Metadata } from "next";
import ChineseFaqClient from "./faq-client";
import { FAQSchema, BreadcrumbListSchema } from "@/components/structured-data";
import { chineseFaqs } from "@/lib/zh-faq";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Hunter Alpha 中文 FAQ（小米 mimo-v2）",
  description:
    "Hunter Alpha 中文常见问题：如何访问 OpenRouter、当前价格、1M tokens 上下文、纯文本能力、使用场景和安全注意事项。",
  keywords: [
    "Hunter Alpha FAQ 中文",
    "小米 mimo-v2 上下文",
    "小米大模型 免费",
    "OpenRouter 中文教程",
    "Hunter Alpha 是什么",
  ],
  alternates: {
    canonical: `${baseUrl}/zh/faq`,
    languages: {
      "en-US": `${baseUrl}/faq`,
      "zh-CN": `${baseUrl}/zh/faq`,
    },
  },
  openGraph: {
    title: "Hunter Alpha 中文 FAQ（小米 mimo-v2）",
    description: "Hunter Alpha 的中文常见问题、访问方式、价格和上下文能力说明。",
    url: `${baseUrl}/zh/faq`,
    type: "website",
    locale: "zh_CN",
  },
};

export default function ChineseFaqPage() {
  return (
    <>
      <ChineseFaqClient />
      <FAQSchema faqs={chineseFaqs} />
      <BreadcrumbListSchema
        items={[
          { name: "首页", url: baseUrl },
          { name: "Hunter Alpha 中文 FAQ", url: `${baseUrl}/zh/faq` },
        ]}
      />
    </>
  );
}
