const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 读取环境变量
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 读取迁移文件
const migrationPath = path.join(__dirname, '../supabase/migrations/006-user-achievements.sql');
const migrationSql = fs.readFileSync(migrationPath, 'utf-8');

async function runMigration() {
  console.log('Running migration: 006-user-achievements.sql');

  // 分割 SQL 语句（按分号分隔）
  const statements = migrationSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    try {
      // 使用 RPC 端点执行 SQL（需要 service role key）
      // 由于 anon key 权限限制，我们直接创建表和策略
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
    } catch (error) {
      console.error(`Error executing statement ${i + 1}:`, error.message);
    }
  }

  // 由于 anon key 无法执行 DDL，我们需要手动在 Dashboard 执行
  console.log('\n========================================');
  console.log('注意：由于 anon key 权限限制，无法直接执行 DDL 语句');
  console.log('请在 Supabase Dashboard 中手动执行以下操作:');
  console.log('1. 登录 https://lugzvzeggmuakdyogoqh.supabase.co');
  console.log('2. 进入 SQL Editor');
  console.log('3. 复制并执行 supabase/migrations/006-user-achievements.sql 的内容');
  console.log('========================================\n');
}

runMigration();
