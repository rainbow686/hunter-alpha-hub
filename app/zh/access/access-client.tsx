"use client";

import Link from "next/link";
import { Card } from "@/components/card";
import { NativeBanner } from "@/components/adsterra-ads";
import { ExternalLinkWithSmartlink } from "@/components/smartlink";

/**
 * 中文版「如何使用 OpenRouter」。
 *
 * 这个页面是 /access 的 zh-CN 对应页（hreflang 互指），所以内容要跟 /access 同一个
 * 意图 —— 通用选型与上手，而不是某一个模型的访问教程。原版写的是「Hunter Alpha
 * 已确认为小米 mimo-v2、当前免费、纯文本」，三句在 2026-09-18 全部过期，而且那版
 * 还把读者指向已退役的证据墙。
 */
const steps = [
  {
    number: "01",
    title: "注册 OpenRouter 账号",
    description:
      "用 Google、GitHub 或邮箱在 openrouter.ai 注册。免费账号就够浏览模型目录、在网页对话界面里试模型。",
    tip: "如果打算从试用走到生产调用，先把 API key 建好并放进服务端环境变量。",
  },
  {
    number: "02",
    title: "按任务选模型，别按热度选",
    description:
      "先想清楚你要做什么：写代码、读长文档、图片和音频输入、批量抽取、还是 agent 工作流。同一类任务里的候选模型，价格和上下文可能差好几倍。",
    tip: "先挑两个候选，用同样五条真实任务各跑一遍，再决定用哪个。",
  },
  {
    number: "03",
    title: "在 playground 里试",
    description:
      "打开模型页，输入一段有代表性的提示词，看答案本身 —— 也看它怎么处理你的边界情况。做 agent 的话，顺手测工具调用和结构化输出。",
    tip: "把提示词、期望输出和失败案例存下来，之后换模型才有可比性。",
  },
  {
    number: "04",
    title: "估算每月成本",
    description:
      "用「每百万 tokens」的价格乘上你真实的输入/输出比例。长上下文和高频调用会让最便宜的选项很快换人。",
    tip: "定下供应商之前，先过一遍本站的定价计算器。",
  },
  {
    number: "05",
    title: "把 API 接进你的应用",
    description:
      "OpenRouter 提供 OpenAI 兼容接口：把 model ID 换成你选的那个，key 留在服务端的环境变量里，其它调用代码基本不用动。",
    tip: "从第一天就把 model ID、token 用量和延迟记下来，出问题时这是唯一的证据。",
  },
];

const quickLinks = [
  { href: "/zh/faq", label: "中文 FAQ" },
  { href: "/comparison", label: "模型对比" },
  { href: "/stealth-models", label: "匿名模型登记册" },
];

export default function AccessClient() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12" lang="zh-CN">
      <div className="text-center mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300">
            中文
          </span>
          <Link
            href="/access"
            className="text-xs px-3 py-1 rounded-full border border-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            English
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">如何使用 OpenRouter</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg" style={{ color: "var(--muted)" }}>
          五步走完：试模型、估成本、从 playground 走进生产。
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step) => (
          <Card key={step.number} className="p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-violet-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                {step.number}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
                  {step.title}
                </h2>
                <p className="mb-4" style={{ color: "var(--muted)" }}>
                  {step.description}
                </p>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <svg className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-violet-300">{step.tip}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <NativeBanner />

      {/*
        这一段是本站相对通用教程的差别：匿名发布（Alpha 线）的模型往往只免费几天，
        而且揭晓后就改名换价 —— 选型时不知道这件事，最容易踩坑。
      */}
      <Card className="p-8 mt-12">
        <h2 className="text-xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
          选型时要留意「匿名发布」
        </h2>
        <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
          OpenRouter 上会不定期出现没有厂商名的免费预览模型，社区叫它们 Alpha：先用代号上线，等厂商
          认领后再改名成正式产品，价格通常也从 $0 变成正常计费（Hunter Alpha 就是这样变成 Xiaomi
          MiMo-V2.5 的）。把它们当成短期试用窗口，别当成长期依赖。
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/union-alpha" className="text-violet-400 hover:underline">
            当前匿名模型：Union Alpha →
          </Link>
          <Link href="/stealth-models" className="text-violet-400 hover:underline">
            每个代号后来变成了什么 →
          </Link>
          <Link href="/zh/faq" className="text-violet-400 hover:underline">
            中文 FAQ →
          </Link>
        </div>
      </Card>

      <div className="mt-12 text-center">
        <Card className="p-8 glow-border">
          <h2 className="text-2xl font-bold mb-4">从对比表开始</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            先看对比表定候选，再用自己的任务验证一遍，最后才上生产。
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/comparison"
              className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-violet-500 to-teal-500 text-white hover:opacity-90 transition-opacity"
            >
              对比模型
            </Link>
            <ExternalLinkWithSmartlink
              href="https://openrouter.ai"
              className="px-6 py-3 rounded-lg font-medium border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-colors"
            >
              打开 OpenRouter
            </ExternalLinkWithSmartlink>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm" style={{ color: "var(--muted)" }}>
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
