# Supabase から Neon へのマイグレーションガイド

このドキュメントでは、既存のSupabaseデータベースからNeonへデータを移行する手順を説明します。

## 前提条件

- Supabaseプロジェクトのアクセス権限
- Neonプロジェクトのアクセス権限
- PostgreSQLクライアント（psql）
- pg_dump, pg_restore コマンド

## 手順1: Supabaseからデータをエクスポート

### 方法A: Supabaseダッシュボードを使用

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. Settings → Database
4. Connection string を取得
5. バックアップをダウンロード

### 方法B: pg_dumpを使用

```bash
# Supabaseの接続文字列を環境変数に設定
export SUPABASE_DB_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# データをダンプ
pg_dump $SUPABASE_DB_URL \
  --schema=public \
  --no-owner \
  --no-privileges \
  --file=supabase_backup.sql
```

## 手順2: データの変換

既存のSupabaseスキーマとNeonスキーマの違いを調整します：

```sql
-- 変換スクリプト例
-- supabase_backup.sql を編集

-- 1. RLSポリシーの削除（Neonでは不要）
-- ALTER TABLE ... ENABLE ROW LEVEL SECURITY; を削除

-- 2. Supabase特有の関数を削除
-- auth.uid() などの参照を削除

-- 3. テーブル名の調整（必要に応じて）
-- 例: esg_entries テーブルの構造を確認
```

## 手順3: Neonへデータをインポート

```bash
# Neonの接続文字列を環境変数に設定
export NEON_DB_URL="postgresql://[user]:[password]@[host].neon.tech:5432/[database]?sslmode=require"

# スキーマを適用（初回のみ）
psql $NEON_DB_URL < neon-schema.sql

# データをインポート
psql $NEON_DB_URL < supabase_backup.sql
```

## 手順4: データの検証

```bash
# Neon CLIを使用
neonctl sql --query "SELECT COUNT(*) FROM esg_entries;" --project-id [PROJECT_ID]
neonctl sql --query "SELECT COUNT(*) FROM locations;" --project-id [PROJECT_ID]
neonctl sql --query "SELECT COUNT(*) FROM emission_factors;" --project-id [PROJECT_ID]
```

## 手順5: アプリケーションの切り替え

1. 環境変数を更新
   ```env
   # .env.local
   DATABASE_URL=postgresql://[user]:[password]@[host].neon.tech:5432/[database]?sslmode=require
   ```

2. Vercelの環境変数を更新
   - Vercelダッシュボードで`DATABASE_URL`を設定

3. デプロイ
   ```bash
   vercel --prod
   ```

## トラブルシューティング

### 文字エンコーディングの問題
```bash
# UTF-8でエクスポート/インポート
pg_dump --encoding=UTF8 $SUPABASE_DB_URL > backup.sql
```

### 大量データの場合
```bash
# 圧縮してエクスポート
pg_dump $SUPABASE_DB_URL | gzip > backup.sql.gz

# 解凍してインポート
gunzip -c backup.sql.gz | psql $NEON_DB_URL
```

### 権限エラー
```sql
-- Neonで実行
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO [your-user];
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO [your-user];
```

## データ整合性の確認

移行後、以下を確認してください：

1. レコード数の一致
2. 日付データの正確性
3. 数値データの精度
4. 外部キー制約の整合性
5. JSONBデータの構造

## ロールバック手順

問題が発生した場合：

1. Vercelの環境変数を元のSupabase設定に戻す
2. アプリケーションを再デプロイ
3. 問題を調査・修正後、再度移行を実施