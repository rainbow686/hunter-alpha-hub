export interface ChineseFaq {
  category: string;
  question: string;
  answer: string;
}

export const chineseFaqs: ChineseFaq[] = [
  {
    category: "基础",
    question: "Hunter Alpha 是什么？",
    answer:
      "Hunter Alpha 是小米 mimo-v2 在 OpenRouter 上的展示名称。身份已经确认：Hunter Alpha = Xiaomi mimo-v2。它当前提供免费访问，并支持最长 1M tokens 的上下文窗口。",
  },
  {
    category: "访问",
    question: "中文用户怎么访问 Hunter Alpha？",
    answer:
      "先在 OpenRouter 注册账号，然后在模型目录搜索 Hunter Alpha，或直接打开 openrouter/hunter-alpha 模型页。登录后即可在网页对话界面发送中文或英文问题。",
  },
  {
    category: "价格",
    question: "Hunter Alpha 现在免费吗？",
    answer:
      "OpenRouter 页面当前显示输入和输出价格为 $0，也就是可以免费试用。价格可能随平台策略变化，长期使用前最好再次查看模型页或监控页。",
  },
  {
    category: "规格",
    question: "1M tokens 上下文到底有多大？",
    answer:
      "1M tokens 约等于几十万字的中文或英文资料。它可以一次性读取较长报告、论文、代码库片段或多轮会议记录，但仍受输出长度和实际响应时间限制。",
  },
  {
    category: "能力",
    question: "它能看图片、听音频或生成视频吗？",
    answer:
      "目前 Hunter Alpha / mimo-v2 被识别为纯文本模型，主要适合文本对话、摘要、改写、推理、长资料分析和代码讨论。多模态能力应以 OpenRouter 的规格页为准。",
  },
  {
    category: "使用",
    question: "适合用它做什么？",
    answer:
      "适合长文档摘要、资料对比、写作建议、代码解释、研究笔记整理和上下文压力测试。对需要联网实时数据的任务，要先确认模型是否会返回最新结果。",
  },
  {
    category: "社区",
    question: "在哪里讨论新发现？",
    answer:
      "可以在 Reddit、X/Twitter、Discord 和中文技术社区讨论。如果你有价格、规格、性能或身份相关的新证据，也可以提交到本站证据墙。",
  },
  {
    category: "安全",
    question: "使用时要注意什么？",
    answer:
      "不要提交密码、密钥、私人身份信息或商业机密。模型的回答可能出错，重要结论要交叉验证；测试时保留时间、提示词和截图会让证据更可靠。",
  },
];
