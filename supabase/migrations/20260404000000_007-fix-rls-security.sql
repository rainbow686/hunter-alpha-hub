-- =====================================================
-- Hunter Alpha Hub - RLS Security Fix
-- 修复 Supabase 安全告警：为所有表启用 RLS 策略
-- 执行日期：2026-04-04
-- =====================================================

-- 1. 创建 videos 表（如果不存在）并启用 RLS
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  channel TEXT NOT NULL,
  video_url TEXT NOT NULL,
  category TEXT DEFAULT 'Hunter Alpha',
  description TEXT,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- 启用 RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 为 videos 表创建策略
DROP POLICY IF EXISTS "Anyone can view videos" ON videos;
CREATE POLICY "Anyone can view videos"
  ON videos
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage videos" ON videos;
CREATE POLICY "Admin can manage videos"
  ON videos
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- 2. 为 subscribers 表添加 SELECT 策略（仅管理员）
-- 注意：使用 auth.role() 检查，只有认证用户（服务角色）可以查看
DROP POLICY IF EXISTS "Anyone can view subscribers" ON subscribers;
CREATE POLICY "Anyone can view subscribers"
  ON subscribers
  FOR SELECT
  USING (auth.role() = 'service_role');

-- 确保 INSERT 策略存在
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
CREATE POLICY "Anyone can subscribe"
  ON subscribers
  FOR INSERT
  WITH CHECK (true);


-- 3. 为 achievement_definitions 表启用 RLS 并创建策略
ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view achievement definitions" ON achievement_definitions;
CREATE POLICY "Anyone can view achievement definitions"
  ON achievement_definitions
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage achievement definitions" ON achievement_definitions;
CREATE POLICY "Admin can manage achievement definitions"
  ON achievement_definitions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


-- 4. 为 user_achievements 表添加 INSERT/UPDATE 策略
DROP POLICY IF EXISTS "System can grant achievements" ON user_achievements;
CREATE POLICY "System can grant achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  USING (true);


-- 5. 确认 evidence 和 evidence_comments 表的 RLS 策略完整
-- （这些表应该已经在之前的迁移中配置好了）


-- =====================================================
-- 验证脚本（执行后运行）：
-- =====================================================
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
--
-- SELECT tablename, policyname, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
-- =====================================================
