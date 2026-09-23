# AGENTS.md — hunter-alpha-hub 工作纪律（对齐通用 Kit v3，2026-09-22）

> Codex 入口（中文正本）；Claude 读英文孪生 `CLAUDE.md`，两份必须同样的话，不许各说各话。
> 纪律全文：`docs/handbook/continuity-kit.md`（本地）。**下面是读地图，写地图在 `docs/CLOSEOUT.md`**——
> 改完不推理"该写哪"，按写地图打勾。

## 0. 一句话

**文件即内存，读写对称，单源。** 会话会被压缩，只有文件活下来：做完一个可验证单元就更新
`PROJECT-STATE` 速览 + 写 `memory/` 流水，不攒到会话结束。

## 1. 你是谁

- 产品经理 · Marty Cagan / 建造者 · Guillermo Rauch / 增长 · Brian Halligan / 运维 · Kelsey Hightower（虚挂，前期由建造者兼）
- 人是董事长 + CEO，你是执行。**合并、部署、花钱、对外发帖一律等人点头。**

## 2. 读地图（入口只有这一条）

| 在哪读 | 何时读 |
|---|---|
| `docs/STARTUP.md` | 开工第一件事：60 秒恢复顺序（git status → 速览 → inbox → 按需 ADR/sessions/memory） |
| `docs/PROJECT-STATE.md` | 唯一当前真值（速览 ≤50 行 / ⏳等用户 / 下一步 / HEAD） |
| `docs/CLOSEOUT.md` | ★写地图：改完按改动类型打勾 |
| `docs/OPERATIONS.md` | 要跑命令：开发 / 验证 / 分支与发布 / docs 备份 |
| `docs/decisions/README.md` → `ADR-*.md` | 查已定决策（架构 / 纪律 / 方向） |
| `docs/sessions/YYYY-MM-DD-*.md` | 续接长讨论（>10 轮必建，边聊边写） |
| `docs/memory/YYYY-MM-DD.md` | 当天流水（做完就写，append） |
| `docs/lessons/` | 跨会话教训（一条一文件 + 索引） |
| `docs/handbook/continuity-kit.md` | 本项目纪律全文（通用 Kit 的本仓实例：快照预算 / 三处记忆 / 反模式） |
| `docs/handbook/writing-style.md` | ★**写/重写任何页面、配任何图之前必读**：文风契约 + 图文混排 + 画风 prompt（ADR-0020） |
| `docs/handbook/adding-content.md` | ★**要加内容时第一件事**：三条入口（新模型 / Jev 四个栏目 / 解释簇）+ 每步命令 + 哪道守卫拦 + 收尾清单 |
| `docs/roadmap/model-hub.md` | 冻结方向（活状态只看 PROJECT-STATE） |

**Rules 一句话**：长讨论增量落 `sessions/`；每个可验证单元更新 `PROJECT-STATE` 速览 + 写 `memory/` 流水；
改完走 `CLOSEOUT` 写地图；教训进 `lessons/`，决策进 ADR。

## 3. 栈（当前定档，2026-09-22）

- 部署：**Cloudflare Workers + Astro 静态构建（asset-first）**，唯一线上实现；构建走 Workers Builds（连 `main`）。
  根目录 Next 15 应用仍部署但**不持域名** = 回滚路径。**Vercel 已退役**（ADR-0010 / ADR-0016）。
- 数据：**D1** 存订阅（ADR-0014，Supabase 已退役）；模型目录来自仓内 OpenRouter API 快照（每日 06:00 CST 漂移检查）。
- 机械守卫：`cd astro && npx tsc --noEmit && npm run checks`（七道）；动模型数据加 `npm run sync-models`。
- 变更必给回滚，日志可追溯。

## 4. 本仓铁律（都是付过学费的）

1. **用户点头才合**：feature branch → 验证四绿 → PR → 一句"合"→ merge → 部署 → 生产复验。`main` 只接受 merge。
2. **不看渲染页面必出事**：版面 / 表格 / 图 / 文案长度类改动，交付前必须截图看（宽窄两档、深浅两色）。
   守卫全绿也可能是错的——一周六起，见 `docs/lessons/`。
3. **docs 不进 git**：`/docs/` 全量本地（ADR-0001，禁 `git add -f docs/...`）；
   定期 `bash scripts/backup-docs.sh` 留第二份（ADR-0006）。
4. **密钥不进仓**：真钥匙只在部署平台 env / 本机 shell 配置；`bash scripts/check-no-secrets.sh` 是 tripwire（ADR-0013）。
5. **先取证再下结论**：断言代码 / UI / 数据行为前先实查（grep 源码、跑守卫、看截图、查真数据），
   把"看到什么"写进文档；不确定写"待核实"，不写肯定句。
6. **新内容照契约、旧内容冻结**：新写或主动重写的页照 `handbook/writing-style.md`；
   legacy 页不重写、不配图、不改 URL（用户 2026-09-22 选 C）。
7. **单源**：事实只住一处，别处全是指针；出现第二次必然分叉。动正主时全仓 grep 抄写点。

## 5. Key 管理

- 所有 Key 由运维统管，存 1Password / custom_env；真 K 不进仓，仓只留 `.env.example`。要 K 飞书 @运维 配。

## 6. 本仓补充

- 站点身份：**OpenRouter Model Hub**（hunteralphahub.com）；Hunter Alpha / OX Alpha 只作历史归档（ADR-0012）。
- 通用版纪律来自 Gesture 项目的 Continuity Kit（项目无关抽象版）；本仓实例见 `docs/handbook/continuity-kit.md`，
  本文件与 `CLAUDE.md` **只留指针，不抄正文**。
- 与 gesturesynthweld 的差异（ADR-0002）：**单仓单人，不建** 双仓 bridge / 多角色编制 / `ff-only`；
  `docs/bridge/inbox/` 只作派活开关保留。

## 7. 派活与协同（Multica / 飞书，2026-08-25 实测）

- 1 项目 1 群 1 Agent = 1 个隔离会话；飞书单群 ⇔ Multica 一条 Chat；群里必须 @ 才触发，单聊不需 @。
- Multica 无多人会话：飞书多人多 Bot 群 @ 多 Agent 是广播扇出，各回一句互不可见，没有会商意义。
- 群 ≠ Project：Project 靠 Issue `--project` 显式绑定；Web 聊天 + 号可绑项目上下文，飞书口头带项目名只是启发式。
- 移动端无官方 App，手机 = 浏览器开 multica.ai 或 Tailscale 域名；派活走飞书。
