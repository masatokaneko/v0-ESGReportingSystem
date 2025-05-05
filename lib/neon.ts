import { Pool } from "pg"

// 環境変数からNeon接続情報を取得
// 推奨される接続文字列を優先的に使用
const connectionString = process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL

// 接続プールの作成
let pool: Pool | null = null

export function getNeonPool() {
  if (!pool) {
    if (!connectionString) {
      throw new Error("Database connection string not found in environment variables")
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: true, // 本番環境では安全な接続を使用
      },
      // コネクションプールの設定
      max: 20, // 最大接続数
      idleTimeoutMillis: 30000, // アイドル接続のタイムアウト
      connectionTimeoutMillis: 5000, // 接続タイムアウト
    })

    // 接続エラーハンドリング
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err)
      // 致命的なエラーの場合のみプロセスを終了
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.error("Database connection was closed. Attempting to reconnect...")
        pool = null // 再接続のために接続をリセット
      }
    })
  }

  return pool
}

// 非プール接続用の関数（必要な場合）
export function getNeonUnpooledPool() {
  const unpooledConnectionString = process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL_NON_POOLING

  if (!unpooledConnectionString) {
    throw new Error("Unpooled database connection string not found in environment variables")
  }

  return new Pool({
    connectionString: unpooledConnectionString,
    ssl: {
      rejectUnauthorized: true,
    },
    max: 1, // 非プール接続は1つの接続のみ
  })
}

// 接続テスト用の関数
export async function testNeonConnection() {
  try {
    const pool = getNeonPool()
    const client = await pool.connect()

    try {
      const result = await client.query(
        "SELECT NOW() as current_time, current_database() as database_name, version() as pg_version",
      )

      // 環境変数情報（機密情報を除く）
      const envInfo = {
        database_url: process.env.DATABASE_URL ? "設定済み" : "未設定",
        postgres_url: process.env.POSTGRES_URL ? "設定済み" : "未設定",
        database_url_unpooled: process.env.DATABASE_URL_UNPOOLED ? "設定済み" : "未設定",
        postgres_url_non_pooling: process.env.POSTGRES_URL_NON_POOLING ? "設定済み" : "未設定",
        pg_host: process.env.PGHOST ? "設定済み" : "未設定",
        pg_database: process.env.PGDATABASE ? "設定済み" : "未設定",
        pg_user: process.env.PGUSER ? "設定済み" : "未設定",
      }

      return {
        success: true,
        database: result.rows[0].database_name,
        currentTime: result.rows[0].current_time,
        pgVersion: result.rows[0].pg_version,
        message: "Successfully connected to Neon database",
        environmentVariables: envInfo,
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Neon connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      environmentVariables: {
        database_url: process.env.DATABASE_URL ? "設定済み" : "未設定",
        postgres_url: process.env.POSTGRES_URL ? "設定済み" : "未設定",
        database_url_unpooled: process.env.DATABASE_URL_UNPOOLED ? "設定済み" : "未設定",
        postgres_url_non_pooling: process.env.POSTGRES_URL_NON_POOLING ? "設定済み" : "未設定",
      },
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

// トランザクション実行用のヘルパー関数
export async function executeTransaction<T = any>(
  callback: (client: any) => Promise<T>,
): Promise<{
  success: boolean
  data?: T
  error?: string
}> {
  const pool = getNeonPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Transaction error:", error)

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  } finally {
    client.release()
  }
}
