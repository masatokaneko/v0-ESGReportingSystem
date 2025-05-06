import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function POST() {
  try {
    console.log("Creating database tables...")

    // locations テーブルの作成
    const createLocationsTable = `
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        country VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    await executeQuery(createLocationsTable)

    // departments テーブルの作成
    const createDepartmentsTable = `
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location_id INTEGER REFERENCES locations(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    await executeQuery(createDepartmentsTable)

    // emission_factors テーブルの作成
    const createEmissionFactorsTable = `
      CREATE TABLE IF NOT EXISTS emission_factors (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        activity_type VARCHAR(255) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        factor DECIMAL(10, 4) NOT NULL,
        source VARCHAR(255),
        year INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    await executeQuery(createEmissionFactorsTable)

    // data_entries テーブルの作成
    const createDataEntriesTable = `
      CREATE TABLE IF NOT EXISTS data_entries (
        id SERIAL PRIMARY KEY,
        location_id INTEGER,
        department_id INTEGER,
        activity_type VARCHAR(255) NOT NULL,
        quantity DECIMAL(15, 4) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        emission DECIMAL(15, 4),
        entry_date DATE NOT NULL,
        submitter VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    await executeQuery(createDataEntriesTable)

    // error_logs テーブルの作成
    const createErrorLogsTable = `
      CREATE TABLE IF NOT EXISTS error_logs (
        id SERIAL PRIMARY KEY,
        error_type VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        stack_trace TEXT,
        component VARCHAR(255),
        route VARCHAR(255),
        user_id VARCHAR(255),
        user_agent TEXT,
        request_data JSONB,
        context JSONB,
        severity VARCHAR(50) DEFAULT 'error',
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    await executeQuery(createErrorLogsTable)

    // サンプルデータの挿入（locations）
    const insertLocations = `
      INSERT INTO locations (name, address, country)
      VALUES 
        ('東京本社', '東京都千代田区丸の内1-1-1', '日本'),
        ('大阪支社', '大阪府大阪市北区梅田2-2-2', '日本'),
        ('名古屋支社', '愛知県名古屋市中区栄3-3-3', '日本')
      ON CONFLICT DO NOTHING
    `
    await executeQuery(insertLocations)

    // サンプルデータの挿入（departments）
    const insertDepartments = `
      INSERT INTO departments (name, location_id)
      VALUES 
        ('総務部', 1),
        ('営業部', 1),
        ('開発部', 1),
        ('営業部', 2),
        ('製造部', 3)
      ON CONFLICT DO NOTHING
    `
    await executeQuery(insertDepartments)

    // サンプルデータの挿入（emission_factors）
    const insertEmissionFactors = `
      INSERT INTO emission_factors (category, activity_type, unit, factor, source, year)
      VALUES 
        ('Scope 2', '電力', 'kWh', 0.4500, '環境省', 2023),
        ('Scope 1', 'ガス', 'm3', 2.2300, '環境省', 2023),
        ('Scope 1', 'ガソリン', 'L', 2.3200, '環境省', 2023),
        ('Scope 3', '廃棄物', 'kg', 0.5200, '環境省', 2023),
        ('Scope 3', '出張', 'km', 0.1300, '環境省', 2023)
      ON CONFLICT DO NOTHING
    `
    await executeQuery(insertEmissionFactors)

    // サンプルデータの挿入（data_entries）
    const insertDataEntries = `
      INSERT INTO data_entries (location_id, department_id, activity_type, quantity, unit, emission, entry_date, submitter, status)
      VALUES 
        (1, 1, '電力', 5000, 'kWh', 2250, CURRENT_DATE - INTERVAL '1 month', '山田太郎', 'approved'),
        (1, 2, 'ガス', 300, 'm3', 669, CURRENT_DATE - INTERVAL '2 months', '鈴木一郎', 'approved'),
        (2, 4, '電力', 3000, 'kWh', 1350, CURRENT_DATE - INTERVAL '3 months', '佐藤花子', 'approved'),
        (3, 5, 'ガソリン', 200, 'L', 464, CURRENT_DATE - INTERVAL '15 days', '田中次郎', 'pending'),
        (1, 3, '廃棄物', 500, 'kg', 260, CURRENT_DATE - INTERVAL '20 days', '山田太郎', 'approved'),
        (2, 4, '出張', 1000, 'km', 130, CURRENT_DATE - INTERVAL '25 days', '佐藤花子', 'rejected'),
        (1, 1, '電力', 5500, 'kWh', 2475, CURRENT_DATE - INTERVAL '40 days', '山田太郎', 'approved'),
        (1, 2, 'ガス', 350, 'm3', 780.5, CURRENT_DATE - INTERVAL '50 days', '鈴木一郎', 'approved'),
        (2, 4, '電力', 3200, 'kWh', 1440, CURRENT_DATE - INTERVAL '60 days', '佐藤花子', 'approved'),
        (3, 5, 'ガソリン', 250, 'L', 580, CURRENT_DATE - INTERVAL '70 days', '田中次郎', 'approved')
      ON CONFLICT DO NOTHING
    `
    await executeQuery(insertDataEntries)

    return NextResponse.json({
      success: true,
      message: "データベーステーブルの作成とサンプルデータの挿入に成功しました",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error creating database tables:", error)
    return NextResponse.json(
      {
        success: false,
        message: "データベーステーブルの作成中にエラーが発生しました",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
