import { type NextRequest, NextResponse } from "next/server"
import { logServerError } from "./error-logger"

export async function withErrorLogging(
  handler: (req: NextRequest) => Promise<NextResponse>,
  routeInfo: { path: string },
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      // エラーをログに記録
      await logServerError({
        error_type: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : String(error),
        stack_trace: error instanceof Error ? error.stack : undefined,
        route: routeInfo.path,
        user_agent: req.headers.get("user-agent") || undefined,
        request_data: {
          method: req.method,
          url: req.url,
          headers: Object.fromEntries(req.headers.entries()),
        },
        severity: "error",
      })

      // エラーレスポンスを返す
      return NextResponse.json(
        { error: "Internal Server Error", message: "An unexpected error occurred" },
        { status: 500 },
      )
    }
  }
}
