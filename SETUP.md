# ESGレポーティングシステム セットアップガイド

## 前提条件

- Node.js 18以上
- npm または pnpm
- Vercelアカウント

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

### 3. Vercel Postgresの設定

#### 3.1 Vercelダッシュボードでの操作
1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. プロジェクトを選択
3. **Storage** タブを開く
4. **Create Database** → **Postgres** を選択
5. データベース名を入力（例：`esg-demo-db`）
6. リージョンを選択（東京：`hnd1`）
7. **Create** をクリック

#### 3.2 環境変数の確認
Vercelが自動的に以下の環境変数を設定します：
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

#### 3.3 ローカル環境に環境変数をダウンロード
```bash
# Vercel CLIがインストールされていない場合
npm i -g vercel

# プロジェクトにリンク
vercel link

# 環境変数をローカルにダウンロード
vercel env pull .env.local
```

### 4. データベースの初期化

```bash
npm run setup-db
```

このコマンドで以下が実行されます：
- テーブルの作成
- 初期マスタデータの投入
- サンプルESGデータの投入

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## 本番環境へのデプロイ

### 1. Vercelでのデプロイ設定

1. **Install Command**: `npm install --legacy-peer-deps`
2. **Build Command**: `npm run build`
3. **Output Directory**: `.next`

### 2. デプロイ後の初期化

Vercelにデプロイした後、データベースを初期化する必要があります：

1. Vercel Functionとして実行するか
2. ローカルから環境変数付きで実行：

```bash
# .env.localに本番環境の環境変数を設定後
npm run setup-db
```

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

### データベース接続エラーが発生する場合

1. 環境変数が正しく設定されているか確認
2. Vercel Postgresが正しく作成されているか確認
3. データベースの初期化が完了しているか確認

## 機能説明

### 実装済み機能

- ✅ **ダッシュボード**: リアルタイムデータ表示
- ✅ **データ入力**: ESGデータの登録
- ✅ **データ検索**: フィルター機能付き検索
- ✅ **承認ワークフロー**: ステータス更新機能
- ✅ **設定管理**: 排出係数・拠点管理
- ✅ **レポート生成**: CSVテンプレートダウンロード

### 簡易実装機能（デモ用）

- 📝 **ファイルアップロード**: UIのみ（実際の保存なし）
- 📝 **認証機能**: なし（デモ用）
- 📝 **レポート生成**: クライアント側生成のみ

## データベーススキーマ

主要テーブル：
- `locations`: 拠点マスタ
- `emission_factors`: 排出係数マスタ
- `esg_entries`: ESGデータエントリ

詳細は `lib/db-schema.sql` を参照してください。