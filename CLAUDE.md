# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Hunter Alpha Hub** - Hunter Alpha 模型的第三方追踪站 + 证据墙 + 工具站

### 核心战略
- **短期**: 抓流量（代号热度）
- **中期**: 沉淀 UGC 证据
- **长期**: 转型为评测工具站

### 产品定位（第一性原理分析）

用户通过关键词搜索过来的核心意图：
1. **了解 Hunter Alpha 是什么** - 需要清晰的简介和背景说明
2. **获取最新信息** - 模型状态、价格、规格等实时数据
3. **参与讨论** - 查看和提交证据，参与社区调查
4. **快速获得结论** - 已知事实 vs 推测理论的清晰区分

 site 设计原则：
- 首页即答案：访客在 5 秒内理解 Hunter Alpha 是什么
- 已知事实与推测理论分离，避免混淆
- 证据按重要性分级，帮助用户快速识别关键线索

## 核心功能

### 1. 首页 (/)
- **Hero 区域**: 一句话简介 + 3 个标签（AI Mystery, Community Investigation, Open Source Intelligence）
- **TL;DR 部分**: 3 个快速问答卡片（基于 OpenRouter 官方数据）
- **Known Facts 部分**: 4 个确认事实卡片（1M 上下文、1T 参数、免费使用、仅文本模型），带图标
- **Popular Theories 部分**: 3 个社区推测卡片，带置信度标签（High/Medium/Low）
- **最新动态**: 显示最近 3 条证据墙更新
- **邮件订阅框**: 收集邮箱，模型身份曝光时通知用户

### 2. 证据墙 (/evidence)
- 线索提交表单：标题、描述、昵称、证据链接、**重要性标签**（High/Medium/Low）
- 线索列表：按时间倒序排列，卡片显示标题、描述、昵称、点赞按钮、**重要性标签**
- 重要性颜色：High=红色，Medium=黄色，Low=灰色
- 数据存储：本地 JSON 文件 (data/evidence.json)

### 3. 监控页 (/monitor)
- 模型状态：显示 Hunter Alpha 在线/离线（调用 OpenRouter API 免费接口）
- 规格参数：从 OpenRouter API 实时获取（上下文长度、定价、多模态支持、参数等）
- **手动刷新按钮**: 用户可主动刷新状态，带加载动画
- **自动刷新**: 每 30 秒自动刷新一次
- **免费标识**: 当定价为 0 时显示 "Free to use!" 徽章
- 社区讨论摘要：mock 数据展示

**真实规格数据**（来自 OpenRouter API）：
- 参数：1 Trillion
- 上下文窗口：1,048,576 tokens
- 价格：免费（$0/0 tokens）
- 提供商：Unknown
- 上架日期：2026-03-12

### 4. FAQ (/faq)
- 可折叠的问答列表，按类别过滤（General, Access, Technical, Community）
- 涵盖常见问题：如何访问、价格、上下文窗口、基础模型等
- 答案基于 OpenRouter 官方数据和真实信息
- SEO 导向，捕获长尾搜索流量

### 5. 访问指南 (/access)
- 4 步教程：创建 OpenRouter 账户 → 找到 Hunter Alpha → 开始使用 → 分享发现
- 关键信息卡片：免费价格、1M 上下文、仅文本
- CTA 引导：提交证据、打开 OpenRouter

### 6. 时间线 (/timeline)
- 基于真实事件的时间线（数据来源于 OpenRouter API）
- 关键事件：2026 年 3 月 12 日上架 OpenRouter、1M 上下文窗口被发现、身份谜团开始、Hub 创建
- 事件类型：Discovery, Discussion, Milestone, Theory
- 每个事件标注类型和日期

### 7. 模型对比 (/comparison)
- Hunter Alpha vs Claude 3.5 Sonnet vs GPT-4o vs Gemini 1.5 Pro vs Command R+
- 对比维度：上下文窗口、价格、是否多模态、提供商、关键特性
- 优势与局限性分析

