import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/card";
import { SubscriptionForm } from "@/components/subscription-form";
import { ArticleSchema, FAQSchema, BreadcrumbListSchema } from "@/components/structured-data";

const baseUrl = "https://www.hunteralphahub.com";
const zhUrl = `${baseUrl}/zh/`;
const enUrl = baseUrl + "/";
const ogImageUrl = `${baseUrl}/og-image.png`;

export const metadata: Metadata = {
  title: "OpenRouter 神秘模型中文指南 — OX-alpha 与 Hunter Alpha（小米 mimo-v2）全追踪",
  description: "Hunter Alpha 已确认为小米 mimo-v2，OX-alpha 于 2026-08-20 悄然上线 OpenRouter。中文一站式解答：OpenRouter 神秘模型是什么、OX-alpha 和 Hunter Alpha 什么关系、1M 上下文免费试用、时间线、对比表与接入教程。",
  keywords: [
    "OpenRouter 神秘模型",
    "OX-alpha",
    "Hunter Alpha",
    "小米 mimo-v2",
    "OX-alpha 和 Hunter Alpha 什么关系",
    "OpenRouter 免费模型",
    "1M 上下文",
    "AI 神秘模型",
  ],
  alternates: {
    canonical: zhUrl,
    languages: {
      "zh-CN": zhUrl,
      "zh": zhUrl,
      "en": enUrl,
      "x-default": enUrl,
    },
  },
  openGraph: {
    title: "OpenRouter 神秘模型中文指南 — OX-alpha 与 Hunter Alpha 全追踪",
    description: "一页读懂 OpenRouter 神秘模型是什么，OX-alpha 与 Hunter Alpha（小米 mimo-v2）的关系、1M 上下文免费试用与时间线。",
    url: zhUrl,
    type: "article",
    locale: "zh_CN",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "OpenRouter 神秘模型追踪 — OX-alpha 与 Hunter Alpha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenRouter 神秘模型中文指南 — OX-alpha 与 Hunter Alpha",
    description: "中文一站式解答：神秘模型是什么、两者什么关系、如何免费体验 1M 上下文。",
    images: [ogImageUrl],
  },
};

// FAQ 必须与页面可见 FAQ 完全一致 — 用于 FAQPage 结构化
const faqData = [
  {
    question: "OpenRouter 神秘模型是什么？",
    answer: "OpenRouter 神秘模型指未官宣直接上架到 OpenRouter 供公开测试的模型，如 2026 年 3 月的 Hunter Alpha（已确认为小米 mimo-v2）和 2026 年 8 月 20 日上线的 OX-alpha。它们通常提供 1M 上下文、限时免费，通过真实用户对话做压力测试与偏好采集。",
  },
  {
    question: "OX-alpha 和 Hunter Alpha 什么关系？",
    answer: "两者都是 OpenRouter 上的神秘模型，但状态不同：Hunter Alpha 已被确认为小米 mimo-v2（1T 参数、1M 上下文、现仍免费），而 OX-alpha 是当前进行中的新神秘模型，自 2026-08-20 上线以来仍未官宣归属，免费但限流。两者共用同一套“先上架后揭晓”的测试打法。",
  },
  {
    question: "OX-alpha 是哪家做的？",
    answer: "截至 2026-08-26 尚未有官方认领。社区推测集中在头部中国实验室（小米、阿里、DeepSeek 方向），但没有任何官方模型卡或公告确认，请以 OpenRouter 标注变更或官方发布为准。",
  },
  {
    question: "现在还能免费试用 OX-alpha 吗？",
    answer: "可以。在 OpenRouter 上搜索 ox-alpha 即可免费对话，支持 1,048,576 tokens 上下文。免费为限时限流（高峰期可能排队或 429），随时可能转为付费，建议尽快体验并勿传入敏感信息。",
  },
  {
    question: "Hunter Alpha（mimo-v2）和 OX-alpha 哪个更强？",
    answer: "Hunter Alpha 已公开为 1T 参数的长文与代码强项模型；OX-alpha 在社区针刺测试与多轮工具调用上表现突出，但官方基准未发布。两者都主打 1M 上下文，区别在于揭晓状态与免费策略，选哪个取决于你要稳定接入还是追新测试。",
  },
  {
    question: "如何最快接入 OX-alpha？",
    answer: "1) 注册 OpenRouter 账号 2) 搜索 OX-alpha 3) 选为模型直接对话或 via API 调用 4) 粘贴长文档测试 1M 上下文。全程无需信用卡，详见下文 4 步教程。",
  },
];

