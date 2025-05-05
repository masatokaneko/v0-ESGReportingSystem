import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer, isSupabaseServerInitialized } from "@/lib/supabase"

// エラーログをデータベースに記録する関数
async function logErrorToDatabase(errorData: any) {
  if (!isSupabaseServerInitialized()) {
    console.error("Supabase client is not initialized. Error logging failed.")
    return { success: false, error: "Database client not initialized" }
  }

  try {
    const supabaseServer = getSupabaseServer()
    const { error } = await supabaseServer.from("error_logs").insert([errorData])

    if (error) {
      console.error("Failed to log error to database:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("Error while logging to database:", err)
    return { success: false, error: (err as Error).message }
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 必須フィールドの検証
    if (!data.error_type || !data.message) {
      return NextResponse.json({ error: "Error type and message are required" }, { status: 400 })
    }

    // クライアントからのリクエスト情報を追加
    const enhancedData = {
      ...data,
      user_agent: request.headers.get("user-agent") || undefined,
      request_data: {
        ...data.request_data,
        headers: Object.fromEntries(request.headers.entries()),
        url: request.url,
      },
    }

    const result = await logErrorToDatabase(enhancedData)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to log error" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in error-logs API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
