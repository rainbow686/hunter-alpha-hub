"use client";

import Link from "next/link";
import { Card } from "@/components/card";
import { NativeBanner } from "@/components/adsterra-ads";
import { ExternalLinkWithSmartlink } from "@/components/smartlink";

const steps = [
  {
    number: "01",
    title: "注册 OpenRouter 账号",
    description:
      "打开 OpenRouter 官网，使用 Google、GitHub 或邮箱完成注册。整个过程不需要先付费。",
    tip: "OpenRouter 是 Hunter Alpha（小米 mimo-v2）当前的主要访问入口。",
  },
  {
    number: "02",
    title: "找到 Hunter Alpha",
    description:
      "登录后搜索 “Hunter Alpha”，或进入模型目录查看 “openrouter/hunter-alpha”。进入模型页即可开始对话。",
    tip: "你也可以直接使用模型页链接，减少在目录中查找的时间。",
  },
  {
    number: "03",
    title: "开始对话",
    description:
      "当前模型免费开放，直接在对话框发送问题即可。它支持最长 1M tokens 上下文，适合长文档分析、长对话和资料整理。",
    tip: "先用自己的真实资料测试上下文长度和答案结构，比只问身份更有参考价值。",
  },
  {
    number: "04",
    title: "分享你的发现",
    description:
      "如果你发现了价格变化、异常回复或新的规格信息，欢迎提交到证据墙，帮助社区保持信息更新。",
    tip: "截图、时间、提示词和完整回复会让证据更有价值。",
  },
];

const quickLinks = [
  { href: "/zh/faq", label: "中文 FAQ" },
  { href: "/faq", label: "English FAQ" },
  { href: "/evidence", label: "Evidence Wall" },
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
          <span className="gradient-text">如何使用 Hunter Alpha</span>
        </h1>
        <p className="max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          Hunter Alpha 已确认为小米 mimo-v2。下面是它在 OpenRouter 上的中文访问步骤。
        </p>
        <p className="mt-4 text-sm px-4 py-2 rounded-lg inline-block border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          身份已确认：Hunter Alpha = Xiaomi mimo-v2
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-violet-400 mb-1">免费</div>
          <div className="text-sm" style={{ color: "var(--muted)" }}>当前价格</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-teal-400 mb-1">1M</div>
          <div className="text-sm" style={{ color: "var(--muted)" }}>上下文窗口</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-pink-400 mb-1">文本</div>
          <div className="text-sm" style={{ color: "var(--muted)" }}>纯文本模型</div>
        </Card>
      </div>

      <NativeBanner />

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
                <p className="mb-4" style={{ color: "var(--muted)" }}>{step.description}</p>
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

      <div className="flex flex-wrap justify-center gap-3 mt-12">
        <ExternalLinkWithSmartlink
          href="https://openrouter.ai/openrouter/hunter-alpha"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          打开 Hunter Alpha
        </ExternalLinkWithSmartlink>
        <Link
          href="/evidence"
          className="px-6 py-3 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium hover:bg-violet-500/20 transition-colors"
        >
          提交证据
        </Link>
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
