-- 创建 evidence_comments 表
CREATE TABLE IF NOT EXISTS evidence_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_comments_evidence_id ON evidence_comments(evidence_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON evidence_comments(created_at DESC);

-- 启用行级安全 (RLS)
ALTER TABLE evidence_comments ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许任何人查看
DROP POLICY IF EXISTS "Anyone can view comments" ON evidence_comments;
CREATE POLICY "Anyone can view comments"
  ON evidence_comments
  FOR SELECT
  USING (true);

-- 创建策略：允许任何人提交评论
DROP POLICY IF EXISTS "Anyone can submit comments" ON evidence_comments;
CREATE POLICY "Anyone can submit comments"
  ON evidence_comments
  FOR INSERT
  WITH CHECK (true);
