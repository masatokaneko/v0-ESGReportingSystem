import { Pool } from "pg"

// 環境変数からNeon接続情報を取得
// 複数の可能性のある環境変数名をチェック
const connectionString = process.env.NEON_NEON_DATABASE_URL || process.env.NEON_POSTGRES_URL || process.env.DATABASE_URL

// 接続プールの作成
let pool: Pool | null = null

export function getNeonPool() {
  if (!pool) {
    if (!connectionString) {
      throw new Error("Neon database connection string not found in environment variables")
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // 本番環境では適切に設定してください
      },
    })

    // 接続テスト
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err)
      process.exit(-1)
    })
  }

  return pool
}

// 接続テスト用の関数
export async function testNeonConnection() {
  try {
    const pool = getNeonPool()
    const client = await pool.connect()

    try {
      const result = await client.query("SELECT NOW()")
      return {
        success: true,
        timestamp: result.rows[0].now,
        message: "Successfully connected to Neon database",
        connectionString: connectionString ? `${connectionString.substring(0, 10)}...` : "Not found",
        availableEnvVars: Object.keys(process.env).filter(
          (key) => key.includes("NEON") || key.includes("DATABASE") || key.includes("POSTGRES"),
        ),
      }
    } finally {
      client.release()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      connectionString: connectionString ? `${connectionString.substring(0, 10)}...` : "Not found",
      availableEnvVars: Object.keys(process.env).filter(
        (key) => key.includes("NEON") || key.includes("DATABASE") || key.includes("POSTGRES"),
      ),
    }
  }
}

// クエリ実行用のヘルパー関数
export async function executeQuery<T = any>(
  query: string,
  params: any[] = [],
): Promise<{
  success: boolean
  data?: T[]
  error?: string
  rowCount?: number
}> {
  const pool = getNeonPool()
  try {
    const result = await pool.query(query, params)
    return {
      success: true,
      data: result.rows,
      rowCount: result.rowCount,
    }
  } catch (error) {
    console.error("Query execution error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
