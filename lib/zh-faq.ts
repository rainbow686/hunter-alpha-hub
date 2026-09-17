/**
 * 中文 FAQ —— 与 lib/faq.ts 同一条事实纪律，只是语言不同。
 *
 * 为什么重写（2026-09-18）：这一份原来还在说「Hunter Alpha 当前免费」「纯文本模型」
 * 「可以提交到证据墙」。三句里两句是过期事实、一句指向已退役页面 —— 而它同时被页面
 * 渲染和 FAQPage JSON-LD 读取，等于向人和 Google 各发一份错的事实。
 *
 * 写在这里的规则：
 *   - 能复核的字段（上下文、输出上限、模态、价格）写成事实，并注明数据日期；
 *   - 其余（参数量、架构、身份猜测、揭晓后的预期定价）标为「声称」并注明来源；
 *   - 不链接已退役页面；
 *   - 每一条都能脱离上下文单独被引用。
 */

export interface ChineseFaq {
  category: string;
  question: string;
  answer: string;
  links?: { href: string; label: string }[];
}

export const chineseFaqs: ChineseFaq[] = [
  {
    category: "基础",
    question: "Hunter Alpha 是什么？",
    answer:
      "Hunter Alpha 是一个匿名代号。2026 年 3 月它以「没有厂商」的状态出现在 OpenRouter 上，同月被小米认领，现在是 Xiaomi MiMo-V2.5 这个正式产品。代号已经退役：模型页上读到的才是当前事实，本站的归档页只留历史。",
    links: [
      { href: "/openrouter-models/mimo-v2.5", label: "Xiaomi MiMo-V2.5 模型页" },
      { href: "/hunter-alpha", label: "Hunter Alpha 归档" },
    ],
  },
  {
    category: "基础",
    question: "Hunter Alpha 是谁做的？",
    answer:
      "小米。发布时是匿名的 —— OpenRouter 当时不显示厂商 —— 小米在 2026 年 3 月确认它就是自家的 MiMo 系列。这次揭晓之后，Alpha 这条线上的每一次发布都走了同一套流程。",
  },
  {
    category: "Alpha 系列",
    question: "Alpha 系列是什么？",
    answer:
      "Alpha 是 OpenRouter 上匿名发布的命名规律：免费预览上线、社区猜身份、厂商认领后改名成正式产品。目前本站能记录三个：Hunter Alpha（后来的 Xiaomi MiMo-V2.5）、OX Alpha（后来的 Z.ai GLM 5.3 Flash），以及还没有被认领的 Union Alpha。",
    links: [
      { href: "/stealth-models", label: "全部匿名发布登记册" },
      { href: "/alpha-models", label: "这条线怎么运作" },
    ],
  },
  {
    category: "Alpha 系列",
    question: "现在活着的是哪个匿名模型？",
    answer:
      "Union Alpha（截至 2026-09-18）：262,144 tokens 上下文、最多 131,072 tokens 输出、支持文本与图像输入，在 OpenRouter 上价格为 $0。匿名端点随时可能下架或改价，所以追踪页是实时读目录，而不是拿旧快照。",
    links: [
      { href: "/union-alpha", label: "Union Alpha 追踪页" },
      { href: "/api/union-alpha/status", label: "实时状态接口" },
    ],
  },
  {
    category: "价格",
    question: "Hunter Alpha 现在还免费吗？",
    answer:
      "不免费了。它在匿名期间是免费的；被小米认领、改名成 MiMo-V2.5 之后，就变成了 OpenRouter 上按量计费的普通模型 —— 本站目录快照（2026-09-17）读到的是输入 $0.14、输出 $0.28 每百万 tokens。这条线上的免费预览，到目前为止每一次都以同样的方式结束。",
    links: [{ href: "/openrouter-models/mimo-v2.5", label: "MiMo-V2.5 当前价格" }],
  },
  {
    category: "价格",
    question: "Union Alpha 免费到什么时候？",
    answer:
      "今天确实按 $0 计费（读的是 OpenRouter 公开目录）。能免费多久不知道：厂商是匿名的，这条线从来没有公布过通知期；而针对该模型发布的一些材料里，写的是预览结束后约 $0.50 输入 / $1.50 输出每百万 tokens —— 这一条是第三方声称，不是我们核实过的价格。",
    links: [
      { href: "/union-alpha-free", label: "免费窗口是怎么回事" },
      { href: "/union-alpha-opencode", label: "通过 OpenCode 使用" },
    ],
  },
  {
    category: "规格",
    question: "Hunter Alpha / MiMo-V2.5 支持图像吗？",
    answer:
      "当前目录条目（2026-09-17）列出的是文本、图像、音频、视频四类输入。匿名预览当时被描述成纯文本 —— 所以模态这件事请在模型页上重新确认，而不是把它当成代号一辈子不变的属性。",
    links: [{ href: "/openrouter-models/mimo-v2.5", label: "MiMo-V2.5 目录字段" }],
  },
  {
    category: "规格",
    question: "1M tokens 上下文到底有多大？",
    answer:
      "约等于几十万字的中文或英文资料。实际能做的是：一次性读完较长的报告、论文、代码片段或多轮会议记录 —— 但仍然受输出长度和响应时间限制。具体数字以目录为准：MiMo-V2.5 当前读到的是 1,050,000 tokens。",
    links: [{ href: "/comparison", label: "和各模型的上下文对比" }],
  },
  {
    category: "匿名模型",
    question: "一个匿名模型被揭晓后会怎样？",
    answer:
      "依次三件事：厂商认领；代号退役、模型改名为正式产品名；免费预览变成普通的按量计费。旧代号通常从目录里消失，这也是为什么我们保留登记册，而不是依赖一个迟早会消失的列表。",
    links: [{ href: "/stealth-models", label: "每个代号后来变成了什么" }],
  },
  {
    category: "方法",
    question: "本站怎么区分事实和声称？",
    answer:
      "能重新读到的字段 —— 上下文窗口、输出上限、模态、工具支持、价格 —— 作为事实写出，并带来源和日期。其余所有内容，包括参数量、架构说法和身份猜测，都标注为「声称」并注明是谁说的。宁可把页面写短，也不写一句听起来很确定的猜测。",
    links: [{ href: "/comparison", label: "对比我们追踪的模型" }],
  },
];
