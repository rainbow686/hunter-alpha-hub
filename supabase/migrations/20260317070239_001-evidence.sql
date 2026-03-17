-- 创建 evidence 表（基础结构）
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_evidence_created_at ON evidence(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evidence_importance ON evidence(importance);
CREATE INDEX IF NOT EXISTS idx_evidence_external_url ON evidence(external_discussion_url);

-- 启用行级安全 (RLS)
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许任何人查看
DROP POLICY IF EXISTS "Anyone can view evidence" ON evidence;
CREATE POLICY "Anyone can view evidence"
  ON evidence
  FOR SELECT
  USING (true);

-- 创建策略：允许任何人提交
DROP POLICY IF EXISTS "Anyone can submit evidence" ON evidence;
CREATE POLICY "Anyone can submit evidence"
  ON evidence
  FOR INSERT
  WITH CHECK (true);

-- 创建策略：允许任何人点赞
DROP POLICY IF EXISTS "Anyone can like evidence" ON evidence;
CREATE POLICY "Anyone can like evidence"
  ON evidence
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
