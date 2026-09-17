import { Metadata } from "next";
import ChineseFaqClient from "./faq-client";
import { FAQSchema, BreadcrumbListSchema } from "@/components/structured-data";
import { chineseFaqs } from "@/lib/zh-faq";

const baseUrl = "https://www.hunteralphahub.com";

export const metadata: Metadata = {
  title: "Hunter Alpha 与 Alpha 系列中文 FAQ",
  description:
    "Hunter Alpha、Alpha 匿名模型系列的中文常见问题：它现在是什么模型、还免不免费、Union Alpha 的免费窗口、上下文与模态，以及本站怎么区分事实和声称。",
  keywords: [
    "Hunter Alpha 中文",
    "Alpha 匿名模型 中文",
    "Union Alpha 免费",
    "小米 MiMo-V2.5 价格",
    "OpenRouter 匿名模型",
  ],
  alternates: {
    canonical: `${baseUrl}/zh/faq`,
    languages: {
      "en-US": `${baseUrl}/faq`,
      "zh-CN": `${baseUrl}/zh/faq`,
      "x-default": `${baseUrl}/faq`,
    },
  },
  openGraph: {
    title: "Hunter Alpha 与 Alpha 系列中文 FAQ",
    description: "代号、当前模型、价格、上下文与模态的中文说明，以及事实与声称的区分方式。",
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
          { name: "中文 FAQ", url: `${baseUrl}/zh/faq` },
        ]}
      />
    </>
  );
}
