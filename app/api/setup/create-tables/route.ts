import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function POST() {
  try {
    console.log("Creating database tables...")

    // data_entriesテーブルの作成
    const createDataEntriesTable = `
      CREATE TABLE IF NOT EXISTS data_entries (
        id SERIAL PRIMARY KEY,
        activity_type VARCHAR(255) NOT NULL,
        submitter VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        emission NUMERIC(15, 2) DEFAULT 0,
        entry_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    const result = await executeQuery(createDataEntriesTable)

    if (!result.success) {
      console.error("Error creating data_entries table:", result.error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create data_entries table",
          message: result.error,
        },
        { status: 500 },
      )
    }

    // サンプルデータの挿入
    const insertSampleData = `
      INSERT INTO data_entries (activity_type, submitter, status, emission, entry_date)
      VALUES 
        ('電力', 'system', 'approved', 1200.50, CURRENT_DATE - INTERVAL '1 month'),
        ('ガス', 'system', 'approved', 800.25, CURRENT_DATE - INTERVAL '2 months'),
        ('水道', 'system', 'approved', 300.75, CURRENT_DATE - INTERVAL '3 months'),
        ('廃棄物', 'system', 'pending', 500.00, CURRENT_DATE - INTERVAL '1 week'),
        ('輸送', 'system', 'approved', 1500.00, CURRENT_DATE - INTERVAL '2 weeks')
      ON CONFLICT DO NOTHING
    `

    const sampleDataResult = await executeQuery(insertSampleData)

    if (!sampleDataResult.success) {
      console.error("Error inserting sample data:", sampleDataResult.error)
      return NextResponse.json(
        {
          success: true,
          message: "Tables created but failed to insert sample data",
          error: sampleDataResult.error,
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Database tables created and sample data inserted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in create-tables API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create database tables",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
