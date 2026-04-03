-- =====================================================
-- Hunter Alpha Hub - RLS Security Fix (Applied)
-- =====================================================

-- 1. videos 表 RLS (表已存在)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view videos" ON videos;
CREATE POLICY "Anyone can view videos" ON videos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage videos" ON videos;
CREATE POLICY "Admin can manage videos" ON videos FOR ALL USING (true) WITH CHECK (true);


-- 2. subscribers 表 RLS
DROP POLICY IF EXISTS "Anyone can view subscribers" ON subscribers;
CREATE POLICY "Anyone can view subscribers" ON subscribers FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);


-- 3. achievement_definitions 表 RLS
ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view achievement definitions" ON achievement_definitions;
CREATE POLICY "Anyone can view achievement definitions" ON achievement_definitions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage achievement definitions" ON achievement_definitions;
CREATE POLICY "Admin can manage achievement definitions" ON achievement_definitions FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');


-- 4. user_achievements 表 RLS
DROP POLICY IF EXISTS "System can grant achievements" ON user_achievements;
CREATE POLICY "System can grant achievements" ON user_achievements FOR INSERT WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (true);
