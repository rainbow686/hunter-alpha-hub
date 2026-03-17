/**
 * 自动证据导入程序
 *
 * 功能：
 * 1. 从 docs 目录读取检索结果文件（hunter-alpha-research-YYYY-MM-DD.md）
 * 2. 解析 ||| 分隔的数据格式
 * 3. 检查重复后插入到 Supabase evidence 表
 * 4. Nickname 使用 150 个常见英文名循环
 *
 * 数据格式：
 * 标题 ||| URL ||| 来源类型 ||| 摘要关键词
 *
 * 使用方式：
 * npm run fetch-evidence
 *
 * 环境变量：
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { getNameByIndex } from './names';
import * as fs from 'fs';
import * as path from 'path';

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 重要性判断
function determineImportance(sourceType: string, summary: string): 'High' | 'Medium' | 'Low' {
  const summaryLower = summary.toLowerCase();

  // High: 官方、关键规格、免费
  if (sourceType === 'Official' ||
      summaryLower.includes('1m context') ||
      summaryLower.includes('1t parameter') ||
      summaryLower.includes('free') ||
      summaryLower.includes('1m token')) {
    return 'High';
  }

  // Medium: 评测、新闻、博客、对比
  if (sourceType === 'Review' ||
      sourceType === 'News' ||
      sourceType === 'Blog' ||
      sourceType === 'Comparison' ||
      summaryLower.includes('benchmark') ||
      summaryLower.includes('test') ||
      summaryLower.includes('vs')) {
    return 'Medium';
  }

  return 'Low';
}

// 检查是否已存在
async function isEvidenceExists(url: string): Promise<boolean> {
  const { data } = await supabase
    .from('evidence')
    .select('id')
    .eq('evidence_url', url)
    .limit(1);
  return !!(data && data.length > 0);
}

// 插入证据
async function insertEvidence(evidence: any) {
  const { data, error } = await supabase
    .from('evidence')
    .insert({
      title: evidence.title,
      description: evidence.description,
      nickname: evidence.nickname,
      evidence_url: evidence.url,
      external_discussion_url: evidence.externalDiscussionUrl,
      importance: evidence.importance,
      likes: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error(`❌ 插入失败：`, error.message);
    return null;
  }
  return data;
}

// 从 MD 文件解析数据
function parseMarkdownFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');

  // 找到检索结果部分（## 检索结果 之后，## 统计信息 之前）
  const match = content.match(/## 检索结果[\s\S]*?-+\s*([\s\S]*?)\s*---/);
  if (!match) {
    // 尝试另一种格式
    const match2 = content.match(/## 检索结果[\s\S]*$/);
    if (match2) {
      return match2[0].split('\n\n').filter(line => line.includes('|||'));
    }
    return [];
  }

  return match[1].split('\n\n').filter(line => line.includes('|||'));
}

// 主程序
async function main() {
  console.log('🚀 开始导入 Hunter Alpha 证据...\n');

  // 查找 docs 目录下的检索文件
  const docsDir = path.join(process.cwd(), 'docs');

  if (!fs.existsSync(docsDir)) {
    console.error('❌ docs 目录不存在');
    process.exit(1);
  }

  // 找到最新的检索文件
  const files = fs.readdirSync(docsDir)
    .filter(f => f.startsWith('hunter-alpha-research-') && f.endsWith('.md'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.log('ℹ️  未找到检索文件，请在 docs 目录下添加 hunter-alpha-research-YYYY-MM-DD.md 文件');
    process.exit(0);
  }

  const latestFile = files[0];
  const filePath = path.join(docsDir, latestFile);

  console.log(`📄 读取文件：${latestFile}\n`);

  // 解析数据
  const lines = parseMarkdownFile(filePath);
  console.log(`📊 解析到 ${lines.length} 条数据\n`);

  if (lines.length === 0) {
    console.log('⚠️  未找到有效数据');
    process.exit(0);
  }

  // 获取当前证据总数用于 nickname 索引
  const { count } = await supabase.from('evidence').select('*', { count: 'exact', head: true });
  let nameIndex = count !== null ? count % 150 : 0;
  console.log(`📊 当前证据总数：${count || 0}, nickname 起始索引：${nameIndex}\n`);

  let inserted = 0;
  let skipped = 0;
  let invalid = 0;

  for (const line of lines) {
    const parts = line.split(' ||| ');
    if (parts.length < 4) {
      invalid++;
      continue;
    }

    const [title, url, sourceType, summary] = parts.map(p => p.trim());

    // 检查是否已存在
    const exists = await isEvidenceExists(url);
    if (exists) {
      console.log(`⏭️  跳过已存在：${title.substring(0, 50)}...`);
      skipped++;
      continue;
    }

    // 确定重要性
    const importance = determineImportance(sourceType, summary);

    // 获取 nickname
    const nickname = getNameByIndex(nameIndex);
    nameIndex++;

    // 准备描述
    const description = summary.length > 500 ? summary.substring(0, 500) + '...' : summary;

    // 判断是否为外部讨论链接
    const isExternalDiscussion = sourceType === 'Reddit' || sourceType === 'Social' || sourceType === 'Video';

    // 插入证据
    const evidence = {
      title: title.length > 200 ? title.substring(0, 200) : title,
      description: description || title,
      nickname,
      url,
      externalDiscussionUrl: isExternalDiscussion ? url : undefined,
      importance,
    };

    const result = await insertEvidence(evidence);
    if (result) {
      inserted++;
      console.log(`✅ 已插入：[${importance}] ${title.substring(0, 50)}... (${nickname})`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 执行完成`);
  console.log(`   - 新增证据：${inserted} 条`);
  console.log(`   - 跳过已有：${skipped} 条`);
  console.log(`   - 无效数据：${invalid} 条`);
  console.log(`   - 使用 nickname 索引：${nameIndex}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
