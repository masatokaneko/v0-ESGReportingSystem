import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    // 環境変数のチェック
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      const missingVars = []
      if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL")
      if (!supabaseServiceKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY")

      return NextResponse.json(
        {
          error: "環境変数が設定されていません",
          message: `以下の環境変数を設定してください: ${missingVars.join(", ")}`,
          missingVars,
        },
        { status: 500 },
      )
    }

    // Supabaseクライアントの取得
    let supabase
    try {
      supabase = getSupabaseServer()
    } catch (error) {
      return NextResponse.json(
        {
          error: "Supabaseクライアントの初期化に失敗しました",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // テーブル一覧を取得
    const { data: tables, error: tablesError } = await supabase.rpc("get_tables").catch((error) => {
      return { data: null, error }
    })

    if (tablesError) {
      return NextResponse.json(
        {
          error: "テーブル一覧の取得に失敗しました",
          message: tablesError.message,
          details: tablesError,
        },
        { status: 500 },
      )
    }

    // RLSポリシー一覧を取得
    const { data: policies, error: policiesError } = await supabase.rpc("get_policies").catch((error) => {
      return { data: null, error }
    })

    if (policiesError) {
      return NextResponse.json(
        {
          error: "RLSポリシー一覧の取得に失敗しました",
          message: policiesError.message,
          details: policiesError,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      tables: tables || [],
      policies: policies || [],
    })
  } catch (error) {
    console.error("Error fetching RLS policies:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
