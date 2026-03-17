-- 创建订阅者表
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- 启用行级安全 (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许任何人插入（公开订阅）
CREATE POLICY "Anyone can subscribe"
  ON subscribers
  FOR INSERT
  WITH CHECK (true);

-- 创建策略：只允许管理员查看（需要服务角色密钥）
-- 注意：SELECT 策略需要服务角色密钥，客户端匿名密钥无法查询
