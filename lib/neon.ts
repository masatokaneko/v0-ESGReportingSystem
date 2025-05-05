import { neon, neonConfig } from "@neondatabase/serverless"
import { logServerError } from "./error-logger"

// 環境変数の優先順位: NEON_DATABASE_URL > DATABASE_URL > その他のNeon関連環境変数
const getDatabaseUrl = () => {
  if (process.env.NEON_DATABASE_URL) {
    return process.env.NEON_DATABASE_URL
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  // その他のNeon関連環境変数がある場合
  if (
    process.env.NEON_PGHOST &&
    process.env.NEON_PGUSER &&
    process.env.NEON_PGPASSWORD &&
    process.env.NEON_PGDATABASE
  ) {
    return `postgres://${process.env.NEON_PGUSER}:${process.env.NEON_PGPASSWORD}@${process.env.NEON_PGHOST}/${process.env.NEON_PGDATABASE}`
  }

  return null
}

// データベースURLの取得
const DATABASE_URL = getDatabaseUrl()

// Neon設定
neonConfig.fetchConnectionCache = true

// SQLクライアントの初期化
let sqlClient: ReturnType<typeof neon> | null = null

/**
 * SQLクライアントを取得する関数
 * @returns SQLクライアント
 */
function getSqlClient() {
  if (!sqlClient && DATABASE_URL) {
    sqlClient = neon(DATABASE_URL)
  }
  return sqlClient
}

/**
 * SQLクエリを実行する関数
 * @param query SQLクエリ
 * @param params クエリパラメータ
 * @returns クエリ結果
 */
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // データベースURLが設定されているか確認
    if (!DATABASE_URL) {
      console.error("Database URL is not set")
      return {
        success: false,
        error: "Database URL is not set. Please check your environment variables.",
        data: null,
      }
    }

    console.log(`Executing query: ${query.substring(0, 100)}...`)

    // SQLクライアントの取得
    const sql = getSqlClient()

    if (!sql) {
      return {
        success: false,
        error: "Failed to initialize SQL client",
        data: null,
      }
    }

    // クエリの実行 - 修正: sql.query メソッドを使用
    const result = await sql.query(query, params)

    return {
      success: true,
      data: result,
      error: null,
    }
  } catch (error) {
    // エラーログの記録
    await logServerError(error, { query, params })

    console.error("Error executing query:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
      data: null,
    }
  }
}

/**
 * データベース接続が初期化されているかどうかを確認する関数
 * @returns データベース接続が初期化されているかどうか
 */
export function isDatabaseInitialized() {
  return Boolean(DATABASE_URL)
}

export async function testNeonConnection() {
  try {
    if (!DATABASE_URL) {
      return {
        success: false,
        error: "Database URL is not set",
      }
    }

    const result = await executeQuery("SELECT 1 as test")

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      }
    }

    return {
      success: true,
      message: "Neon connection successful",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
