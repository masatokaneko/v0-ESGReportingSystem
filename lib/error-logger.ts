import { supabaseServer } from "./supabase"

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
 * サーバーサイドでエラーをログに記録する関数
 */
export async function logServerError(data: ErrorLogData) {
  try {
    const { error } = await supabaseServer.from("error_logs").insert([
      {
        error_type: data.error_type,
        message: data.message,
        stack_trace: data.stack_trace,
        component: data.component,
        route: data.route,
        user_id: data.user_id,
        user_agent: data.user_agent,
        request_data: data.request_data,
        context: data.context,
        severity: data.severity || "error",
        status: data.status || "open",
      },
    ])

    if (error) {
      console.error("Error logging failed:", error)
    }

    return { success: !error }
  } catch (err) {
    console.error("Error in logServerError:", err)
    return { success: false }
  }
}

/**
 * クライアントサイドでエラーをログに記録する関数
 */
export async function logClientError(data: ErrorLogData) {
  try {
    const response = await fetch("/api/error-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.error("Error logging failed:", await response.text())
      return { success: false }
    }

    return { success: true }
  } catch (err) {
    console.error("Error in logClientError:", err)
    return { success: false }
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
