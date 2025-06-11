# ESG Reporting System

企業のESG（環境・社会・ガバナンス）データを管理・レポーティングするためのWebアプリケーションです。

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/masatokanekos-projects/v0-esg)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/cWzmtMjSPKl)

## 機能概要

- 📊 **ダッシュボード**: ESGデータの可視化と分析（排出量トレンド、スコープ別分析）
- 📝 **データ入力**: 活動データの登録とCSVアップロード機能
- ✅ **承認ワークフロー**: データの承認プロセス管理
- 📈 **レポート生成**: PDF/Excel/CSV形式でのレポート出力
- 🔧 **設定管理**: 排出係数や拠点情報の管理

## 技術スタック

- **フロントエンド**: Next.js 15.2.4, React 19, TypeScript
- **スタイリング**: Tailwind CSS, shadcn/ui (Radix UI)
- **データベース**: Supabase (PostgreSQL)
- **状態管理**: React Hook Form, Zod
- **グラフ**: Recharts
- **デプロイ**: Vercel

## セットアップ手順

### 前提条件

- Node.js 18以上
- npm または pnpm
- Supabaseアカウント

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)でアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定画面から以下の情報を取得：
   - Project URL
   - anon public key
   - service_role key

### 2. データベースのセットアップ

Supabase DashboardのSQL Editorで以下のファイルを実行：

```sql
-- lib/supabase-schema.sql の内容をSQL Editorで実行
```

### 3. 環境変数の設定

#### ローカル開発環境

```bash
# .env.localファイルを作成
cp .env.example .env.local
```

`.env.local`を編集して実際の値を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. 依存関係のインストールと起動

```bash
# 依存関係のインストール
npm install --legacy-peer-deps

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. デプロイを実行

```bash
# ビルドコマンド
npm run build

# 起動コマンド
npm start
```

プロジェクトURL: **[https://vercel.com/masatokanekos-projects/v0-esg](https://vercel.com/masatokanekos-projects/v0-esg)**

## 使い方

### データ入力

1. サイドバーから「データ入力」を選択
2. フォームに必要情報を入力：
   - 日付
   - 拠点（本社、大阪支社、名古屋工場、福岡営業所）
   - 部門
   - 活動タイプ（電力、ガス、燃料、水、廃棄物）
   - 活動量
3. 送信ボタンをクリック

### CSVアップロード

1. 「アップロード」→「CSVアップロード」を選択
2. テンプレートをダウンロードして記入
3. ファイルをアップロード

### データ承認

1. 「承認」メニューから承認待ちデータを確認
2. 詳細を確認して承認/却下

### レポート生成

1. 「レポート」メニューを選択
2. 期間と拠点を選択
3. 出力形式（PDF/Excel/CSV）を選択
4. 「レポート生成」をクリック

## プロジェクト構造

```
├── app/              # Next.js App Router
│   ├── api/          # APIルート
│   ├── dashboard/    # ダッシュボード
│   ├── data-entry/   # データ入力
│   ├── approval/     # 承認管理
│   └── reports/      # レポート生成
├── components/       # UIコンポーネント
├── lib/              # ユーティリティ、型定義、データサービス
│   ├── supabase.ts   # Supabaseクライアント
│   ├── types.ts      # TypeScript型定義
│   └── data-service.ts # データアクセス層
├── public/           # 静的ファイル
└── styles/           # グローバルスタイル
```

## トラブルシューティング

### データベース接続エラー

- Supabaseの環境変数が正しく設定されているか確認
- Supabaseプロジェクトが稼働しているか確認
- RLS（Row Level Security）ポリシーが適切に設定されているか確認

### ビルドエラー

```bash
# --legacy-peer-depsオプションを使用
npm install --legacy-peer-deps
```

### 環境変数が読み込まれない

- Vercelの場合: プロジェクト設定で環境変数を確認
- ローカルの場合: `.env.local`ファイルが存在するか確認
- 変数名が`NEXT_PUBLIC_`で始まっているか確認（クライアント側で使用する場合）

## v0.dev Integration

- v0.devで編集: **[https://v0.dev/chat/projects/cWzmtMjSPKl](https://v0.dev/chat/projects/cWzmtMjSPKl)**
- 変更は自動的にこのリポジトリに同期されます

## ライセンス

MIT