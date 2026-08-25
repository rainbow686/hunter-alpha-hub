# RAINBOW686-12 — GA4 + GSC 埋点与止损线验证手册

## 交付物总览

- GA4 事件：`ox_alpha_subscribe` / `tracker_click` / `ox_alpha_view`
- GSC 关键词分组：OX Alpha 维度新增，`/api/stats` 扩展（`keywordGroups` + `oxAlpha`）
- 止损线：任意关键词 >200/月 → Phase1 GO；全部 <200 → PAUSE

---

## 1. GA4 事件定义（已落地代码）

### 代码位置
- `lib/gtag.ts` — 统一 `gtagEvent` + 三个专用 helper
- `components/analytics.tsx` — GA 初始化（`NEXT_PUBLIC_GA_ID`），`debug_mode` 自动开启于非生产环境，SPA `page_view` 兜底
- `components/subscription-form.tsx` — 成功订阅后 `trackOxAlphaSubscribe({ method: "subscription_form" })`
- `app/home-client.tsx` — `tracker_click`（monitor/comparison/OX-Alpha teaser）、`ox_alpha_view`（home_teaser impression）
- `components/ox-alpha-tracker.tsx` — 供 `/ox-alpha` 常青页复用：`<OxAlphaTracker source="ox_alpha_page" />`

### 事件参数
| 事件 | 参数 | 说明 |
|---|---|---|
| `ox_alpha_subscribe` | `method`, `page_path`, `page_location` | 订阅来源；home_form vs ox_alpha_page |
| `tracker_click` | `tracker_id`, `link_url`, `location`, `page_path` | 入口点击；如 `ox_alpha_teaser` / `monitor_status_card` |
| `ox_alpha_view` | `source`, `page_path`, `page_location` | OX-Alpha 曝光；`home_teaser` / `direct` / `internal_link` |

### GA4 后台配置（一次性）
1. Admin → Events → Create event（或直接等 DebugView 命中后 Mark as conversion）
2. 将三事件标记为转换（Conversions）以便看板直接显示
3. 可选：Custom dimension 映射 `method` / `tracker_id` / `source`（Event scope）

---

## 2. 本地 DebugView 验证（验收必做）

前置：`.env.local` 设置
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

步骤：
1. 安装 Google Analytics Debugger 扩展，或直接用 GA4 DebugView
2. `npm run dev` 启动，在浏览器打开 `http://localhost:3000?debug_mode=1`（或 `gtag('config', GA_ID, { debug_mode: true })` 已自动在 dev 开启）
3. GA4 → Admin → DebugView → 选择你的设备
4. 操作：
   - 首页订阅任意邮箱 → 应看到 `ox_alpha_subscribe`（method=subscription_form）
   - 点击首页 OX-Alpha teaser / Monitor / Comparison 链接 → `tracker_click`
   - 访问 `/ox-alpha`（上线后）→ `ox_alpha_view`（source=ox_alpha_page）
5. 截图保留：DebugView 事件流 + 事件参数展开

> 若 GA_ID 未配置，所有 helper 为 no-op，不会报错，便于本地无 GA 开发。

---

## 3. GSC 关键词分组与 /api/stats

### 分组逻辑（`lib/gsc-keywords.ts`）
- `ox_alpha`：`/ox[\\s\\-_]*alpha/i` 覆盖 ox alpha / ox-alpha / oxalpha / what is ox alpha
- `hunter_alpha`：hunter alpha / mimo-v2
- `comparison`：ox vs hunter 共现（最高意图）
- `classifyKeyword(query)` 统一归类；`getOxAlphaDimensionMeta()` 供 API 复用

### /api/stats 扩展
GET `/api/stats` 返回新增：
```json
{
  "totalEvidence": 42,
  "keywordGroups": [{ "id": "ox_alpha", "label": "OX Alpha", ... }],
  "oxAlpha": {
    "dimension": { "windowStart": "2026-08-20", "trendsRef": {...}, "groups": [...] },
    "gsc": { "status": "manual_pending", "note": "Wire GSC API or paste Planner volumes" },
    "stopLoss": { "threshold": 200, "keywords": ["ox alpha", "what is ox alpha ai", "ox alpha vs hunter alpha"], "volumes": [...] },
    "trends": { "oxAlpha": 47, "gpts": 30, "upliftPct": 56, "peak": 100 }
  }
}
```
- 兼容：旧消费者只读前四个字段不受影响
- 过滤：`GET /api/stats?dimension=ox_alpha` 仅返回 OX 维度（给看板用）

### 接入真实 GSC（后续二期）
见 `docs/GSC-OX-Alpha-Setup.md`：启用 Search Console API → 服务账号 → 拉 Search Analytics 按 `keywordGroups` 正则聚合 → 写入每日快照表 → `/api/stats` `gsc.lastSyncedAt` 填充。

---

## 4. Keyword Planner 手动核验（负责人：孙斌）

RACI：孙斌执行并截图回群，建造者提供方法与止损判定工具。

### 操作步骤（Google Ads Keyword Planner）
1. 登录 Google Ads → Tools & Settings → Keyword Planner → Discover new keywords
2. 依次查询（Exact match，地域：Global / US，语言：English）：
   - `ox alpha`
   - `what is ox alpha ai`
   - `ox alpha vs hunter alpha`
3. 记录 Avg. monthly searches（月均搜索量）、Competition、Top of page bid
4. 截图：需包含关键词 + 搜索量 + 日期 + 账号水印（防篡改）
5. 回传：群内 + 贴到本 issue 评论

### 止损判定（`lib/gsc-keywords.ts → evaluateStopLoss()`）
```ts
import { evaluateStopLoss } from "@/lib/gsc-keywords";
evaluateStopLoss([
  { keyword: "ox alpha", volume: 320, source: "keyword_planner" },
  { keyword: "what is ox alpha ai", volume: 110, source: "keyword_planner" },
  { keyword: "ox alpha vs hunter alpha", volume: 90, source: "keyword_planner" },
]);
// → { shouldTriggerPhase1: true, triggeredBy: ["ox alpha"], summary: "GO Phase1 — ..." }
```
规则：
- 任一关键词 >200/月 → 自动触发 Phase1（执行 RAINBOW686-10、11：/ox-alpha 常青页 + 首页 75→90 分改造）
- 全部 <200/月 → Phase1 暂停，仅保留 Hunter Alpha 长尾资产（现有站不变，等待下一窗口）

---

## 5. 验收清单

- [ ] `ox_alpha_subscribe` 在 DebugView 可见（含 method）
- [ ] `tracker_click` 在首页点击链路可见
- [ ] `ox_alpha_view` 在 /ox-alpha（或 home_teaser）可见
- [ ] `GET /api/stats` 返回 `keywordGroups` 与 `oxAlpha` 且无回归
- [ ] Keyword Planner 三词截图已回传群
- [ ] 已调用 `evaluateStopLoss()` 并按结果执行 GO/PAUSE 分支

---

## 6. 后续建议（不阻塞验收）

- GA4 受众：基于 `ox_alpha_view` 创建再营销受众，推订阅转化
- GSC 自动化：接 Search Console API 后，`/api/stats` `gsc.status` 置为 `live` 并每日同步
- 瀑布看板：在 `monitor` 页新增 OX Alpha 趋势卡片（Trends 47→100）直观展示窗口期
