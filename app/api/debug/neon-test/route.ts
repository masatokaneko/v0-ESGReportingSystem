import { NextResponse } from "next/server"
import { testNeonConnection, executeQuery } from "@/lib/neon"

export async function GET() {
  try {
    // Neon接続テスト
    const connectionTest = await testNeonConnection()

    // テーブル一覧の取得
    const tablesQuery = `
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM 
        information_schema.tables t
      WHERE 
        table_schema = 'public'
      ORDER BY 
        table_name
    `
    const tablesResult = await executeQuery(tablesQuery)

    // サンプルデータの取得
    const sampleDataQuery = `
      SELECT 
        'locations' as table_name,
        COUNT(*) as row_count
      FROM 
        locations
      UNION ALL
      SELECT 
        'departments' as table_name,
        COUNT(*) as row_count
      FROM 
        departments
      UNION ALL
      SELECT 
        'emission_factors' as table_name,
        COUNT(*) as row_count
      FROM 
        emission_factors
      UNION ALL
      SELECT 
        'data_entries' as table_name,
        COUNT(*) as row_count
      FROM 
        data_entries
    `
    const sampleDataResult = await executeQuery(sampleDataQuery)

    // データベース情報の取得
    const dbInfoQuery = `
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as pg_version
    `
    const dbInfoResult = await executeQuery(dbInfoQuery)

    return NextResponse.json({
      connectionTest,
      databaseInfo: dbInfoResult.success ? dbInfoResult.data?.[0] : null,
      tables: tablesResult.success ? tablesResult.data : [],
      sampleData: sampleDataResult.success ? sampleDataResult.data : [],
      environmentVariables: {
        database_url: process.env.NEON_DATABASE_URL ? "設定済み" : "未設定",
        postgres_url: process.env.POSTGRES_URL ? "設定済み" : "未設定",
        database_url_unpooled: process.env.DATABASE_URL_UNPOOLED ? "設定済み" : "未設定",
        postgres_url_non_pooling: process.env.POSTGRES_URL_NON_POOLING ? "設定済み" : "未設定",
        pg_host: process.env.PGHOST ? "設定済み" : "未設定",
        pg_database: process.env.PGDATABASE ? "設定済み" : "未設定",
        pg_user: process.env.PGUSER ? "設定済み" : "未設定",
      },
    })
  } catch (error) {
    console.error("Error in Neon test API:", error)
    return NextResponse.json(
      {
        error: "Failed to test Neon connection",
        message: error instanceof Error ? error.message : "Unknown error",
        environmentVariables: {
          database_url: process.env.DATABASE_URL ? "設定済み" : "未設定",
          postgres_url: process.env.POSTGRES_URL ? "設定済み" : "未設定",
          database_url_unpooled: process.env.DATABASE_URL_UNPOOLED ? "設定済み" : "未設定",
          postgres_url_non_pooling: process.env.POSTGRES_URL_NON_POOLING ? "設定済み" : "未設定",
        },
      },
      { status: 500 },
    )
  }
}
