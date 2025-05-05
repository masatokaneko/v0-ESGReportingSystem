import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// 各APIエンドポイントをテストする関数
export async function GET(request: NextRequest) {
  const results: Record<string, any> = {}
  const errors: Record<string, any> = {}

  try {
    // テーブル一覧の取得
    const tableResults = await testTableAccess()
    results.tables = tableResults.success
    if (!tableResults.success) {
      errors.tables = tableResults.error
    }

    // 各テーブルへのアクセステスト
    const tablesAccess = await testSpecificTables()
    results.tablesAccess = tablesAccess.results
    if (Object.keys(tablesAccess.errors).length > 0) {
      errors.tablesAccess = tablesAccess.errors
    }

    // APIエンドポイントのテスト
    const apiEndpoints = await testApiEndpoints()
    results.apiEndpoints = apiEndpoints.results
    if (Object.keys(apiEndpoints.errors).length > 0) {
      errors.apiEndpoints = apiEndpoints.errors
    }

    // リクエスト情報
    results.requestInfo = {
      headers: Object.fromEntries(request.headers),
      url: request.url,
      method: request.method,
    }

    // 環境変数の状態（セキュリティ上の理由から値は含めない）
    results.envVars = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    return NextResponse.json({
      success: Object.keys(errors).length === 0,
      results,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// テーブル一覧へのアクセスをテスト
async function testTableAccess() {
  try {
    if (!supabaseServer) {
      return { success: false, error: "Supabase client not initialized" }
    }

    // テーブル一覧を取得
    const { data, error } = await supabaseServer.rpc("get_tables")

    if (error) {
      return {
        success: false,
        error: error.message,
        details: {
          code: error.code,
          hint: error.hint,
        },
      }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// 特定のテーブルへのアクセスをテスト
async function testSpecificTables() {
  const tables = ["data_entries", "locations", "departments", "emission_factors", "error_logs"]

  const results: Record<string, boolean> = {}
  const errors: Record<string, any> = {}

  if (!supabaseServer) {
    return {
      results,
      errors: { all: "Supabase client not initialized" },
    }
  }

  for (const table of tables) {
    try {
      const { data, error } = await supabaseServer.from(table).select("id").limit(1)

      if (error) {
        results[table] = false
        errors[table] = {
          message: error.message,
          code: error.code,
          hint: error.hint,
        }
      } else {
        results[table] = true
      }
    } catch (err) {
      results[table] = false
      errors[table] = err instanceof Error ? err.message : "Unknown error"
    }
  }

  return { results, errors }
}

// 各APIエンドポイントをテスト
async function testApiEndpoints() {
  const endpoints = [
    "/api/dashboard/summary",
    "/api/locations",
    "/api/departments",
    "/api/emission-factors",
    "/api/data-entries",
  ]

  const results: Record<string, boolean> = {}
  const errors: Record<string, any> = {}

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}${endpoint}`)

      results[endpoint] = response.ok

      if (!response.ok) {
        const errorText = await response.text()
        errors[endpoint] = {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 200), // 長すぎる場合は切り詰める
        }
      }
    } catch (err) {
      results[endpoint] = false
      errors[endpoint] = err instanceof Error ? err.message : "Unknown error"
    }
  }

  return { results, errors }
}

// RLSポリシーを取得するためのストアドプロシージャ
// Supabaseダッシュボードで以下のSQLを実行してください
/*
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE (table_name text, has_rls boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tables.table_name::text,
    tables.row_security::boolean
  FROM
    information_schema.tables
  WHERE
    table_schema = 'public'
    AND table_type = 'BASE TABLE';
END;
$$;
*/
