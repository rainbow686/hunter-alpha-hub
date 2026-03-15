-- =====================================================
-- Hunter Alpha Hub - Complete Database Setup
-- 在 Supabase Dashboard SQL Editor 中执行此脚本
-- =====================================================

-- 1. 创建 evidence 表
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

-- 2. 创建 subscribers 表
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_evidence_created_at ON evidence(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evidence_importance ON evidence(importance);
CREATE INDEX IF NOT EXISTS idx_evidence_external_url ON evidence(external_discussion_url);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- 4. 启用 RLS
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略（evidence）
DROP POLICY IF EXISTS "Anyone can view evidence" ON evidence;
CREATE POLICY "Anyone can view evidence"
  ON evidence
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can submit evidence" ON evidence;
CREATE POLICY "Anyone can submit evidence"
  ON evidence
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can like evidence" ON evidence;
CREATE POLICY "Anyone can like evidence"
  ON evidence
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 6. 创建 RLS 策略（subscribers）
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
CREATE POLICY "Anyone can subscribe"
  ON subscribers
  FOR INSERT
  WITH CHECK (true);

-- 7. 创建 increment_likes 函数
CREATE OR REPLACE FUNCTION increment_likes(evidence_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_likes INTEGER;
BEGIN
  UPDATE evidence
  SET likes = likes + 1
  WHERE id = evidence_id
  RETURNING likes INTO new_likes;

  RETURN new_likes;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 执行完成！验证：
-- SELECT * FROM evidence;
-- SELECT * FROM subscribers;
-- =====================================================
