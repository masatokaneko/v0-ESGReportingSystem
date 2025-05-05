import { logServerError } from "./error-logger"

/**
 * データベース接続エラーを専用のフォーマットでログに記録する
 */
export async function logDatabaseConnectionError(error: unknown, context?: Record<string, any>) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  // 環境変数の状態を確認（値自体は記録しない）
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  // エラーログに記録
  await logServerError({
    message: `Database connection error: ${errorMessage}`,
    stack: errorStack,
    severity: "critical",
    context: {
      ...context,
      environmentVariablesStatus: envStatus,
      timestamp: new Date().toISOString(),
    },
    source: "database",
  })

  console.error("[Database Connection Error]", errorMessage, context)
}
