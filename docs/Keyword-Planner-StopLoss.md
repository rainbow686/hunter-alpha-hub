# Keyword Planner 止损线操作卡（孙斌手动）

执行人：孙斌  
截止：上线后 24h 内  
回传：群内截图 + 本 issue 评论贴图

## 查哪三个词
| 关键词 | 用途 |
|---|---|
| `ox alpha` | 主词，窗口期核心 |
| `what is ox alpha ai` | KD38 长尾，/ox-alpha 目标 |
| `ox alpha vs hunter alpha` | KD30.7 王牌对比页目标 |

## 步骤
1. Google Ads → Tools → Keyword Planner → Discover new keywords
2. 地域选 Global（或 US），语言 English，Exact match
3. 每次单查一个词，记录 Avg. monthly searches
4. 截图需含：关键词、搜索量、日期、账号信息

## 判定与动作
- 任一 >200/月 → `@Guillermo` 自动触发 Phase1：`RAINBOW686-10` (/ox-alpha 1200词) + `RAINBOW686-11` (首页 75→90分) 并行开工，3-5天交付
- 全部 <200/月 → Phase1 暂停，站内仅保留 Hunter Alpha 长尾，不追 OX 新页

代码判定：
```ts
import { evaluateStopLoss } from "@/lib/gsc-keywords";
evaluateStopLoss([
  { keyword: "ox alpha", volume: 320, source: "keyword_planner" },
  { keyword: "what is ox alpha ai", volume: 110, source: "keyword_planner" },
  { keyword: "ox alpha vs hunter alpha", volume: 90, source: "keyword_planner" },
]);
```

## 模板回传
```
[Planner 截图]
ox alpha: 320/mo
what is ox alpha ai: 110/mo
ox alpha vs hunter alpha: 90/mo
判定: GO Phase1 (ox alpha >200)
```
