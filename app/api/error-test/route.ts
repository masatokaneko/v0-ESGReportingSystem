import { type NextRequest, NextResponse } from "next/server"
import { logServerError } from "@/lib/error-logger"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 50%の確率でエラーを発生させる
    if (Math.random() > 0.5) {
      throw new Error("テスト用のAPIエラー")
    }

    // 正常なレスポンス
    return NextResponse.json({ success: true, message: "APIは正常に動作しています" })
  } catch (error) {
    // エラーをログに記録
    if (error instanceof Error) {
      await logServerError({
        error_type: "APITestError",
        message: error.message,
        stack_trace: error.stack,
        route: "/api/error-test",
        request_data: { url: request.url, method: request.method },
        severity: "error",
      })
    }

    // エラーレスポンスを返す
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
