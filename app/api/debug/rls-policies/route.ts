import { NextResponse } from "next/server"
import { getSupabaseServer, isSupabaseServerInitialized } from "@/lib/supabase"

export async function GET() {
  try {
    if (!isSupabaseServerInitialized()) {
      return NextResponse.json(
        {
          error: "Database connection error",
          message: "Supabase client is not initialized. Please check environment variables.",
        },
        { status: 500 },
      )
    }

    const supabase = getSupabaseServer()

    // テーブル一覧を取得
    const { data: tables, error: tablesError } = await supabase.rpc("get_tables")

    if (tablesError) {
      return NextResponse.json(
        {
          error: "Failed to fetch tables",
          message: tablesError.message,
        },
        { status: 500 },
      )
    }

    // RLSポリシー一覧を取得
    const { data: policies, error: policiesError } = await supabase.rpc("get_policies")

    if (policiesError) {
      return NextResponse.json(
        {
          error: "Failed to fetch policies",
          message: policiesError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      tables,
      policies,
    })
  } catch (error) {
    console.error("Error fetching RLS policies:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
