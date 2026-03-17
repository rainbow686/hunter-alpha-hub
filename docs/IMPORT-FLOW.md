# Hunter Alpha 证据导入流程

## 工作流程概述

这是一套手动数据输入流程，你每天提供检索数据，我负责解析并导入数据库。

---

## 操作步骤

### 1. 你每天提供检索数据

**文件命名规则**: `hunter-alpha-research-YYYY-MM-DD.md`

**文件位置**: `docs/` 目录（**不提交到 git**）

**数据格式**:
```markdown
# Hunter Alpha 关键词检索结果

> 检索日期：2026-03-17
> 关键词：hunter alpha, hunter alpha ai, ...

## 检索结果

标题 ||| URL ||| 来源类型 ||| 摘要关键词

---

## 统计信息
...
```

### 2. 我解析并导入数据

将文件内容发给我，我会：
1. 解析 `|||` 分隔的数据
2. 自动判断重要性（High/Medium/Low）
3. 检查 URL 是否已存在（去重）
4. 分配循环 Nickname（150 个常见英文名）
5. 插入 Supabase 数据库

### 3. 确认导入结果

我会返回执行结果：
- 新增证据数量
- 跳过已有数量
- 使用的重要性分布

---

## 数据来源建议

### 推荐搜索关键词
- `hunter alpha`
- `hunter alpha ai`
- `hunter alpha ai model`
- `hunter alpha llm`
- `hunter-alpha`
- `hunteralpha`
- `what is hunter alpha`
- `hunter alpha benchmarks`
- `hunter alpha openrouter`

### 来源类型
- **Official**: OpenRouter 官方页面
- **Reddit**: Reddit 讨论帖子
- **Video**: YouTube 视频
- **Blog**: 个人/技术博客
- **Comparison**: 对比页面
- **Social**: X.com (Twitter)
- **Platform**: 第三方平台
- **News**: 新闻网站
- **Community**: 社区网站
- **Review**: 评测文章

---

## 数据库字段说明

| 字段 | 说明 |
|------|------|
| title | 标题（最长 200 字符）|
| description | 描述/摘要（最长 500 字符）|
| nickname | 用户昵称（从 150 个英文名循环）|
| evidence_url | 证据链接|
| external_discussion_url | 外部讨论链接（Reddit/Twitter/Video）|
| importance | 重要性（High/Medium/Low）|
| likes | 点赞数（默认 0）|
| created_at | 创建时间|

---

## 重要性判断规则

| 等级 | 条件 |
|------|------|
| **High** | Official 来源、包含 "1M context"、"1T parameter"、"free" |
| **Medium** | Review/News/Blog/Comparison、包含 "benchmark"、"test"、"vs" |
| **Low** | 其他一般讨论 |

---

## 常见问题

### Q: 为什么文件不提交到 git？
A: 检索数据是日常操作，不提交到 git 可以保持仓库整洁，只保留代码和配置。

### Q: 如果某天没有新数据怎么办？
A: 跳过即可，不需要创建空文件。

### Q: 如何检查数据是否已存在？
A: 通过 URL 自动检测，已存在的证据会跳过。

### Q: Nickname 会重复吗？
A: 会循环使用 150 个常见英文名，但会按顺序分配，确保多样性。

---

## 命令参考

```bash
# 本地运行导入脚本
export SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
npm run fetch-evidence
```

---

## 联系

如有问题或需要调整流程，请随时告知。
