# Vercel Postgres セットアップガイド（デモ用）

## 1. Vercel Postgresの作成（3分）

1. Vercelダッシュボード → Storage → Create Database
2. "Postgres" を選択
3. データベース名を入力（例：esg-demo-db）
4. リージョンを選択（東京：hnd1）
5. "Create" をクリック

## 2. 環境変数の自動設定

Vercelが以下を自動設定：
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## 3. パッケージインストール

```bash
npm install @vercel/postgres
```

## 4. データベーススキーマ（簡易版）

```sql
-- 最小限のテーブル構成
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL
);

CREATE TABLE emission_factors (
  id SERIAL PRIMARY KEY,
  activity_type TEXT NOT NULL,
  factor DECIMAL(10, 6) NOT NULL,
  unit TEXT NOT NULL
);

CREATE TABLE esg_entries (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  department TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  activity_amount DECIMAL(10, 2) NOT NULL,
  emission_factor DECIMAL(10, 6) NOT NULL,
  emission DECIMAL(10, 4) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitter TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- インデックス
CREATE INDEX idx_esg_entries_date ON esg_entries(date);
CREATE INDEX idx_esg_entries_status ON esg_entries(status);
```

## 5. 初期データ投入

```sql
-- 拠点マスタ
INSERT INTO locations (name, code) VALUES
('本社', 'HQ001'),
('大阪支社', 'OS001'),
('名古屋工場', 'NF001'),
('福岡営業所', 'FS001');

-- 排出係数マスタ
INSERT INTO emission_factors (activity_type, factor, unit) VALUES
('electricity', 0.000495, 'tCO2/kWh'),
('gas', 0.00224, 'tCO2/m³'),
('fuel', 0.00232, 'tCO2/L'),
('water', 0.00036, 'tCO2/m³'),
('waste', 0.00034, 'tCO2/kg');
```

## 6. API実装例

`app/api/esg-entries/route.ts`:
```typescript
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const query = status
      ? sql`SELECT * FROM esg_entries WHERE status = ${status} ORDER BY date DESC`
      : sql`SELECT * FROM esg_entries ORDER BY date DESC`;
    
    const { rows } = await query;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rows } = await sql`
      INSERT INTO esg_entries (
        date, location, department, activity_type,
        activity_amount, emission_factor, emission,
        status, submitter, notes
      ) VALUES (
        ${body.date}, ${body.location}, ${body.department},
        ${body.activityType}, ${body.activityAmount},
        ${body.emissionFactor}, ${body.emission},
        'pending', ${body.submitter}, ${body.notes}
      ) RETURNING *
    `;
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
```

## 7. フロントエンド更新

`lib/data-service.ts`を更新：
```typescript
export async function getESGDataEntries() {
  const response = await fetch('/api/esg-entries');
  return response.json();
}

export async function submitESGData(data: any) {
  const response = await fetch('/api/esg-entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

## デモ用の制限事項

1. **認証なし** - デモ用なのでユーザー管理省略
2. **ファイル保存なし** - CSVは即座にパース、証跡ファイルは無視
3. **レポート生成** - クライアント側で動的生成

これで十分なデモ環境が構築できます！