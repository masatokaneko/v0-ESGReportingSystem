/**
 * データベースセットアップスクリプト
 * Vercel Postgresでテーブル作成と初期データ投入を行います
 * 
 * 実行方法: node scripts/setup-db.js
 */

const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('🚀 データベースセットアップを開始します...');
    
    // SQLファイルを読み込み
    const schemaPath = path.join(__dirname, '../lib/db-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // SQLを実行（複数のステートメントに分割）
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 ${statements.length}個のSQLステートメントを実行します...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await sql.query(statement);
          console.log(`✅ ステートメント ${i + 1}/${statements.length} 完了`);
        } catch (error) {
          // INSERT文のコンフリクトなどは無視
          if (error.message.includes('duplicate key') || 
              error.message.includes('already exists') ||
              error.message.includes('ON CONFLICT')) {
            console.log(`⚠️  ステートメント ${i + 1} スキップ (既存データ)`);
          } else {
            console.error(`❌ ステートメント ${i + 1} でエラー:`, error.message);
          }
        }
      }
    }
    
    // データの確認
    console.log('\n📊 データベースの状態を確認中...');
    
    const locations = await sql`SELECT COUNT(*) as count FROM locations`;
    console.log(`🏢 拠点データ: ${locations.rows[0].count}件`);
    
    const factors = await sql`SELECT COUNT(*) as count FROM emission_factors`;
    console.log(`⚡ 排出係数データ: ${factors.rows[0].count}件`);
    
    const entries = await sql`SELECT COUNT(*) as count FROM esg_entries`;
    console.log(`📋 ESGエントリ: ${entries.rows[0].count}件`);
    
    console.log('\n🎉 データベースセットアップが完了しました！');
    
  } catch (error) {
    console.error('❌ データベースセットアップ中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// 実行
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };