# Supabaseセットアップガイド

## 1. Supabaseプロジェクト作成
1. [Supabase](https://supabase.com)でアカウント作成
2. 新規プロジェクト作成
3. データベースパスワードを設定（保存必須）

## 2. 環境変数の設定
`.env.local`を作成：
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. データベーススキーマ

```sql
-- ユーザーテーブル（Supabase Authと連携）
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 拠点マスタ
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 排出係数マスタ
CREATE TABLE emission_factors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_type TEXT NOT NULL,
  category TEXT NOT NULL,
  factor DECIMAL(10, 6) NOT NULL,
  unit TEXT NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ESGデータエントリ
CREATE TABLE esg_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  location_id UUID REFERENCES locations(id) NOT NULL,
  department TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  activity_amount DECIMAL(10, 2) NOT NULL,
  emission_factor_id UUID REFERENCES emission_factors(id) NOT NULL,
  emission DECIMAL(10, 4) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitter_id UUID REFERENCES users(id) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 添付ファイル
CREATE TABLE attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  esg_entry_id UUID REFERENCES esg_entries(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- インデックス作成
CREATE INDEX idx_esg_entries_date ON esg_entries(date);
CREATE INDEX idx_esg_entries_location ON esg_entries(location_id);
CREATE INDEX idx_esg_entries_status ON esg_entries(status);

-- Row Level Security (RLS)
ALTER TABLE esg_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emission_factors ENABLE ROW LEVEL SECURITY;

-- ポリシー例：全員が読み取り可能
CREATE POLICY "Public read access" ON esg_entries
  FOR SELECT USING (true);

-- ポリシー例：認証ユーザーのみ作成可能
CREATE POLICY "Authenticated users can insert" ON esg_entries
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

## 4. パッケージインストール

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## 5. Supabaseクライアント設定

`lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```