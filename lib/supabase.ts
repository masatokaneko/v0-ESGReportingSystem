import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// 環境変数が設定されているかどうかを確認する変数
let isInitialized = false

// サーバーサイドのSupabaseクライアント（サービスロールキーを使用）
let supabaseServerInstance: ReturnType<typeof createClient<Database>> | null = null

// サーバーサイドのSupabaseクライアントを取得する関数
export function getSupabaseServer() {
  if (!supabaseServerInstance) {
    // Supabase URLの取得（環境変数から）
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    // サービスロールキーの取得（環境変数またはフォールバック値）
    // 注意: このフォールバック値は一時的な対処法です。本番環境では環境変数を適切に設定してください。
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYWJzamVwamdxZHVrYW13YnJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjQ0MDc0MiwiZXhwIjoyMDYyMDE2NzQyfQ.LrJ33h4fIToQCJLK3aGvjo-UeJxqtIXIYRqxqRs2nKY"

    if (!supabaseUrl) {
      throw new Error("Supabase URL is missing. Please check your environment variables.")
    }

    try {
      supabaseServerInstance = createClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
      isInitialized = true
      console.log("Supabase server client initialized successfully")
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      throw new Error(`Failed to initialize Supabase client: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  return supabaseServerInstance
}

// サーバーサイドのSupabaseクライアントが初期化されているかどうかを確認する関数
export function isSupabaseServerInitialized() {
  return isInitialized
}

// 遅延初期化のためのラッパー関数
export const supabaseServer = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get: (target, prop) => {
    try {
      const client = getSupabaseServer()
      // @ts-ignore
      return client[prop]
    } catch (error) {
      console.error(`Error accessing Supabase client property ${String(prop)}:`, error)
      throw error
    }
  },
})

// クライアントサイドのSupabaseクライアント（匿名キーを使用）
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const missingVars = []
    if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL")
    if (!supabaseAnonKey) missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    throw new Error(`Supabase client initialization failed. Missing environment variables: ${missingVars.join(", ")}`)
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// クライアントサイドでのシングルトンインスタンス
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

// クライアントサイドのSupabaseクライアントを取得する関数（シングルトンパターン）
export function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseClient should only be called on the client side")
  }

  if (!clientInstance) {
    clientInstance = createSupabaseClient()
  }

  return clientInstance
}

// 接続テスト用の関数 - 集計関数を使用しないように修正
export async function testSupabaseConnection() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYWJzamVwamdxZHVrYW13YnJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjQ0MDc0MiwiZXhwIjoyMDYyMDE2NzQyfQ.LrJ33h4fIToQCJLK3aGvjo-UeJxqtIXIYRqxqRs2nKY"
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      return {
        success: false,
        error: "Supabase URL is missing",
        details: {
          url: !!supabaseUrl,
          anonKey: !!supabaseAnonKey,
          serviceRoleKey: !!supabaseServiceKey,
        },
      }
    }

    let client
    try {
      client = getSupabaseServer()
    } catch (error) {
      return {
        success: false,
        error: "Failed to initialize Supabase client",
        message: error instanceof Error ? error.message : String(error),
      }
    }

    // 集計関数を使用せずに単純なクエリを実行
    const { data, error } = await client.from("data_entries").select("id").limit(1)

    if (error) {
      return {
        success: false,
        error: error.message,
        details: {
          code: error.code,
          hint: error.hint,
          details: error.details,
        },
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }
  }
}
