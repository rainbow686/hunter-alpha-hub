# GSC OX-Alpha 维度接入指南

## 目标
在 GSC Search Analytics 中新增 OX Alpha 分组，使 `/api/stats` 的 `keywordGroups` 与真实搜索表现对齐。

## 分组定义（已固化）
见 `lib/gsc-keywords.ts`：`ox_alpha` / `hunter_alpha` / `comparison` 三组，正则已覆盖 `ox alpha`, `ox-alpha`, `what is ox alpha ai`, `ox alpha vs hunter alpha` 等。

## 方案 A — 手动（当前可用，满足 RAINBOW686-12 验收）
1. GSC → Performance → Search results → + New → Query → 填正则或手工筛选：`ox alpha`
2. 对比 Hunter Alpha 组，截图留存
3. 将点击/展示/CTR/排名 手工录入看板，或直接调用 `evaluateStopLoss()` 判定止损
4. `/api/stats` 中 `gsc.status` 保持 `manual_pending`，`oxAlpha.stopLoss.volumes` 由孙斌的 Keyword Planner 截图驱动

## 方案 B — 自动化（建议 Phase1 触发后接入）
1. Google Cloud → 启用 Search Console API
2. 创建 Service Account → 在 GSC 中授权（Owner 权限添加用户）
3. 后端 `lib/gsc-client.ts` 拉取：
   ```
   POST https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query
   { startDate, endDate, dimensions: ["query"], rowLimit: 1000 }
   ```
4. 用 `classifyKeyword()` 聚合到三组，写入 `gsc_daily_stats`（Supabase 新表）
5. `/api/stats` 聚合该表，填充 `gsc.lastSyncedAt` 与各组 clicks/impressions
6. 看板在 `/monitor` 新增 OX 趋势卡片

## 验证
- GSC 筛选后 Top queries 应出现 Bull 词（若已上线 /ox-alpha）
- `/api/stats?dimension=ox_alpha` 应与 GSC 手工筛选一致（±10% 容差）
