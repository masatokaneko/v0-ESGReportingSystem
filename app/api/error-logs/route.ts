import { type NextRequest, NextResponse } from "next/server"
import { logServerError } from "@/lib/error-logger"

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

    const result = await logServerError(enhancedData)

    if (!result.success) {
      return NextResponse.json({ error: "Failed to log error" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in error-logs API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
