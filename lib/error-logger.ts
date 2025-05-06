import { executeQuery } from "@/lib/neon"

export type ErrorSeverity = "info" | "warning" | "error" | "critical"
export type ErrorStatus = "open" | "in_progress" | "resolved" | "ignored"

export interface ErrorLogData {
  error_type: string
  message: string
  stack_trace?: string
  component?: string
  route?: string
  user_id?: string
  user_agent?: string
  request_data?: any
  context?: any
  severity?: ErrorSeverity
  status?: ErrorStatus
}

/**
 * サーバーサイドのエラーをログに記録する
 * @param error エラーオブジェクト
 * @param context 追加のコンテキスト情報
 */
export async function logServerError(error: Error | unknown, context?: Record<string, any>) {
  console.error("Server Error:", error, context)

  try {
    // 本番環境では、エラーログデータベースにエラーを記録する
    if (process.env.NODE_ENV === "production") {
      const errorData = {
        error_type: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack_trace: error instanceof Error ? error.stack : null,
        context: context ? JSON.stringify(context) : null,
        severity: "error" as ErrorSeverity,
        status: "open" as ErrorStatus,
      }

      const query = `
        INSERT INTO error_logs (
          error_type, message, stack_trace, context, severity, status
        ) VALUES (
          $1, $2, $3, $4::jsonb, $5, $6
        )
      `

      await executeQuery(query, [
        errorData.error_type,
        errorData.message,
        errorData.stack_trace,
        errorData.context,
        errorData.severity,
        errorData.status,
      ])
    }
  } catch (logError) {
    console.error("Failed to log server error:", logError)
  }
}

/**
 * クライアントサイドのエラーをログに記録する
 * @param error エラーオブジェクト
 * @param context 追加のコンテキスト情報
 */
export async function logClientError(error: Error | unknown, context?: Record<string, any>) {
  console.error("Client Error:", error, context)

  // クライアントサイドのエラーはAPIを通じてサーバーに送信する
  try {
    await fetch("/api/error-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error_type: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack_trace: error instanceof Error ? error.stack : null,
        context,
        severity: "error",
        status: "open",
      }),
    })
  } catch (logError) {
    console.error("Failed to log client error:", logError)
  }
}

/**
 * エラーオブジェクトからエラーログデータを作成する関数
 */
export function createErrorLogData(error: Error, additionalData?: Partial<ErrorLogData>): ErrorLogData {
  return {
    error_type: error.name,
    message: error.message,
    stack_trace: error.stack,
    ...additionalData,
  }
}
