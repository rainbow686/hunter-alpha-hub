# 自动证据导入程序

从 docs 目录读取检索结果文件并自动导入到 Supabase 数据库。

## 工作流程

### 1. 每天提供检索数据

将每天的检索结果保存为 MD 文件，命名格式：`hunter-alpha-research-YYYY-MM-DD.md`

文件放在项目 `docs/` 目录下（**不提交到 git**）。

### 2. 数据格式

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

每条记录使用 `|||` 分隔，格式为：**标题 ||| URL ||| 来源类型 ||| 摘要关键词**

### 3. 运行导入

```bash
# 本地运行
export SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
npm run fetch-evidence
```

### 4. GitHub Actions 自动导入

**注意**: GitHub Actions 无法访问本地 docs 目录，需要通过以下方式之一触发：

1. **手动触发**: 在 GitHub Actions 中点击 "Run workflow"
2. **提交文件后触发**: 将 MD 文件临时提交到 git，触发工作流后撤销

推荐方式：
```bash
# 将检索文件放在 docs 目录
git add docs/hunter-alpha-research-2026-03-17.md
git commit -m "temp: add research data"
git push

# 等待 Actions 运行完成

# 撤销提交（保留本地文件）
git reset --soft HEAD~1
git restore --staged docs/hunter-alpha-research-2026-03-17.md
```

## 来源类型与重要性

### 自动判断规则

| 来源类型 | 包含关键词 | 重要性 |
|----------|-----------|--------|
| Official | 1M context, 1T parameter, free | High |
| Review/News/Blog/Comparison | benchmark, test, vs | Medium |
| 其他 | - | Low |

### 来源类型示例

- **Official**: OpenRouter 官方页面
- **Reddit**: Reddit 讨论
- **Video**: YouTube 视频
- **Blog**: 个人博客
- **Comparison**: 对比页面
- **Social**: X.com/Twitter
- **Platform**: 第三方平台
- **News**: 新闻网站
- **Community**: 社区网站

## Nickname 规则

使用 150 个常见英文名循环，确保昵称多样性：
- James, John, Robert, Michael, William...（共 150 个）
- 自动根据当前证据总数确定起始索引

## 数据去重

通过 URL 自动检测重复，已存在的证据会跳过。

## 环境变量

在 `.env.local` 中配置：

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
