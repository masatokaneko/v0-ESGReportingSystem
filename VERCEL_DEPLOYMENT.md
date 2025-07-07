# Vercel デプロイメントガイド

## 🚀 本番環境への Neon データベース移行

### 手順1: Vercel環境変数の設定

1. Vercelダッシュボード (https://vercel.com) にアクセス
2. プロジェクトを選択
3. Settings → Environment Variables
4. 以下の環境変数を追加/更新：

```env
DATABASE_URL=postgresql://esgprod_owner:npg_B0UIMFLWwn7j@ep-polished-dew-a1ctb7ie.ap-southeast-1.aws.neon.tech/esgprod?sslmode=require
```

**重要**: Environment は `Production`, `Preview`, `Development` すべてにチェックを入れてください。

### 手順2: 既存のSupabase環境変数の削除

以下の古い環境変数を削除してください：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`

### 手順3: デプロイメント

```bash
# コードをGitにコミット・プッシュ
git add .
git commit -m "feat: Migrate from Supabase to Neon database"
git push origin main
```

Vercelが自動的にデプロイを開始します。

### 手順4: デプロイ後の確認

1. **ヘルスチェック**: `https://your-app.vercel.app/api/health`
2. **ダッシュボード**: `https://your-app.vercel.app/`
3. **データ入力**: `https://your-app.vercel.app/data-entry`

## 🔧 トラブルシューティング

### ビルドエラーが発生する場合

1. Vercelの Build Command を確認:
   ```
   npm run build
   ```

2. Install Command を確認:
   ```
   npm install --legacy-peer-deps
   ```

### データベース接続エラーの場合

1. Vercelの Function Logs を確認
2. DATABASE_URLが正しく設定されているか確認
3. Neonデータベースがアクティブか確認

### パフォーマンス最適化

1. **接続プーリング**: Neonの接続プーリングを有効化
2. **リージョン設定**: Vercelのリージョンを Neon と同じリージョンに設定
3. **Edge Functions**: 高速化のためEdge Runtime を検討

## 📊 モニタリング

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Error Tracking
```bash
npm install @vercel/speed-insights
```

### Database Monitoring
- Neonダッシュボードでクエリパフォーマンスを監視
- 接続数とレスポンス時間を確認

## 🔄 ロールバック手順

問題が発生した場合の緊急ロールバック：

1. Vercelの Previous Deployment に戻す
2. 環境変数を元のSupabase設定に戻す
3. 問題を調査・修正後、再度移行

## ✅ 完了チェックリスト

- [ ] Vercel環境変数にDATABASE_URLを設定
- [ ] 古いSupabase環境変数を削除
- [ ] ヘルスチェックAPIが200を返す
- [ ] ダッシュボードが正常に表示される
- [ ] データ入力機能が動作する
- [ ] エラーログにデータベース関連のエラーがない

## 🎉 移行完了後

Neonデータベースへの移行が完了しました！

### 利用可能な新機能:
- Drizzle Studio: `npm run db:studio`
- 型安全なクエリ
- 改善されたエラーハンドリング
- 高速な接続プーリング