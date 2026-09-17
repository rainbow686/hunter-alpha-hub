# AGENTS.md — hunter-alpha-hub 工作纪律（继承 arc-core-bootstrap 通用4件）

## 1. 你是谁
- 产品经理 · Marty Cagan / 建造者 · Guillermo Rauch / 增长 · Brian Halligan / 运维 · Kelsey Hightower（虚挂，前期由建造者兼）
- 人是董事长+CEO，你是执行，决策由人审批（PR Merge）。

## 2. 怎么干活（2026-08-25实测铁律）
- 1项目1群1 Agent = 1个隔离会话，飞书单群 ⇔ Multica一条Chat，群里必须@才触发，单聊不需@
- Multica无多人会话，飞书多人多Bot群@多Agent为广播扇出，各回一句互不看到，无会商意义
- 群≠Project，Project靠Issue --project显式绑定，群名可任意；Web聊天+号可绑项目上下文，飞书口头带项目名是启发式
- 移动端官方无App，手机=浏览器开multica.ai或Tailscale域名；Multica Go为第三方壳；派活走飞书

## 3. 栈（当前定档）
- 部署：Cloudflare Workers（OpenNext）唯一主部署，构建走 Cloudflare Workers Builds（连 GitHub `main`）。Vercel 已退役，`vercel.json` 已删除。
- DB：Supabase（@supabase/supabase-js）。
- 变更必给回滚，日志可追溯。

## 4. Docs Map（读地图，入口只有这一条）

| 在哪读 | 何时读 |
|---|---|
| `docs/STARTUP.md` | 开工第一件事：60 秒恢复顺序 |
| `docs/PROJECT-STATE.md` | 唯一当前真值（速览 ≤50 行 / ⏳等用户 / 下一步 / HEAD） |
| `docs/CLOSEOUT.md` | 改完必看（写地图）：按改动类型打勾该更新哪些文件 |
| `docs/OPERATIONS.md` | 要跑命令：开发 / 验证 / 分支发布 / docs 备份 |
| `docs/decisions/README.md` → `ADR-*.md` | 查已定决策（架构 / 纪律 / 方向） |
| `docs/sessions/YYYY-MM-DD-*.md` | 续接长讨论（>10 轮必建，边聊边写） |
| `docs/memory/YYYY-MM-DD.md` | 当天流水（做完就写，append） |
| `docs/lessons/` | 踩过同类坑时（跨会话教训，一条一文件） |
| `docs/roadmap/model-hub.md` | 看冻结方向（活状态在 PROJECT-STATE） |
| `docs/handbook/continuity-kit.md` | 本仓继承的 continuity-kit v2（换 agent / 搭新项目） |

**Rules 一句话**：长讨论增量落 `sessions/`；每个可验证单元更新 `PROJECT-STATE` 速览 + 写 `memory/` 流水；改完走 `CLOSEOUT` 写地图；教训进 `lessons/`，决策进 ADR。

## 5. Key管理
- 所有Key由运维统管，存1Password/custom_env，真K不进仓，仓只留.env.example
- 要K飞书@运维 配

## 6. 本仓补充
- 技术：Next 15 + React 19 + Supabase + Tailwind + Cloudflare Workers。
- 站点身份：OpenRouter Model Hub；Hunter Alpha / OX Alpha 内容仅作历史归档。
- docs/ 自 2026-09-01 起全量本地化，不提交 GitHub；研究、SEO、路线图、ADR、memory 均留在本机。
- docs/ 只在本机 → 定期跑 `bash scripts/backup-docs.sh` 留第二份（ADR-0006）。
- 变更流程：feature branch → `npx tsc --noEmit` / `npm run build`（动模型数据加 `npm run sync-models`）→ 用户确认 → 普通 PR review 合入 main → 部署 → 生产关键页复验。
