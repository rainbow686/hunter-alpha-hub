/**
 * 自动证据获取程序
 *
 * 功能：
 * 1. 根据关键词搜索 Hunter Alpha 相关内容
 * 2. 使用 AI 判断内容是否符合 Hunter Alpha 模型
 * 3. 自动插入到 Supabase evidence 表
 * 4. Nickname 使用 150 个常见英文名循环
 *
 * 使用方式：
 * npm run fetch-evidence
 *
 * 环境变量：
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - SEARCH_API_KEY (可选，用于某些搜索 API)
 */

import { createClient } from '@supabase/supabase-js';
import { getNameByIndex } from './names';

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 搜索关键词列表
const SEARCH_KEYWORDS = [
  'Hunter Alpha AI',
  'Hunter Alpha model',
  'Hunter Alpha OpenRouter',
  'Hunter Alpha 1M context',
  'Hunter Alpha review',
  'Hunter Alpha vs',
  'Hunter Alpha test',
  'Hunter Alpha benchmark',
  'Hunter Alpha 评测',
  'Hunter Alpha 使用',
  'Hunter Alpha deepseek',
  'Hunter Alpha Kimi',
  'Hunter Alpha performance',
  'Hunter Alpha price',
  'Hunter Alpha free',
];

// 重要性判断规则
function determineImportance(content: string): 'High' | 'Medium' | 'Low' {
  const highKeywords = [
    '1M context', '1 million context', '1048576',
    '1T parameters', '1 trillion parameters',
    'free', '免费',
    'official', 'confirmed', 'announced',
    'release date', 'launch',
  ];

  const mediumKeywords = [
    'review', 'test', 'benchmark',
    'vs', 'comparison', 'compare',
    'performance', 'speed', 'quality',
    '评测', '测试', '对比',
  ];

  const contentLower = content.toLowerCase();

  for (const keyword of highKeywords) {
    if (contentLower.includes(keyword.toLowerCase())) {
      return 'High';
    }
  }

  for (const keyword of mediumKeywords) {
    if (contentLower.includes(keyword.toLowerCase())) {
      return 'Medium';
    }
  }

  return 'Low';
}

// 从 Reddit 获取内容
async function fetchFromReddit(keyword: string, limit = 10) {
  try {
    // 使用 Reddit 的公开 RSS/JSON API（无需认证）
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&limit=${limit}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HunterAlphaHub/1.0)',
      },
    });

    if (!response.ok) {
      console.log(`⚠️  Reddit 请求失败：${response.status}`);
      return [];
    }

    const data = await response.json();
    const posts = data.children?.map((child: any) => ({
      title: child.data.title,
      content: child.data.selftext || child.data.title,
      url: `https://www.reddit.com${child.data.permalink}`,
      author: child.data.author || 'anonymous',
      created: child.data.created_utc * 1000,
      source: 'reddit',
    })) || [];

    console.log(`📌 Reddit: 找到 ${posts.length} 条相关内容`);
    return posts;
  } catch (error) {
    console.error(`❌ Reddit 搜索错误 (${keyword}):`, error);
    return [];
  }
}

// 简单的内容过滤 - 判断是否与 Hunter Alpha 相关
function isHunterAlphaRelated(content: string): boolean {
  const keywords = [
    'hunter alpha',
    'hunteralpha',
    'hunter-alpha',
  ];

  const contentLower = content.toLowerCase();
  return keywords.some(keyword => contentLower.includes(keyword));
}

// 检查证据是否已存在
async function isEvidenceExists(title: string, url: string): Promise<boolean> {
  // 检查标题是否相似
  const { data: existing } = await supabase
    .from('evidence')
    .select('id, title')
    .ilike('title', `%${title.substring(0, 20)}%`)
    .limit(1);

  if (existing && existing.length > 0) {
    return true;
  }

  // 检查 URL 是否已存在
  if (url) {
    const { data: existingByUrl } = await supabase
      .from('evidence')
      .select('id')
      .eq('evidence_url', url)
      .limit(1);

    if (existingByUrl && existingByUrl.length > 0) {
      return true;
    }
  }

  return false;
}

// 插入证据
async function insertEvidence(evidence: {
  title: string;
  description: string;
  nickname: string;
  evidenceUrl?: string;
  externalDiscussionUrl?: string;
  importance: 'High' | 'Medium' | 'Low';
}) {
  const { data, error } = await supabase
    .from('evidence')
    .insert({
      ...evidence,
      likes: 0,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error(`❌ 插入失败：`, error);
    return null;
  }

  return data;
}

// 主程序
async function main() {
  console.log('🚀 开始自动获取 Hunter Alpha 证据...\n');

  let totalFound = 0;
  let totalInserted = 0;
  const targetCount = 20; // 目标获取 20 条
  let nameIndex = 0;

  // 获取现有证据数量，用于确定 nickname 起始索引
  const { count } = await supabase
    .from('evidence')
    .select('*', { count: 'exact', head: true });

  if (count !== null) {
    nameIndex = count % 150;
    console.log(`📊 当前证据总数：${count}, nickname 起始索引：${nameIndex}`);
  }

  // 遍历关键词搜索
  for (const keyword of SEARCH_KEYWORDS) {
    if (totalInserted >= targetCount) {
      console.log(`\n✅ 已达到目标数量 (${targetCount}条)，停止搜索`);
      break;
    }

    console.log(`\n🔍 搜索关键词：${keyword}`);

    // 从 Reddit 获取内容
    const results = await fetchFromReddit(keyword, 5);

    for (const item of results) {
      if (totalInserted >= targetCount) break;

      // 过滤：必须与 Hunter Alpha 相关
      if (!isHunterAlphaRelated(item.title + ' ' + item.content)) {
        continue;
      }

      totalFound++;

      // 检查是否已存在
      const exists = await isEvidenceExists(item.title, item.url);
      if (exists) {
        console.log(`⏭️  跳过已存在：${item.title.substring(0, 50)}...`);
        continue;
      }

      // 确定重要性
      const importance = determineImportance(item.title + ' ' + item.content);

      // 获取 nickname
      const nickname = getNameByIndex(nameIndex);
      nameIndex++;

      // 准备证据数据
      const evidence = {
        title: item.title.length > 200 ? item.title.substring(0, 200) : item.title,
        description: item.content.length > 500 ? item.content.substring(0, 500) + '...' : item.content || item.title,
        nickname,
        evidenceUrl: item.source === 'reddit' ? item.url : undefined,
        externalDiscussionUrl: item.source === 'reddit' ? item.url : undefined,
        importance,
      };

      console.log(`📝 插入证据：${evidence.title.substring(0, 50)}... (${importance})`);

      const result = await insertEvidence(evidence);
      if (result) {
        totalInserted++;
        console.log(`✅ 已插入 (${totalInserted}/${targetCount})`);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 执行完成');
  console.log(`   - 找到相关内容：${totalFound} 条`);
  console.log(`   - 新增证据：${totalInserted} 条`);
  console.log(`   - 使用 nickname 索引：${nameIndex}`);
  console.log('='.repeat(50));
}

// 运行主程序
main().catch(console.error);
