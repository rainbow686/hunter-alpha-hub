-- 为 evidence 表添加外部讨论链接字段
ALTER TABLE evidence ADD COLUMN IF NOT EXISTS external_discussion_url TEXT;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_evidence_external_url ON evidence(external_discussion_url);
