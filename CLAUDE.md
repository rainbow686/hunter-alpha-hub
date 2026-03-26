# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Hunter Alpha Hub** - Hunter Alpha（小米 mimo-v2）档案站 + 社区资源站

**身份已揭晓**: Hunter Alpha 已确认为小米公司的 mimo-v2 模型。本网站已从神秘追踪站转型为 mimo-v2 社区资源站。

### 核心战略调整
- **短期**: 保留现有内容，添加身份揭晓说明
- **中期**: 继续通过 AdSense 变现长尾流量，增加深度原创内容
- **长期**: 作为 mimo-v2 社区资源站持续运营

### 当前状态
- 身份已揭晓：Hunter Alpha = 小米 mimo-v2
- 流量高峰已过，进入长尾阶段
- 持续更新深度教程和用例内容，保持社区活跃

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
- 线索提交表单：标题、描述、昵称、证据链接、**外部讨论链接**、重要性标签（High/Medium/Low）
- 线索列表：按时间倒序排列，卡片显示标题、描述、昵称、点赞按钮、重要性标签
- 重要性颜色：High=红色，Medium=黄色，Low=灰色
- **外部讨论链接**: 支持 Reddit/Twitter 链接，提交后可在证据卡片上显示"Join Discussion"按钮
- **数据存储**: Supabase PostgreSQL

### 3. 监控页 (/monitor)
- 模型状态：显示 Hunter Alpha 在线/离线（调用 OpenRouter API 免费接口）
- 规格参数：从 OpenRouter API 实时获取（上下文长度、定价、多模态支持、参数等）
- **手动刷新按钮**: 用户可主动刷新状态，带加载动画
- **自动刷新**: 每 30 秒自动刷新一次
- **免费标识**: 当定价为 0 时显示 "Free to use!" 徽章
- **社区讨论聚合**: 从证据墙 submissions 中聚合带外部链接的讨论，自动识别来源（Reddit/Twitter/Evidence Wall）并显示对应图标

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

### 8. 视频库 (/videos)
- 展示 Hunter Alpha 相关视频内容
- 分类：Hunter Alpha、AI Analysis、Context Technology
- YouTube 视频嵌入，自动生成缩略图
- 支持分页和分类筛选
- 数据存储：Supabase PostgreSQL

## 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: TailwindCSS + 深色主题
- **语言**: TypeScript
- **部署**: Vercel
- **数据库**: Supabase PostgreSQL (evidence, subscribers, videos 表)
- **邮件服务**: Supabase + ConvertKit/Resend（待集成）

## 项目结构