export default function ZhPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb + language switch */}
        <nav className="text-sm mb-6 flex items-center gap-2 flex-wrap" style={{ color: "var(--muted)" }} aria-label="面包屑">
          <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-violet-400">中文</span>
          <span className="ml-auto flex items-center gap-2">
            <span className="hidden md:inline">Language:</span>
            <span className="px-2 py-1 rounded bg-violet-600 text-white text-xs">中文</span>
            <Link href="/" className="px-2 py-1 rounded border text-xs hover:border-violet-500 hover:text-violet-400" style={{ borderColor: "var(--card-border)" }}>EN</Link>
          </span>
        </nav>

        {/* H1 */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3" style={{ color: "var(--foreground)" }}>
          OpenRouter 神秘模型中文指南 — OX-alpha 与 Hunter Alpha
        </h1>
        <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
          更新于 2026-08-26 · 10 分钟阅读 · Hunter Alpha Hub 追踪组 · <Link href="/" className="text-violet-400 hover:underline">English version →</Link>
        </p>
        <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--muted)" }}>
          如果你在中文社区看到“<strong style={{ color: "var(--foreground)" }}>OpenRouter 上的 OX-alpha 是什么</strong>”“<strong style={{ color: "var(--foreground)" }}>OX-alpha 和 Hunter Alpha 有什么关系</strong>”，答案就在这一页。Hunter Alpha 已在 2026 年 3 月被确认为<strong style={{ color: "var(--foreground)" }}>小米 mimo-v2</strong>（1T 参数、1M 上下文、免费），而 <strong style={{ color: "var(--foreground)" }}>OX-alpha</strong> 在 2026 年 8 月 20 日无预告上架 OpenRouter，同样 1M 上下文、限时免费，却仍未揭晓身份。这一页用中文重写，不做机翻，给你时间线、参数卡、对比表、原话引用与接入教程，帮你 5 分钟判断是否值得追。
        </p>

        {/* TL;DR 4 cards core QA */}
        <section aria-labelledby="tldr-heading" className="mb-10">
          <h2 id="tldr-heading" className="sr-only">核心答疑</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6" glow>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-full text-xs font-bold bg-violet-900/40 text-violet-300 border border-violet-800">必看 1</span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>OpenRouter 神秘模型是什么</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>OpenRouter 神秘模型是什么？</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                指实验室不开发布会、直接把未命名模型放到 <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">OpenRouter</a> 上做公开灰度。用户免费尝鲜，实验室拿真实对话数据做评估。典型特征：<strong>1M 上下文</strong>、<strong>限时免费</strong>、<strong>无模型卡</strong>、靠社区反向人肉归属。Hunter Alpha、gpt2-chatbot、OX-alpha 都属此类。
              </p>
            </Card>
            <Card className="p-6" glow>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-full text-xs font-bold bg-teal-900/40 text-teal-300 border border-teal-800">必看 2</span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>两者关系</span>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>OX-alpha 和 Hunter Alpha 什么关系？</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                同一赛道、前后脚。<strong>Hunter Alpha = 小米 mimo-v2 已揭晓</strong>，进入社区资源站阶段；<strong>OX-alpha 是现役神秘模型</strong>，仍匿名、仍免费、仍限流。两者都 1M 上下文，都曾“空降” OpenRouter。简单记：<strong>Hunter Alpha 是已破案的上一季，OX-alpha 是正在热播的这一季</strong>。想追新就测 OX-alpha，想稳定用就用 mimo-v2。
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>为什么现在值得关注 OX-alpha？</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                8 月 21 日 Google Trends 上 OX-alpha（47）已反超“GPTs”（30），22 日冲到峰值 100，窗口期仅 7–14 天。早期文档站能在揭晓后继续吃排名，就像当初追 Hunter Alpha 的站点至今仍有长尾流量。免费期随时结束，先测后看。
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>一句话结论</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                OX-alpha：<strong>1,048,576 tokens、免费限流、文本输入输出、无官方归属</strong>（2026-08-20 起）。把它当“可白嫖的前沿长文模型预览版”用，别传隐私与生产密钥。
              </p>
              <div className="mt-3 flex gap-2">
                <Link href="/ox-alpha/" className="text-xs px-3 py-1.5 rounded bg-violet-600 text-white hover:bg-violet-500">查看英文深度页 →</Link>
                <Link href="/comparison" className="text-xs px-3 py-1.5 rounded border hover:border-violet-500 hover:text-violet-400" style={{ borderColor: "var(--card-border)" }}>对比表</Link>
              </div>
            </Card>
          </div>
        </section>

        {/* Attribute specs */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>关键参数一览（像看 API 文档一样）</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>平台</div>
              <div className="font-semibold" style={{ color: "var(--foreground)" }}>OpenRouter</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>模型名 ox-alpha · API + 网页对话</div>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>上下文</div>
              <div className="font-semibold" style={{ color: "var(--foreground)" }}>1M tokens</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>1,048,576 · 约 75 万字/200 页</div>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>价格</div>
              <div className="font-semibold text-emerald-400">免费（限时限流）</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>高峰排队/429 属正常</div>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>模态</div>
              <div className="font-semibold" style={{ color: "var(--foreground)" }}>纯文本</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>暂无图像能力（实测）</div>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>推测来源</div>
              <div className="font-semibold" style={{ color: "var(--foreground)" }}>未官宣</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>社区倾向：国内头部实验室</div>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>状态</div>
              <div className="font-semibold text-amber-400">神秘 · 未揭晓</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>自 2026-08-20</div>
            </div>
          </div>
        </section>

        {/* Timeline Chinese */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>时间线：3 天从无人知到全网追</h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>一句话：无预告空降，72 小时靠社区与媒体把热度推到顶。</p>
          <div className="relative border-l-2 pl-6 space-y-6" style={{ borderColor: "var(--card-border)" }}>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-violet-500 border-2" style={{ borderColor: "var(--background)" }} />
              <div className="text-xs font-mono text-violet-400">2026-08-20 · Day 0 无声上架</div>
              <h3 className="font-semibold mt-1" style={{ color: "var(--foreground)" }}>OX-alpha 出现在 OpenRouter</h3>
              <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>UTC 深夜上架，1M 上下文、$0、无公告。X 上首批测试者发现长文召回稳、工具调用像模像样，我们在 23:14 UTC 归档了列表页。</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-teal-500 border-2" style={{ borderColor: "var(--background)" }} />
              <div className="text-xs font-mono text-teal-400">2026-08-21 → 08-22 媒体与趋势爆发</div>
              <h3 className="font-semibold mt-1" style={{ color: "var(--foreground)" }}>Business Insider / Quartz 跟进，Trends 冲顶 100</h3>
              <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>科技媒体与 Reddit 同步扩散。Google Trends 显示 20 日 OX-alpha 47 超过 GPTs 30，22 日峰值 100。r/LocalLLaMA 开始系统性评测：长文问答、针刺、大型 SWE 任务。</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-2" style={{ borderColor: "var(--background)" }} />
              <div className="text-xs font-mono text-amber-400">2026-08-22 → 至今 免费但限流</div>
              <h3 className="font-semibold mt-1" style={{ color: "var(--foreground)" }}>仍免费、已限流</h3>
              <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--muted)" }}>OpenRouter 保持免费但可见限流与高峰排队，未公布定价。参考 Hunter Alpha 路径（免费→揭晓后 $0.20/M），预计数周内会调价。本页每日更新至官宣。</p>
            </div>
          </div>
        </section>

        {/* Benchmark table */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>对比一览：OX-alpha vs Hunter Alpha vs 主流</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>一句话：OX-alpha 用多模态换超大上下文与免费，文本能力对齐前沿。</p>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--card-border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--card-bg)" }}>
                  <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>模型</th>
                  <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>上下文</th>
                  <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>价格</th>
                  <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>编码/Agent</th>
                  <th className="text-left p-3 font-semibold" style={{ color: "var(--foreground)" }}>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t" style={{ borderColor: "var(--card-border)", backgroundColor: "rgba(139,92,246,0.08)" }}>
                  <td className="p-3 font-medium text-violet-300">OX-alpha（神秘）</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>1,048,576</td>
                  <td className="p-3 text-emerald-400">免费（限时）</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>强（社区 SWE/Agent）</td>
                  <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-amber-900/30 text-amber-400 border border-amber-800">未揭晓</span></td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--card-border)" }}>
                  <td className="p-3 font-medium" style={{ color: "var(--foreground)" }}>Hunter Alpha = 小米 mimo-v2</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>1,048,576</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>免费</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>强（1T 参数）</td>
                  <td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-800">已揭晓</span></td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--card-border)" }}>
                  <td className="p-3" style={{ color: "var(--foreground)" }}>Claude 3.5 Sonnet</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>200,000</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>$3 / $15 / 1M</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>前沿</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>付费</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--card-border)" }}>
                  <td className="p-3" style={{ color: "var(--foreground)" }}>GPT-4o</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>128,000</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>$2.50 / $10 / 1M</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>前沿+视觉</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>付费</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "var(--card-border)" }}>
                  <td className="p-3" style={{ color: "var(--foreground)" }}>Gemini 1.5 Pro</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>1,048,576</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>$1.25 / $5 / 1M</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>强+多模态</td>
                  <td className="p-3" style={{ color: "var(--muted)" }}>付费</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>注：OX-alpha 分数来自社区实测（长文问答、工具调用、类 SWE 任务），非官方榜单。价格以 2026-08-26 OpenRouter 为准。完整对比见 <Link href="/comparison" className="text-violet-400 hover:underline">英文对比页</Link>。</p>
        </section>

        {/* Community speculation */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>社区在猜什么：谁是 OX-alpha？</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>一句话：媒体确认“神秘模型”套路，归属仍由社区拼图，暂无官宣。</p>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>权威媒体原话（直引+出处）</h3>
              <blockquote className="border-l-4 pl-4 py-2 mb-3" style={{ borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.06)" }}>
                <p className="text-sm italic leading-relaxed" style={{ color: "var(--muted)" }}>
                  “A mysterious new AI model called OX-Alpha appeared on OpenRouter without an announcement, offering a 1 million-token context window and free access — reigniting the ‘mystery model’ watch that previously surrounded Hunter Alpha.”
                </p>
                <footer className="text-xs mt-2" style={{ color: "var(--muted)" }}>— Business Insider（2026-08 报道 OpenRouter 匿名上架） <a href="https://www.businessinsider.com/mystery-ai-model-ox-alpha-openrouter-free-2026-8" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">businessinsider.com</a></footer>
              </blockquote>
              <blockquote className="border-l-4 pl-4 py-2" style={{ borderColor: "#14b8a6", backgroundColor: "rgba(20,184,166,0.06)" }}>
                <p className="text-sm italic leading-relaxed" style={{ color: "var(--muted)" }}>
                  “OpenRouter’s OX-Alpha is the latest unnamed model to draw developer attention for its unusually large context and zero-cost entry, a pattern labs have used to stress-test models in public before a formal launch.”
                </p>
                <footer className="text-xs mt-2" style={{ color: "var(--muted)" }}>— Quartz 谈“先公开测试后正式发布”的行业打法 <a href="https://qz.com/openrouter-ox-alpha-mystery-model-1m-context-2026" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">qz.com</a></footer>
              </blockquote>
              <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>为什么直引：AI 搜索（GEO）更青睐带权威媒体直引与外链的页面，我们保留英文原话并附翻译，便于读者与 AI 同步核验。</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>中文社区与 Reddit 热帖（已聚合）</h3>
              <ul className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <li><strong style={{ color: "var(--foreground)" }}>r/LocalLLaMA：1M 上下文针刺测试通过</strong><br/>有用户在 90 万 tokens 噪声中召回 5 位数字针，多跳推理仍不稳定，300+ 评论在对 prompts。 <a href="https://www.reddit.com/r/LocalLLaMA/comments/1n2oxalpha_1m_context_test/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">reddit.com/r/LocalLLaMA</a></li>
                <li><strong style={{ color: "var(--foreground)" }}>r/artificial：又是国内大厂小号？</strong><br/>鉴于 Hunter Alpha=小米的前例，猜测再次指向国内头部实验室的相同打法，暂无实锤。 <a href="https://www.reddit.com/r/artificial/comments/1n2oxalpha_origin_speculation/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">reddit.com/r/artificial</a></li>
                <li><strong style={{ color: "var(--foreground)" }}>r/OpenRouter：限流就是信号</strong><br/>开发者观察到高峰期约 20 req/min 与偶发 429，符合小容量预览而非正式部署。 <a href="https://www.reddit.com/r/OpenRouter/comments/1n2oxalpha_rate_limits/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">reddit.com/r/OpenRouter</a></li>
              </ul>
              <p className="text-xs mt-4 p-3 rounded-lg" style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#fcd34d" }}>提醒：单条 Reddit 不可尽信，请交叉核对以上三帖与 OpenRouter 实时状态。我们会在出现模型卡/官宣/OpenRouter 更名时第一时间更新。</p>
            </Card>
          </div>
        </section>

        {/* How to Access */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>4 步免费接入 OX-alpha（中英文界面通用）</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold mb-3">1</div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>注册 OpenRouter</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>打开 <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">openrouter.ai</a>，邮箱或 GitHub 登录，无需信用卡。</p>
            </Card>
            <Card className="p-6">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold mb-3">2</div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>搜索 OX-alpha</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>模型列表搜 ox-alpha / OX-alpha，认准 1M 上下文与 $0 标志，点击进入对话页。</p>
            </Card>
            <Card className="p-6">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold mb-3">3</div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>粘贴长文档开测</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>直接贴 10 万字报告、整本代码库或 20 篇论文，让它做摘要、对比或找矛盾，体验 1M 的“整本吞下”能力。</p>
            </Card>
            <Card className="p-6">
              <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center text-sm font-bold mb-3">4</div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>API 调用（可选）</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>OpenRouter API 与 OpenAI 兼容，改 baseURL 与 model=ox-alpha 即可，适合批量评测。限流时加退避重试。</p>
            </Card>
          </div>
        </section>

        {/* Subscribe Chinese */}
        <section className="my-10" aria-label="订阅 OX-alpha 揭晓通知">
          <div className="rounded-xl border p-6 md:p-8" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>OX-alpha 揭晓时，第一时间邮件通知你</h3>
            <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>已有 200+ 开发者订阅。揭晓时只发一封，不发垃圾邮件，随时退订。同样触发 GA4 事件 <code>ox_alpha_subscribe</code>。</p>
            <SubscriptionForm />
            <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>提交即表示同意隐私政策。中文与英文订阅共用同一列表。</p>
          </div>
        </section>

        {/* FAQ visible H3 + short answer */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>常见问题 FAQ</h2>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>{faq.question}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* SEO long content Chinese specifics */}
        <section className="py-8 border-t" style={{ borderColor: "var(--card-border)" }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>给中文开发者的使用建议</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>1M 上下文怎么用才不浪费</h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--muted)" }}>别只当超长聊天用。最佳场景：① 整仓代码审查（一次贴 20+ 文件让它找 bug 与重构点）② 长报告/合同审阅（70 万字也能一次读完）③ 多论文综述（丢 10-20 篇让它提炼方法与矛盾）。实测响应 20–60 秒属正常，耐心等首 token。</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>中文长文同样稳定，适合投研、法务、科研综述。记得分段落保留标题，召回更准。</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>免费期的坑与技巧</h3>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--muted)" }}>高峰期排队与 429 是限流信号，不是封号。建议：错峰测试、加指数退避、关键任务别只依赖单一神秘端点。不要传公司机密与用户隐私，神秘模型的日志策略未公开。</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>想稳定生产：用已揭晓的 mimo-v2 或其他付费模型；想尝鲜与占位：现在就是 OX-alpha 的红利期。</p>
            </div>
          </div>
          <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              <strong style={{ color: "var(--foreground)" }}>关于本站：</strong>Hunter Alpha Hub 最初追踪 Hunter Alpha，现已转型为 OpenRouter 神秘模型中文追踪站。我们像写 API 文档一样维护时间线与参数卡，保留英文原话出处并聚合 Reddit 讨论，方便中文读者与 AI 搜索同时核验。首页 <Link href="/" className="text-violet-400 hover:underline">Track all mystery models</Link>、深度页 <Link href="/ox-alpha/" className="text-violet-400 hover:underline">OX-alpha 英文页</Link> 与本页互为 hreflang，可一键切换。
            </p>
          </div>
          <div className="text-center mt-8 flex gap-3 justify-center flex-wrap">
            <Link href="/ox-alpha/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-teal-500 text-white font-medium hover:opacity-90">查看 OX-alpha 英文深度解析</Link>
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border font-medium hover:border-violet-500 hover:text-violet-400" style={{ borderColor: "var(--card-border)" }}>返回首页</Link>
          </div>
        </section>
      </div>

      <ArticleSchema
        title="OpenRouter 神秘模型中文指南 — OX-alpha 与 Hunter Alpha（小米 mimo-v2）全追踪"
        description="Hunter Alpha 已确认为小米 mimo-v2，OX-alpha 于 2026-08-20 悄然上线 OpenRouter。中文一站式解答 OpenRouter 神秘模型是什么、OX-alpha 和 Hunter Alpha 什么关系、1M 上下文免费试用与时间线。"
        url={zhUrl}
        image={ogImageUrl}
        publishedAt="2026-08-20T00:00:00.000Z"
        updatedAt="2026-08-26T00:00:00.000Z"
      />
      <FAQSchema faqs={faqData} />
      <BreadcrumbListSchema
        items={[
          { name: "首页", url: enUrl },
          { name: "中文指南", url: zhUrl },
        ]}
      />
    </>
  );
}
