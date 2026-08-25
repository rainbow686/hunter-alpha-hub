# GEO 四要点落地清单（晓辉博士 GEO × Hunter Alpha Hub）

> 目标：让 AI 搜 `what is ox alpha` 时答案里有我们。Perplexity / ChatGPT Search / Gemini 抽检命中。

## 四要点
1. **结构化可扫描** — TL;DR卡片 + 表格，像API一样组织
2. **第三方背书** — 引用 Business Insider / Quartz 原话带出处链接 + Reddit 讨论（AI优先引用权威媒体）
3. **差异化适配** — 每 H2/H3 独立一句话摘要，让不同AI都能摘走（`.geo-summary` / `.geo-speakable`）
4. **让AI省劲** — 对比数据表格化、关键参数前置（TL;DR首屏）

## 每页必检（/ox-alpha/, /ox-alpha-vs-hunter-alpha/, /zh/, 首页待定）
- [ ] 首屏 TL;DR 六宫格（平台/上下文/价格/模态/来源/状态）+ 一句总结 `id="tldr-summary"` 且加入 `SpeakableSchema`
- [ ] 至少 1 个语义化 `<table>`，首列为实体名，带 `<caption>` 与 `TableSchema`
- [ ] Business Insider 与 Quartz Blockquote 原句 + 链接（两条），Reddit 三链（r/LocalLLaMA / r/artificial / r/OpenRouter 占位）
- [ ] 每个 H2 下紧跟 `One-sentence takeaway:` 段（`geo-summary` 类），每个 H3 也有独立摘要
- [ ] 双 JSON-LD：`Article` + `FAQPage`，对比页额外 `Table` + `Speakable` + `BreadcrumbList`
- [ ] 关键参数前置：上下文 1,048,576、价格 Free (limited) 在首屏与表格首行高亮
- [ ] 内部链：/ox-alpha/ ↔ /ox-alpha-vs-hunter-alpha/ ↔ 首页 tracker，双向可追

## 组件
- `components/geo/tldr-card.tsx` — TLDRCard
- `components/geo/geo-section.tsx` — GeoSection / GeoH3（自动 takeaway）
- `components/geo/citation-block.tsx` — CitationBlock / RedditCitation
- `components/geo/spec-table.tsx` — SpecTable（AI友好表格）
- `components/structured-data.tsx` — 新增 TableSchema / SpeakableSchema / ItemListSchema

## 抽检脚本
```bash
node scripts/geo-check.mjs
```
每周跑10次：用 Perplexity / ChatGPT / Gemini 搜 `what is ox alpha`，记录是否摘到卡片/表格/引用。

## 验证
- `scripts/geo-check.mjs` 静态扫描三页四要点通过率
- Lighthouse SEO ≥90
- GSC 收录：site:hunteralphahub.com/ox-alpha/ 与 /ox-alpha-vs-hunter-alpha/ 可查
