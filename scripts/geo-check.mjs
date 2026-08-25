#!/usr/bin/env node
import fs from "fs";
import path from "path";
const base = path.dirname(path.dirname(import.meta.url.replace("file://","")));
const pages = [
  "hunter-alpha-hub/app/ox-alpha/page.tsx",
  "hunter-alpha-hub/app/ox-alpha-vs-hunter-alpha/page.tsx",
  "hunter-alpha-hub/app/zh/page.tsx",
];
const root = "/home/bill/multica_workspaces/d7d5a587-6a52-40e0-b2c9-a5a307efd604/795db7187c48/workdir";
const checks = [
  { name: "TL;DR卡片", regex: /TldrCard|TL;DR/ },
  { name: "表格", regex: /<table|SpecTable/ },
  { name: "Business Insider引用", regex: /Business Insider/ },
  { name: "Quartz引用", regex: /Quartz/ },
  { name: "Reddit链接", regex: /reddit\.com\/r\// },
  { name: "每H2一句话摘要", regex: /One-sentence takeaway|geo-summary/ },
  { name: "Article JSON-LD", regex: /ArticleSchema/ },
  { name: "FAQ JSON-LD", regex: /FAQSchema/ },
  { name: "Speakable/Table schema", regex: /SpeakableSchema|TableSchema/ },
  { name: "关键参数前置 1,048,576", regex: /1,048,576/ },
];
let allPass = true;
for (const p of pages) {
  const full = path.join(root, p);
  const content = fs.readFileSync(full, "utf8");
  console.log(`\n=== ${p} ===`);
  for (const c of checks) {
    const pass = c.regex.test(content);
    console.log(` ${pass ? "✓" : "✗"} ${c.name}`);
    if (!pass) allPass = false;
  }
}
process.exit(allPass ? 0 : 1);
