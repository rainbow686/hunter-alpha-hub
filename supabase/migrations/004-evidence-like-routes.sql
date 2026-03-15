-- 创建 increment_likes 函数
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

-- 更新 RLS 策略：允许任何人更新 likes 字段
DROP POLICY IF EXISTS "Anyone can like evidence" ON evidence;
CREATE POLICY "Anyone can like evidence"
  ON evidence
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 确保匿名用户可以查看证据
DROP POLICY IF EXISTS "Anyone can view evidence" ON evidence;
CREATE POLICY "Anyone can view evidence"
  ON evidence
  FOR SELECT
  USING (true);

-- 确保匿名用户可以插入证据
DROP POLICY IF EXISTS "Anyone can submit evidence" ON evidence;
CREATE POLICY "Anyone can submit evidence"
  ON evidence
  FOR INSERT
  WITH CHECK (true);