```
app/              # 页面组件 (Next.js App Router)
  api/            # API 路由
    /api/evidence         # 证据 CRUD
    /api/community        # 社区讨论聚合
    /api/subscribe        # 邮件订阅
    /api/status           # OpenRouter 模型状态
    /api/videos           # 视频管理
  page.tsx        # 首页 (/)
  evidence/       # 证据墙页面
  monitor/        # 监控页面
  faq/            # FAQ 页面
  access/         # 访问指南页面
  timeline/       # 时间线页面
  comparison/     # 模型对比页面
  videos/         # 视频库页面
components/       # 可复用组件
  card.tsx        # 卡片组件
  evidence-card.tsx       # 证据卡片
  evidence-form.tsx       # 证据提交表单
  navbar.tsx      # 导航栏
  footer.tsx      # 页脚
  analytics.tsx   # GA/AdSense 集成
lib/              # 工具函数
  supabase.ts     # Supabase 客户端
  types.ts        # TypeScript 类型定义
supabase/migrations/  # 数据库迁移脚本
  001-evidence.sql
  002-subscribers.sql
  003-evidence-external-url.sql
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

### Supabase 表结构

**evidence** - 证据线索表
```sql
id UUID PRIMARY KEY
title TEXT NOT NULL
description TEXT NOT NULL
nickname TEXT NOT NULL
evidence_url TEXT
external_discussion_url TEXT  -- Reddit/Twitter 等外部讨论链接
importance TEXT (High/Medium/Low)
likes INTEGER DEFAULT 0
created_at TIMESTAMPTZ
```

**subscribers** - 邮件订阅者表
```sql
id UUID PRIMARY KEY
email TEXT NOT NULL UNIQUE
subscribed_at TIMESTAMPTZ
created_at TIMESTAMPTZ
```

**videos** - 视频表
```sql
id UUID PRIMARY KEY
title TEXT NOT NULL
channel TEXT NOT NULL
video_url TEXT NOT NULL
category TEXT (Hunter Alpha/AI Analysis/Context Technology)
description TEXT
thumbnail_url TEXT
published_at TIMESTAMPTZ
view_count INTEGER DEFAULT 0
duration_seconds INTEGER
is_featured BOOLEAN
created_at TIMESTAMPTZ
```

## 环境变量

使用 `.env.local` 管理：

```
# Google Analytics & AdSense
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# 邮件服务（可选）
CONVERTKIT_API_KEY=xxx
```

## Supabase 迁移

按顺序执行以下迁移脚本（在 Supabase SQL Editor 中）：

1. `001-evidence.sql` - 创建 evidence 基础表
2. `002-subscribers.sql` - 创建订阅者表
3. `003-evidence-external-url.sql` - 添加外部讨论链接字段
4. `004-evidence-like-routes.sql` - 创建点赞函数和 RLS 策略

详见 `supabase/migrations/README.md`

## API 路由

- `GET/POST /api/evidence` - 获取/提交证据线索
- `POST /api/evidence/[id]/like` - 点赞证据
- `GET /api/community` - 获取社区讨论聚合（带外部链接的证据）
- `POST /api/subscribe` - 邮件订阅
- `GET /api/status` - Hunter Alpha 模型状态（OpenRouter API）
- `GET/POST /api/videos` - 获取/添加视频

## 已实现功能总结

### 核心功能（100% 完成）
- ✅ 首页 - Hero、TL;DR、Known Facts、Popular Theories、最新动态、邮件订阅
- ✅ 证据墙 - 提交表单、外部讨论链接、重要性标签、点赞功能
- ✅ 监控页 - 实时状态、规格参数、自动刷新、社区讨论聚合
- ✅ FAQ - 可折叠问答、分类过滤
- ✅ 访问指南 - 4 步教程、关键信息卡片
- ✅ 时间线 - 事件时间线、类型标注
- ✅ 模型对比 - 多模型对比、优势分析
- ✅ 视频库 - 视频展示、分类筛选、YouTube 嵌入

### 基础设施（100% 完成）
- ✅ Supabase PostgreSQL 数据库（3 张表）
- ✅ 邮件订阅功能
- ✅ Google Analytics 集成
- ✅ Google AdSense 集成
- ✅ SEO 优化（metadata、OpenGraph、Twitter Cards、Schema.org 结构化数据）
- ✅ 响应式设计、深色主题
- ✅ 隐私政策页面
- ✅ 证据点赞功能（SQL RPC + RLS 策略）
- ✅ 证据重要性筛选和分页
- ✅ 长尾关键词内容优化

### 待实现功能
- 🔄 邮件通知系统（模型身份曝光时自动发送）
- 🔄 多语言支持（i18n）
- 🔄 实时统计面板

## SEO 策略

已实现的 SEO 优化：
- 每个页面都有独立的 metadata（title, description, keywords）
- TL;DR 摘要直接回答用户核心问题，提高页面停留时间
- FAQ 页面捕获长尾搜索流量（how to, what is, is it free 等）
- 时间线和对比页面吸引反向链接
- 语义化 HTML 结构和清晰的页面层级
- Google Analytics & AdSense 集成
- 隐私政策页面（AdSense 合规）
- **Schema.org 结构化数据**（JSON-LD）：
  - `WebSite` - 网站首页
  - `Article` - 内容页面
  - `FAQPage` - FAQ 页面（Google 富搜索结果）
  - `BreadcrumbList` - 面包屑导航
- **长尾关键词内容**：
  - 首页添加 "About Hunter Alpha" 内容区块
  - 涵盖：what is, how to use, key features 等搜索意图
  - 规格参数列表化，提高搜索引擎抓取效率

目标关键词：
- 核心词：Hunter Alpha, Hunter Alpha AI, Hunter Alpha OpenRouter
- 长尾词：Hunter Alpha how to access, Hunter Alpha context window, Hunter Alpha vs Claude, Hunter Alpha free, what is Hunter Alpha, Hunter Alpha 1M context

---

## 广告占位符

页面已预留广告位，可在以下位置添加 AdSense 广告单元：
- 首页侧边栏
- 证据墙列表底部
- 视频库侧边栏
- 文章页面中间