## 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: TailwindCSS + 深色主题
- **语言**: TypeScript
- **部署**: Vercel
- **数据存储**: 本地 JSON 文件 (data/evidence.json, data/subscribers.json) → 后期迁移到 Supabase
- **邮件服务**: ConvertKit API（初期 mock）

## 项目结构

```
app/              # 页面组件 (Next.js App Router)
  api/            # API 路由
  page.tsx        # 首页 (/)
  evidence/       # 证据墙页面
  monitor/        # 监控页面
  faq/            # FAQ 页面
  access/         # 访问指南页面
  timeline/       # 时间线页面
  comparison/     # 模型对比页面
components/       # 可复用组件
data/             # 本地数据文件 (git 忽略)
  evidence.json   # 证据线索数据
  subscribers.json # 邮件订阅者数据
lib/              # 工具函数
.env.local        # 环境变量
```

## 开发命令

```bash
# 安装依赖
npm install

# 开发服务器（每次重启前需清理缓存）
rm -rf .next && npm run dev

# 生产构建
npm run build

# 启动生产服务
npm start

# 类型检查
npx tsc --noEmit

# Lint
npm run lint
```

**注意**: Next.js 15.5.12 存在缓存问题，重启开发服务器前必须先清理 `.next` 缓存

## UI 设计规范

### 颜色
- **背景**: `bg-gray-900` 或 `bg-black`
- **主色**: 紫色 `#8b5cf6` (violet-500)
- **强调色**: 青色 `#14b8a6` (teal-500)
- **渐变**: 紫色 → 青色渐变用于强调元素

### 组件风格
- 卡片式设计，带圆角和微光边框
- 终端风格元素（光标闪烁效果、等宽字体点缀）
- 字体使用 Inter 或默认系统字体

### 主题示例
```tsx
// 渐变按钮示例
className="bg-gradient-to-r from-violet-500 to-teal-500"

// 卡片示例
className="bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur"

// 终端风格文本
className="font-mono text-teal-400"
```

## 数据约定

### evidence.json 结构
```json
{
  "evidence": [
    {
      "id": "uuid",
      "title": "标题",
      "description": "描述",
      "nickname": "提交者昵称",
      "evidenceUrl": "证据链接",
      "likes": 0,
      "createdAt": "ISO 时间戳",
      "importance": "High|Medium|Low"
    }
  ]
}
```

### subscribers.json 结构
```json
{
  "subscribers": [
    {
      "email": "user@example.com",
      "subscribedAt": "ISO 时间戳"
    }
  ]
}
```

## 环境变量

使用 `.env.local` 管理：

```
CONVERTKIT_API_KEY=xxx
OPENROUTER_API_KEY=xxx
```

## API 路由

- `POST /api/evidence` - 提交新线索
- `GET /api/evidence` - 获取线索列表
- `POST /api/evidence/[id]/like` - 点赞线索
- `POST /api/subscribe` - 邮件订阅
- `GET /api/status` - Hunter Alpha 模型状态（OpenRouter API）

## 未来扩展

- **多语言支持**: 英文为主，中文为辅。后期将引入国际化框架（如 next-intl），实现双语路由（/en/* 和 /zh/*）。MVP 阶段暂不实现，所有界面使用英文。

## SEO 策略

已实现的 SEO 优化：
- 每个页面都有独立的 metadata（title, description, keywords）
- TL;DR 摘要直接回答用户核心问题，提高页面停留时间
- FAQ 页面捕获长尾搜索流量（how to, what is, is it free 等）
- 时间线和对比页面吸引反向链接
- 语义化 HTML 结构和清晰的页面层级

目标关键词：
- 核心词：Hunter Alpha, Hunter Alpha AI, Hunter Alpha OpenRouter
- 长尾词：Hunter Alpha how to access, Hunter Alpha context window, Hunter Alpha vs Claude, Hunter Alpha free
