-- ESGレポーティングシステム Supabaseスキーマ（エラー修正版）
-- 既存のポリシーエラーを回避するためのスクリプト

-- 既存のポリシーを削除（エラーを無視）
DROP POLICY IF EXISTS "Enable read access for all users" ON locations;
DROP POLICY IF EXISTS "Enable insert for all users" ON locations;
DROP POLICY IF EXISTS "Enable update for all users" ON locations;
DROP POLICY IF EXISTS "Enable delete for all users" ON locations;

DROP POLICY IF EXISTS "Enable read access for all users" ON emission_factors;
DROP POLICY IF EXISTS "Enable insert for all users" ON emission_factors;
DROP POLICY IF EXISTS "Enable update for all users" ON emission_factors;
DROP POLICY IF EXISTS "Enable delete for all users" ON emission_factors;

DROP POLICY IF EXISTS "Enable read access for all users" ON esg_entries;
DROP POLICY IF EXISTS "Enable insert for all users" ON esg_entries;
DROP POLICY IF EXISTS "Enable update for all users" ON esg_entries;
DROP POLICY IF EXISTS "Enable delete for all users" ON esg_entries;

-- 拠点マスタテーブル
CREATE TABLE IF NOT EXISTS locations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 排出係数マスタテーブル
CREATE TABLE IF NOT EXISTS emission_factors (
  id BIGSERIAL PRIMARY KEY,
  activity_type TEXT NOT NULL,
  category TEXT NOT NULL,
  factor DECIMAL(10, 6) NOT NULL,
  unit TEXT NOT NULL,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ESGデータエントリテーブル
CREATE TABLE IF NOT EXISTS esg_entries (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  department TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  activity_amount DECIMAL(10, 2) NOT NULL,
  emission_factor DECIMAL(10, 6) NOT NULL,
  emission DECIMAL(10, 4) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitter TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_esg_entries_date ON esg_entries(date);
CREATE INDEX IF NOT EXISTS idx_esg_entries_location ON esg_entries(location);
CREATE INDEX IF NOT EXISTS idx_esg_entries_status ON esg_entries(status);
CREATE INDEX IF NOT EXISTS idx_esg_entries_activity_type ON esg_entries(activity_type);

-- Row Level Security (RLS) を有効化
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emission_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE esg_entries ENABLE ROW LEVEL SECURITY;

-- locations テーブルのポリシー
CREATE POLICY "Enable read access for all users" ON locations
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON locations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON locations
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON locations
  FOR DELETE USING (true);

-- emission_factors テーブルのポリシー
CREATE POLICY "Enable read access for all users" ON emission_factors
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON emission_factors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON emission_factors
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON emission_factors
  FOR DELETE USING (true);

-- esg_entries テーブルのポリシー
CREATE POLICY "Enable read access for all users" ON esg_entries
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON esg_entries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON esg_entries
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON esg_entries
  FOR DELETE USING (true);

-- 初期データ投入

-- 拠点マスタ
INSERT INTO locations (name, code, address, type) VALUES
('本社', 'HQ001', '東京都千代田区大手町1-1-1', 'office'),
('大阪支社', 'OS001', '大阪府大阪市中央区本町2-2-2', 'office'),
('名古屋工場', 'NF001', '愛知県名古屋市港区3-3-3', 'factory'),
('福岡営業所', 'FS001', '福岡県福岡市博多区4-4-4', 'sales')
ON CONFLICT (code) DO NOTHING;

-- 排出係数マスタ
INSERT INTO emission_factors (activity_type, category, factor, unit) VALUES
('electricity', '電力', 0.000495, 'tCO2/kWh'),
('gas', '都市ガス', 0.00224, 'tCO2/m³'),
('fuel', 'ガソリン', 0.00232, 'tCO2/L'),
('water', '上水道', 0.00036, 'tCO2/m³'),
('waste', '一般廃棄物', 0.00034, 'tCO2/kg')
ON CONFLICT DO NOTHING;

-- サンプルESGデータ
INSERT INTO esg_entries (
  date, location, department, activity_type, activity_amount,
  emission_factor, emission, status, submitter, notes
) VALUES
('2024-12-01', '本社', 'admin', 'electricity', 15000.00, 0.000495, 7.425, 'approved', '田中太郎', '12月分電力使用量'),
('2024-12-05', '名古屋工場', 'production', 'gas', 3000.00, 0.00224, 6.72, 'pending', '佐藤花子', '製造ライン用ガス'),
('2024-12-10', '大阪支社', 'sales', 'fuel', 500.00, 0.00232, 1.16, 'approved', '鈴木一郎', '営業車ガソリン'),
('2024-11-15', '本社', 'it', 'electricity', 12000.00, 0.000495, 5.94, 'approved', '山田次郎', '11月分電力使用量'),
('2024-11-20', '福岡営業所', 'sales', 'fuel', 300.00, 0.00232, 0.696, 'approved', '高橋三郎', '営業車ガソリン'),
('2024-12-15', '名古屋工場', 'production', 'water', 800.00, 0.00036, 0.288, 'pending', '佐藤花子', '工場用水'),
('2024-12-20', '大阪支社', 'admin', 'waste', 150.00, 0.00034, 0.051, 'pending', '田中花子', '一般廃棄物')
ON CONFLICT DO NOTHING;