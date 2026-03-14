# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Hunter Alpha Hub** - Hunter Alpha 模型的第三方追踪站 + 证据墙 + 工具站

### 核心战略
- **短期**: 抓流量（代号热度）
- **中期**: 沉淀 UGC 证据
- **长期**: 转型为评测工具站

## 核心功能

### 1. 首页 (/)
- 一句话简介：追踪 Hunter Alpha 身份谜题
- 最新动态：显示最近 3 条证据墙更新
- 邮件订阅框：收集邮箱，模型身份曝光时通知用户

### 2. 证据墙 (/evidence)
- 线索提交表单：标题、描述、昵称、证据链接
- 线索列表：按时间倒序排列，每个卡片显示标题、描述、昵称、点赞按钮
- 数据存储：本地 JSON 文件 (data/evidence.json)

### 3. 监控页 (/monitor)
- 模型状态：显示 Hunter Alpha 在线/离线（调用 OpenRouter API）
- 规格参数：1T 参数、1M 上下文、多模态
- 社区讨论摘要：mock 数据展示

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

# 开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务
npm start

# 类型检查
npx tsc --noEmit

# Lint
npm run lint
```

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
      "createdAt": "ISO 时间戳"
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
