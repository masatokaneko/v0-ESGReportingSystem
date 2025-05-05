import { executeQuery } from "@/lib/neon"

/**
 * データベース接続をテストする関数
 * @returns 接続が成功したかどうかと、エラーメッセージ
 */
export async function testDatabaseConnection() {
  try {
    // 単純なクエリを実行してデータベース接続をテスト
    const result = await executeQuery("SELECT 1 as test")

    if (!result.success) {
      return {
        connected: false,
        error: result.error || "Unknown database error",
      }
    }

    return {
      connected: true,
      error: null,
    }
  } catch (error) {
    console.error("Database connection test failed:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

/**
 * テーブルが存在するかどうかを確認する関数
 * @param tableName テーブル名
 * @returns テーブルが存在するかどうかと、エラーメッセージ
 */
export async function checkTableExists(tableName: string) {
  try {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      ) as exists
    `

    const result = await executeQuery(query, [tableName])

    if (!result.success) {
      return {
        exists: false,
        error: result.error || `Failed to check if table ${tableName} exists`,
      }
    }

    // データ構造を確認
    const exists = result.data?.[0]?.exists

    return {
      exists: typeof exists === "boolean" ? exists : Boolean(exists),
      error: null,
    }
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error)
    return {
      exists: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
