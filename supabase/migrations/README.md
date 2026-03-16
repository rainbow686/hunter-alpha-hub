# Supabase 迁移指南

本文件夹包含 Hunter Alpha Hub 项目所需的 Supabase 数据库迁移脚本。

## 迁移文件说明

### 001-evidence.sql（未提供）
创建 evidence 表的基础结构。如果这是您第一次设置，请先创建 evidence 表：

```sql
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  nickname TEXT NOT NULL,
  evidence_url TEXT,
  external_discussion_url TEXT,
  importance TEXT DEFAULT 'Medium',
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_created_at ON evidence(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evidence_importance ON evidence(importance);
```

### 002-subscribers.sql
创建邮件订阅者表：
- 表名：subscribers
- 字段：id, email, subscribed_at, created_at
- RLS 策略：允许任何人订阅

### 003-evidence-external-url.sql
为 evidence 表添加外部讨论链接字段：
- 新增字段：external_discussion_url
- 索引：idx_evidence_external_url

### 004-evidence-like-routes.sql
创建点赞功能和 RLS 策略：
- 函数：increment_likes(UUID) - 原子性增加点赞数
- RLS 策略：
  - "Anyone can view evidence" - 允许查看
  - "Anyone can submit evidence" - 允许提交
  - "Anyone can like evidence" - 允许点赞

### 005-evidence-comments.sql（新增）
创建证据评论系统：
- 表名：evidence_comments
- 字段：id, evidence_id, nickname, content, created_at
- 外键：evidence_id REFERENCES evidence(id) ON DELETE CASCADE
- RLS 策略：
  - "Anyone can view comments" - 允许查看
  - "Anyone can submit comments" - 允许提交

## 执行顺序

1. 如果是新数据库，先执行 001-evidence.sql（基础表结构）
2. 执行 002-subscribers.sql（订阅者表）
3. 执行 003-evidence-external-url.sql（外部链接字段）
4. 执行 004-evidence-like-routes.sql（点赞功能）
5. 执行 005-evidence-comments.sql（评论功能）

## 在 Supabase 中执行

1. 登录 Supabase Dashboard
2. 选择您的项目
3. 进入 SQL Editor
4. 复制迁移文件内容并执行

或者使用 Supabase CLI：
```bash
supabase db push
```

## 验证

执行迁移后，检查以下内容：

1. evidence 表包含所有字段（包括 external_discussion_url）
2. subscribers 表存在且有正确的 RLS 策略
3. increment_likes 函数存在
4. 所有 RLS 策略已启用
5. evidence_comments 表存在且有正确的 RLS 策略

```sql
-- 检查函数
SELECT * FROM pg_proc WHERE proname = 'increment_likes';

-- 检查 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'evidence';

-- 检查评论表
SELECT * FROM pg_tables WHERE tablename = 'evidence_comments';
```
