# ESGレポーティングシステム セットアップガイド

## 前提条件

- Node.js 18以上
- npm または pnpm
- Supabaseアカウント

## ローカル開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/masatokaneko/v0-ESGReportingSystem.git
cd v0-ESGReportingSystem
```

### 2. 依存関係のインストール

```bash
npm install --legacy-peer-deps
```

### 3. Supabaseプロジェクトの設定

#### 3.1 Supabaseプロジェクトの作成
1. [Supabase](https://supabase.com)にアクセスしてサインアップ/ログイン
2. 「New Project」をクリック
3. プロジェクト名、データベースパスワードを設定
4. リージョンを選択（Tokyo推奨）
5. 「Create new project」をクリック

#### 3.2 データベースの初期化
1. Supabaseダッシュボードで「SQL Editor」を開く
2. `lib/supabase-schema.sql`の内容をコピー
3. SQL Editorに貼り付けて「Run」を実行

#### 3.3 APIキーの取得
1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の値をコピー：
   - Project URL
   - anon public key
   - service_role key（**秘密鍵**）

### 4. 環境変数の設定

`.env.local`ファイルを作成：

```bash
cp .env.example .env.local
```

`.env.local`を編集して、Supabaseの値を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## 本番環境へのデプロイ（Vercel）

### 1. Vercelでのデプロイ設定

1. [Vercel](https://vercel.com)にプロジェクトをインポート
2. 以下の設定を行う：
   - **Install Command**: `npm install --legacy-peer-deps`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2. 環境変数の設定

Vercelの「Settings」→「Environment Variables」で以下を設定：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 3. デプロイ実行

設定完了後、「Deploy」をクリックしてデプロイを実行します。

## Supabaseの特徴

### ✅ 実装済み機能

- **リアルタイムデータベース**: PostgreSQL
- **自動API生成**: REST API自動生成
- **Row Level Security**: セキュリティポリシー
- **ダッシュボード**: データベース管理画面

### 🚀 拡張可能機能

- **認証機能**: Supabase Auth（メール、OAuth等）
- **ファイルストレージ**: Supabase Storage
- **Edge Functions**: サーバーレス関数
- **リアルタイム同期**: WebSocketベース

## データベーススキーマ

主要テーブル：
- `locations`: 拠点マスタ
- `emission_factors`: 排出係数マスタ
- `esg_entries`: ESGデータエントリ

詳細は `lib/supabase-schema.sql` を参照してください。

## トラブルシューティング

### ビルドエラーが発生する場合

1. **依存関係の問題**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

2. **型エラーが発生する場合**
   ```bash
   npm run lint
   ```

### Supabase接続エラーが発生する場合

1. 環境変数が正しく設定されているか確認
2. SupabaseプロジェクトのURLとAPIキーが正しいか確認
3. Row Level Security (RLS) ポリシーが適切に設定されているか確認

### データが表示されない場合

1. `lib/supabase-schema.sql`が正しく実行されているか確認
2. 初期データが投入されているか確認
3. ブラウザの開発者ツールでAPIエラーを確認

## セキュリティ設定

### Row Level Security (RLS)

現在はデモ用にすべてのユーザーがアクセス可能な設定になっています。
本番環境では以下のような認証ベースのポリシーに変更してください：

```sql
-- 認証済みユーザーのみアクセス可能
CREATE POLICY "Authenticated users only" ON esg_entries
  FOR ALL USING (auth.uid() IS NOT NULL);
```

### APIキーの管理

- **anon key**: フロントエンドで使用（公開OK）
- **service_role key**: サーバーサイドのみ使用（**絶対に秘匿**）

## 本格運用への拡張

### 1. 認証機能の追加
- Supabase Authを使用したユーザー管理
- 部門・役職ベースのアクセス制御

### 2. ファイルストレージの追加
- Supabase Storageを使用したファイル管理
- CSVファイルや証跡書類の保存

### 3. リアルタイム機能
- データ更新の即座反映
- 承認通知のリアルタイム表示

### 4. 監査ログ
- データ変更履歴の記録
- ユーザー操作ログの保存