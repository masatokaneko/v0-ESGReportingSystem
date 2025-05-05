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
    // 本番環境では、エラーログデータベースにエラーを記録することも可能
    if (process.env.NODE_ENV === "production") {
      // 例: データベースにエラーを記録
      // const sql = neon(process.env.NEON_DATABASE_URL);
      // await sql`
      //   INSERT INTO error_logs (source, message, stack, context, created_at)
      //   VALUES ('server', ${error instanceof Error ? error.message : String(error)},
      //           ${error instanceof Error ? error.stack : null},
      //           ${JSON.stringify(context)},
      //           NOW())
      // `;
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

  try {
    // 本番環境では、エラーログAPIにエラーを送信することも可能
    if (process.env.NODE_ENV === "production") {
      // 例: エラーログAPIにエラーを送信
      // await fetch('/api/error-logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     source: 'client',
      //     error: error instanceof Error ? error.message : String(error),
      //     stack: error instanceof Error ? error.stack : undefined,
      //     context
      //   })
      // });
    }
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
