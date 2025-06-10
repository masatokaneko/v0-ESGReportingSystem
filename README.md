# ESG Reporting System

ESGデータの収集、管理、レポート作成を行うWebアプリケーションです。

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/masatokanekos-projects/v0-esg)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/cWzmtMjSPKl)

## 機能

- **ダッシュボード**: 排出量の概要、トレンド、ソース別の可視化
- **データ入力**: CSVアップロードまたは手動入力によるESGデータの登録
- **データ承認**: 登録されたデータの承認ワークフロー
- **レポート生成**: PDF、Excel、CSV形式でのレポート出力
- **設定管理**: 排出係数、拠点情報の管理

## 技術スタック

- **フレームワーク**: Next.js 15.2.4
- **UI**: React 19, Tailwind CSS, Radix UI
- **グラフ**: Recharts
- **フォーム**: React Hook Form, Zod
- **開発言語**: TypeScript

## セットアップ

1. 依存関係のインストール
```bash
npm install --legacy-peer-deps
```

2. 環境変数の設定
```bash
cp .env.example .env
```

3. 開発サーバーの起動
```bash
npm run dev
```

4. ブラウザで http://localhost:3000 を開く

## Vercelへのデプロイ

1. Vercelにプロジェクトをインポート
2. 環境変数を設定（必要に応じて）
3. デプロイ実行

プロジェクトURL: **[https://vercel.com/masatokanekos-projects/v0-esg](https://vercel.com/masatokanekos-projects/v0-esg)**

## プロジェクト構造

```
├── app/              # Next.js App Router
├── components/       # UIコンポーネント
├── lib/              # ユーティリティ、型定義、データサービス
├── public/           # 静的ファイル
└── styles/           # グローバルスタイル
```

## v0.dev Integration

- v0.devで編集: **[https://v0.dev/chat/projects/cWzmtMjSPKl](https://v0.dev/chat/projects/cWzmtMjSPKl)**
- 変更は自動的にこのリポジトリに同期されます