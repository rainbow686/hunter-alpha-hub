# 自动证据获取程序

每天自动从 Reddit 等平台搜索并获取 Hunter Alpha 相关证据。

## 功能

- 🔍 根据预设关键词自动搜索
- 🤖 AI 内容过滤（判断是否与 Hunter Alpha 相关）
- 📝 自动插入 Supabase 数据库
- 👤 Nickname 使用 150 个常见英文名循环

## 本地运行

```bash
# 设置环境变量
export SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# 运行脚本
npx ts-node scripts/fetch-evidence.ts
```

## GitHub Actions 自动运行

脚本已配置为每天运行一次（UTC 时间凌晨 2 点）。

触发方式：
1. Push 到 main 分支
2. 每天定时运行
3. 手动在 Actions 中触发

## 自定义关键词

编辑 `scripts/fetch-evidence.ts` 中的 `SEARCH_KEYWORDS` 数组：

```typescript
const SEARCH_KEYWORDS = [
  'Hunter Alpha AI',
  'Hunter Alpha model',
  // 添加更多关键词...
];
```

## 注意事项

- Reddit API 有速率限制，每次运行最多获取 100 条内容
- 重复内容会被自动过滤
- 建议先本地测试再启用自动运行
