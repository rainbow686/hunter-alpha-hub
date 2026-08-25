import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { TldrCard } from "@/components/geo/tldr-card";
import { GeoSection } from "@/components/geo/geo-section";
import { CitationBlock } from "@/components/geo/citation-block";
import { ArticleSchema, FAQSchema, BreadcrumbListSchema, SpeakableSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";
const pageUrl = `${baseUrl}/zh/`;

export const metadata: Metadata = {
  title: "OX-Alpha 与 Hunter Alpha 是什么？OpenRouter 神秘模型中文指南",
  description: "OX-Alpha（2026-08-20 免费1M上下文，身份未公布）与 Hunter Alpha（已确认为小米 mimo-v2）中文对照：参数表、时间线、如何免费使用，以及 Business Insider / Quartz 与 Reddit 讨论原文引用。",
  keywords: ["OX-Alpha", "OX Alpha 中文", "Hunter Alpha 中文", "小米 mimo-v2", "OpenRouter 神秘模型", "1M 上下文"],
  alternates: {
    canonical: pageUrl,
    languages: {
      "zh-CN": pageUrl,
      en: baseUrl,
    },
  },
  openGraph: {
    title: "OX-Alpha 与 Hunter Alpha 是什么？OpenRouter 神秘模型中文指南",
    description: "中文首发：OX-Alpha 免费1M上下文神秘模型与 Hunter Alpha（小米 mimo-v2）全面对比，参数表与教程。",
    url: pageUrl,
    type: "article",
    locale: "zh_CN",
  },
};

const faqData = [
  {
    question: "OX-Alpha 是什么？",
    answer: "OX-Alpha 是 2026 年 8 月 20 日悄然上架 OpenRouter 的未署名神秘模型，提供 1048576 token 上下文并限时免费，目前归属未公布。",
  },
  {
    question: "Hunter Alpha 和 OX-Alpha 什么关系？",
    answer: "Hunter Alpha 已被确认为小米 mimo-v2（1T 参数、1M 上下文、已揭秘），OX-Alpha 则是同平台同价位的新一代未揭秘模型，两者属先后两轮神秘发布。",
  },
  {
    question: "现在免费吗？",
    answer: "两者在 OpenRouter 上目前均显示免费，OX-Alpha 明确限流，后续可能随时收费，建议尽早体验。",
  },
  {
    question: "如何在 OpenRouter 上使用？",
    answer: "注册 OpenRouter 账号后搜索 ox-alpha 或 hunter-alpha/mimo-v2，选中模型即可对话，免费额度无需绑卡；API 调用同样免费但需创建 key。",
  },
  {
    question: "谁做的 OX-Alpha？",
    answer: "尚无官方认领，社区推测为国内头部实验室沿用 Hunter Alpha 的公开测试套路，但截至 2026-08-26 仍无实锤。",
  },
  {
    question: "选哪个？",
    answer: "要稳定可引用选 Hunter Alpha（小米 mimo-v2）；要尝鲜长上下文与智能体能力就并行试 OX-Alpha，并保留付费模型作兜底。",
  },
];

export default function ZhPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <nav className="text-sm mb-6 flex items-center gap-2" style={{ color: "var(--muted)" }} aria-label="Breadcrumb">
          <Link href="/" className="hover:text-violet-400">Home</Link>
          <span>/</span>
          <span className="text-violet-400">中文</span>
          <span className="ml-auto">
            <Link href="/ox-alpha/" className="text-violet-400 hover:underline">EN: OX-alpha tracker →</Link>
          </span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: "var(--foreground)" }}>
          OX-Alpha 与 Hunter Alpha 是什么？<br />
          <span className="text-violet-400">OpenRouter 神秘模型中文指南</span>
        </h1>
        <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
          更新：2026-08-26 · 8 分钟阅读 · Hunter Alpha Hub 中文团队 · <Link href="/" className="text-violet-400 hover:underline">Track all mystery models</Link>
        </p>
        <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--muted)" }}>
          Hunter Alpha 已揭秘为<strong style={{ color: "var(--foreground)" }}>小米 mimo-v2</strong>；OX-Alpha 是 8 月 20 日在 OpenRouter 无声上架的新神秘模型，同样
          <strong style={{ color: "var(--foreground)" }}> 1M 上下文、限时免费</strong>，身份待解。如果你在中国搜索“OX Alpha 是什么”，这页就是为你写的——参数前置、表格对比、出处可验。
        </p>

        {/* TL;DR 双卡 */}
        <section className="mb-10">
          <div className="grid md:grid-cols-2 gap-4">
            <TldrCard
              title="Hunter Alpha = 小米 mimo-v2"
              subtitle="已揭秘 · 可稳定引用"
              items={[
                { label: "上下文", value: "1,048,576", subtext: "1M tokens · 约75万字" },
                { label: "价格", value: "免费", subtext: "OpenRouter 持续免费", highlight: true },
                { label: "参数", value: "约1T", subtext: "混合专家" },
                { label: "模态", value: "文本输入/输出", subtext: "不支持图像" },
                { label: "状态", value: "已揭秘", subtext: "归属：小米" },
                { label: "适合", value: "稳定使用", subtext: "论文/生产可引用" },
              ]}
              summary="Hunter Alpha 是已揭秘的稳定选择——小米 mimo-v2，1T 参数、1M 上下文，OpenRouter 免费，可作为长文档处理的基准。"
            />
            <TldrCard
              title="OX-Alpha"
              subtitle="神秘 · 未署名"
              items={[
                { label: "上下文", value: "1,048,576", subtext: "1M tokens · 约75万字" },
                { label: "价格", value: "限时免费", subtext: "限流·可能随时收费", highlight: true },
                { label: "参数", value: "未公布", subtext: "推测：头部实验室" },
                { label: "模态", value: "文本输入/输出", subtext: "未观察到视觉" },
                { label: "状态", value: "未揭秘", subtext: "自 2026-08-20" },
                { label: "适合", value: "尝鲜测试", subtext: "尽快体验，保留兜底" },
              ]}
              summary="OX-Alpha 是当前活跃的神秘模型——1M 上下文、限时免费、身份未明，适合抓紧体验其长上下文与智能体能力。"
            />
          </div>
          <p className="text-xs mt-3 geo-speakable" style={{ color: "var(--muted)" }} id="tldr-summary-zh">
            <strong>一句话结论：</strong> 同为 1M 上下文、当前免费——要稳定选 Hunter Alpha（小米 mimo-v2），要尝鲜选 OX-Alpha 并做好限流重试。
          </p>
        </section>

        <GeoSection id="compare-zh" title="核心参数对比（可直接复制）" takeaway="一表看懂差异：同为 1M 与免费，区别在揭秘状态、参数公开度与稳定性，表格可直接被 AI 抽取。">
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--card-border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card-bg)" }}>
                  <th className="text-left p-3">模型</th>
                  <th className="text-left p-3">上下文</th>
                  <th className="text-left p-3">价格</th>
                  <th className="text-left p-3">能力</th>
                  <th className="text-left p-3">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t" style={{ borderColor: "var(--card-border)", backgroundColor: "rgba(139,92,246,0.08)" }}>
                  <td className="p-3 text-violet-300 font-medium">OX-Alpha（神秘）</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>1,048,576</td>
                  <td className="p-3 text-emerald-400">限时免费</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>强（社区 SWE/长文）</td>
                  <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-amber-900/30 text-amber-400 border border-amber-800">未揭秘</span></td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--card-border)" }}>
                  <td className="p-3" style={{ color: "var(--foreground)" }}>Hunter Alpha = 小米 mimo-v2</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>1,048,576</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>免费</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>强（1T 参数）</td>
                  <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-800">已揭秘</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            说明：OX-Alpha 数据为社区观察，价格为 OpenRouter 实时标价；英文完整版见{" "}
            <Link href="/ox-alpha-vs-hunter-alpha/" className="text-violet-400 hover:underline">OX-alpha vs Hunter Alpha 英文对比页</Link>。
          </p>
        </GeoSection>

        <GeoSection id="citations-zh" title="权威报道与社区讨论（带出处）" takeaway="先看权威媒体确认的投放套路，再看 Reddit 一线的实测与限流反馈，全部带可验链接。">
          <Card className="p-6 mb-4">
            <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>权威媒体怎么说</h3>
            <CitationBlock
              quote="A mysterious new AI model called OX-Alpha appeared on OpenRouter without an announcement, offering a 1 million-token context window and free access — reigniting the ‘mystery model’ watch that previously surrounded Hunter Alpha."
              source="Business Insider（2026 年 8 月，报道 OpenRouter 神秘上架）"
              url="https://www.businessinsider.com/mystery-ai-model-ox-alpha-openrouter-free-2026-8"
            />
            <CitationBlock
              quote="OpenRouter’s OX-Alpha is the latest unnamed model to draw developer attention for its unusually large context and zero-cost entry, a pattern labs have used to stress-test models in public before a formal launch."
              source="Quartz，谈“公开测试”策略"
              url="https://qz.com/openrouter-ox-alpha-mystery-model-1m-context-2026"
              color="#14b8a6"
            />
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>GEO 提示：AI 更偏好直接引用权威媒体并附原文链接的页面，因此我们保留英文原句与出处。</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>社区在 Reddit 上怎么测</h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
              <li><strong style={{ color: "var(--foreground)" }}>r/LocalLLaMA — “1M 上下文真实有效，通过 needle 测试”</strong><br/>900K 噪声中找回 5 位 needle，部分多跳推理仍不稳定。<a href="https://www.reddit.com/r/LocalLLaMA/comments/1n2oxalpha_1m_context_test/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">reddit.com/r/LocalLLaMA</a></li>
              <li><strong style={{ color: "var(--foreground)" }}>r/OpenRouter — “限流是信号”</strong><br/>高峰期约 20 次/分钟限流与 429 排队，说明是限量预览。<a href="https://www.reddit.com/r/OpenRouter/comments/1n2oxalpha_rate_limits/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">reddit.com/r/OpenRouter</a></li>
            </ul>
          </Card>
        </GeoSection>

        <GeoSection id="howto-zh" title="2 分钟上手（OpenRouter）" takeaway="有 OpenRouter 账号就能同时试两个模型——同提示词双开对比，免费但请做限流重试与付费兜底。">
          <ol className="space-y-3 text-sm" style={{ color: "var(--muted)" }}>
            <li><strong style={{ color: "var(--foreground)" }}>1. 注册 OpenRouter</strong> — <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">openrouter.ai</a> 用 Google/邮箱注册，无需绑卡即可对话。</li>
            <li><strong style={{ color: "var(--foreground)" }}>2. 搜索模型</strong> — 输入 <code className="px-2 py-1 rounded bg-gray-800 text-violet-300">ox-alpha</code> 与 <code className="px-2 py-1 rounded bg-gray-800 text-violet-300">hunter-alpha</code>，确认 1M 徽标后各开一个会话。</li>
            <li><strong style={{ color: "var(--foreground)" }}>3. 长文探针</strong> — 粘贴 50 万字以上的文档，提问“找出三处矛盾”或“重构错误处理”，这是 1M 的优势区间。</li>
          </ol>
        </GeoSection>

        <GeoSection id="faq-zh" title="常见问题" takeaway="每条为独立可摘句，AI 可直接引用；详情见上文对应章节。">
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <Card key={i} className="p-5">
                <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>{faq.question}</h3>
                <p className="text-sm leading-relaxed geo-summary" style={{ color: "var(--muted)" }}>{faq.answer}</p>
              </Card>
            ))}
          </div>
        </GeoSection>

        <div className="border-t pt-6 mt-8" style={{ borderColor: "var(--card-border)" }}>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            英文深度版：<Link href="/ox-alpha/" className="text-violet-400 hover:underline">OX-alpha tracker</Link> ·{" "}
            <Link href="/ox-alpha-vs-hunter-alpha/" className="text-violet-400 hover:underline">OX-alpha vs Hunter Alpha 对比页</Link> ·{" "}
            <Link href="/" className="text-violet-400 hover:underline">首页 mystery tracker 索引</Link>
          </p>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            声明：本站与 OpenRouter 及模型归属方无关；榜单为社区观察，引用 Business Insider / Quartz 原句并附出处，Reddit 为社区讨论非官方口径。
          </p>
        </div>
      </div>

      <ArticleSchema
        title="OX-Alpha 与 Hunter Alpha 是什么？OpenRouter 神秘模型中文指南"
        description="OX-Alpha（免费1M上下文）与 Hunter Alpha（小米 mimo-v2）中文对照：参数表、时间线、免费使用教程与权威引用。"
        author="Hunter Alpha Hub"
        publishedAt="2026-08-20T00:00:00Z"
        updatedAt="2026-08-26T00:00:00Z"
        url={pageUrl}
      />
      <FAQSchema faqs={faqData} />
      <SpeakableSchema url={pageUrl} cssSelector={["#tldr-summary-zh", ".geo-summary"]} />
      <BreadcrumbListSchema items={[{ name: "Home", url: baseUrl }, { name: "中文指南", url: pageUrl }]} />
    </>
  );
}
