/**
 * データベース接続エラーをログに記録する
 * @param error エラーオブジェクト
 * @param context 追加のコンテキスト情報
 */
export async function logDatabaseConnectionError(error: Error | unknown, context?: Record<string, any>) {
  console.error("Database Connection Error:", error, context)

  try {
    // コンソールにエラー詳細を出力
    if (error instanceof Error) {
      console.error(`DB Error: ${error.message}`)
      console.error(`Stack: ${error.stack}`)
    } else {
      console.error(`DB Error: ${String(error)}`)
    }

    if (context) {
      console.error("Context:", JSON.stringify(context, null, 2))
    }

    // 本番環境では、エラーログファイルに記録することも可能
    if (process.env.NODE_ENV === "production") {
      // 例: ファイルにエラーを記録
      // const fs = require('fs');
      // const logEntry = {
      //   timestamp: new Date().toISOString(),
      //   error: error instanceof Error ? error.message : String(error),
      //   stack: error instanceof Error ? error.stack : undefined,
      //   context
      // };
      // fs.appendFileSync('db-errors.log', JSON.stringify(logEntry) + '\n');
    }
  } catch (logError) {
    console.error("Failed to log database error:", logError)
  }
}
