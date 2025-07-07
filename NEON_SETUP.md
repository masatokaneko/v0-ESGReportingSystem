# Neon データベースセットアップガイド

## 1. Neon CLIでのセットアップ

### ログイン
```bash
neonctl auth
```

### プロジェクトの一覧表示
```bash
neonctl projects list
```

### データベース接続情報の取得
```bash
# プロジェクトIDを指定して接続文字列を取得
neonctl connection-string [PROJECT_ID]
```

## 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の形式でDATABASE_URLを設定してください：

```env
DATABASE_URL=postgresql://[user]:[password]@[host].neon.tech:5432/[database]?sslmode=require
```

## 3. データベーススキーマの適用

### オプション1: Neon CLIを使用
```bash
# SQLファイルを実行
neonctl sql -f neon-schema.sql --project-id [PROJECT_ID]
```

### オプション2: psqlを使用
```bash
# DATABASE_URLを使ってpsqlで接続
psql $DATABASE_URL < neon-schema.sql
```

### オプション3: Neonコンソールを使用
1. https://console.neon.tech にアクセス
2. プロジェクトを選択
3. SQL Editorを開く
4. `neon-schema.sql`の内容をコピー&ペースト
5. 実行

## 4. Vercelでの環境変数設定

Vercelですでに接続されている場合、Vercelのダッシュボードで環境変数を確認・設定できます：

1. Vercelダッシュボードにアクセス
2. プロジェクトを選択
3. Settings → Environment Variables
4. `DATABASE_URL`が設定されていることを確認

## 5. 動作確認

```bash
# ローカルで動作確認
npm run dev
```

アプリケーションが正常に動作し、データベースに接続できることを確認してください。

## トラブルシューティング

### 接続エラーが発生する場合
- DATABASE_URLの形式が正しいか確認
- `?sslmode=require`が含まれているか確認
- Neonのダッシュボードでデータベースがアクティブか確認

### スキーマエラーが発生する場合
- `neon-schema.sql`が正しく実行されたか確認
- テーブルが作成されているか確認：
  ```bash
  neonctl sql --query "SELECT tablename FROM pg_tables WHERE schemaname = 'public';" --project-id [PROJECT_ID]
  ```