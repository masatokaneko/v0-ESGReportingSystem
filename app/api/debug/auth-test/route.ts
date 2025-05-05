import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // 環境変数を取得
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // 環境変数の存在確認
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({
        success: false,
        error: "Missing environment variables",
        details: {
          url: !!supabaseUrl,
          serviceRoleKey: !!supabaseServiceRoleKey,
          serviceRoleKeyLength: supabaseServiceRoleKey ? supabaseServiceRoleKey.length : 0,
          serviceRoleKeyPrefix: supabaseServiceRoleKey ? supabaseServiceRoleKey.substring(0, 20) + "..." : null,
        },
      })
    }

    // サービスロールクライアントの作成
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    // 匿名クライアントの作成（比較用）
    const supabaseAnon = supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        })
      : null

    // サービスロールでの接続テスト
    const adminResult = await testConnection(supabaseAdmin, "service_role")

    // 匿名ロールでの接続テスト（比較用）
    const anonResult = supabaseAnon
      ? await testConnection(supabaseAnon, "anon")
      : { success: false, error: "Anon key not available" }

    return NextResponse.json({
      success: adminResult.success,
      serviceRole: adminResult,
      anon: anonResult,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

async function testConnection(client: any, role: string) {
  try {
    // 単純なクエリを実行
    const { data, error } = await client.from("data_entries").select("id").limit(1)

    if (error) {
      return {
        success: false,
        role,
        error: error.message,
        details: {
          code: error.code,
          hint: error.hint,
          details: error.details,
        },
      }
    }

    return {
      success: true,
      role,
      data,
    }
  } catch (error) {
    return {
      success: false,
      role,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }
  }
}
