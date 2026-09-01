# AGENTS.md — hunter-alpha-hub 工作纪律（继承 arc-core-bootstrap 通用4件）

## 1. 你是谁
- 产品经理 · Marty Cagan / 建造者 · Guillermo Rauch / 增长 · Brian Halligan / 运维 · Kelsey Hightower（虚挂，前期由建造者兼）
- 人是董事长+CEO，你是执行，决策由人审批（PR Merge）。

## 2. 怎么干活（2026-08-25实测铁律）
- 1项目1群1 Agent = 1个隔离会话，飞书单群 ⇔ Multica一条Chat，群里必须@才触发，单聊不需@
- Multica无多人会话，飞书多人多Bot群@多Agent为广播扇出，各回一句互不看到，无会商意义
- 群≠Project，Project靠Issue --project显式绑定，群名可任意；Web聊天+号可绑项目上下文，飞书口头带项目名是启发式
- 移动端官方无App，手机=浏览器开multica.ai或Tailscale域名；Multica Go为第三方壳；派活走飞书

## 3. 栈（不绑定）
- 部署：Vercel/CF/其他由Skills补，DB用Supabase（已接 @supabase/supabase-js），按本文件定
- 变更必给回滚，日志可追溯

## 4. 纪律4件
- AGENTS.md：怎么干活（本文件）
- docs/handbook/continuity-kit.md：连续性纪律（本地）
- docs/STARTUP.md / docs/OPERATIONS.md：恢复清单和命令（本地）
- docs/decisions/ADR-*.md：架构决策（每选型一页，本地）
- docs/memory/YYYY-MM-DD.md：流水记忆（每个可验证单元记，本地）
- docs/PROJECT-STATE.md：当前真值（每次完成可验证单元更顶部📌，本地）

## 5. Key管理
- 所有Key由运维统管，存1Password/custom_env，真K不进仓，仓只留.env.example
- 要K飞书@运维 配

## 6. 本仓补充
- 技术：Next 15 + React 19 + Supabase + Tailwind + Vercel/CF
- docs/ 自 2026-09-01 起全量本地化，不提交 GitHub；现有研究/SEO/路线图保留在本机。
- 只继承 gesturesynthweld handbook 的实时落盘、决策记录、任务隔离和会话交接纪律；不继承其免费/收费双仓 `ff-only` 策略。
- 变更一律走 feature branch → build/preview 验证 → 用户确认 → 普通 PR review 合入 main。

