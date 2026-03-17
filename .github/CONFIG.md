# GitHub Actions 配置指南

## 设置环境变量

在 GitHub 仓库中配置 Secrets，让自动证据获取程序能够运行：

### 步骤

1. 进入 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**

2. 点击 **New repository secret**，添加以下环境变量：

| Name | Value | 说明 |
|------|-------|------|
| `SUPABASE_URL` | `https://lugzvzeggmuakdyogoqh.supabase.co` | Supabase 项目 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Service Role Key（在 Supabase Dashboard 获取） |

### 获取 Service Role Key

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制 **Service Role** key（注意：不是 anon key）

### 验证配置

配置完成后，在 GitHub Actions 中手动触发一次工作流：

1. 进入 **Actions** 标签页
2. 选择 **Auto Fetch Evidence** 工作流
3. 点击 **Run workflow**
4. 查看运行日志确认是否成功

## 工作流说明

- **触发时间**: 每天 UTC 2:00（北京时间 10:00）
- **运行超时**: 15 分钟
- **目标数量**: 每天最多 20 条新证据

## 修改运行频率

编辑 `.github/workflows/auto-fetch-evidence.yml` 中的 cron 表达式：

```yaml
schedule:
  # 每小时运行一次
  - cron: '0 * * * *'

  # 每 6 小时运行一次
  - cron: '0 */6 * * *'

  # 每天早上 8 点（UTC）
  - cron: '0 8 * * *'
```

## 禁用自动运行

如果只想手动触发，注释掉 schedule 部分：

```yaml
on:
  # schedule:
  #   - cron: '0 2 * * *'
  workflow_dispatch:
```
