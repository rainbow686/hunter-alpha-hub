-- 创建 user_achievements 表
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(nickname, achievement_type)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_achievements_nickname ON user_achievements(nickname);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON user_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_achievements_achieved_at ON user_achievements(achieved_at DESC);

-- 启用行级安全 (RLS)
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许任何人查看
DROP POLICY IF EXISTS "Anyone can view achievements" ON user_achievements;
CREATE POLICY "Anyone can view achievements"
  ON user_achievements
  FOR SELECT
  USING (true);

-- 创建策略：允许系统插入成就（通过证据提交触发）
DROP POLICY IF EXISTS "System can grant achievements" ON user_achievements;
CREATE POLICY "System can grant achievements"
  ON user_achievements
  FOR INSERT
  WITH CHECK (true);

-- 创建成就配置表
CREATE TABLE IF NOT EXISTS achievement_definitions (
  type TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement INTEGER DEFAULT 1
);

-- 插入默认成就定义
INSERT INTO achievement_definitions (type, name, description, icon, requirement) VALUES
  ('first_evidence', 'First Clue', 'Submitted your first evidence', '🔍', 1),
  ('detective', 'Detective', 'Submitted 5 pieces of evidence', '🕵️', 5),
  ('expert', 'Expert Investigator', 'Submitted 10 pieces of evidence', '🎖️', 10),
  ('master', 'Master Sleuth', 'Submitted 25 pieces of evidence', '👑', 25),
  ('high_impact', 'High Impact', 'Submitted a High importance evidence', '🔥', 1),
  ('community_favorite', 'Community Favorite', 'Received 10 likes on your evidence', '❤️', 10)
ON CONFLICT (type) DO NOTHING;
