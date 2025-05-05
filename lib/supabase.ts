import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// 環境変数が設定されているかどうかを確認する変数
let isInitialized = false

// サーバーサイドのSupabaseクライアント（サービスロールキーを使用）
let supabaseServerInstance: ReturnType<typeof createClient<Database>> | null = null

// サーバーサイドのSupabaseクライアントを取得する関数
export function getSupabaseServer() {
  if (!supabaseServerInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase URL or Service Role Key is missing. Please check your environment variables.")
    }

    supabaseServerInstance = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
    isInitialized = true
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
    const client = getSupabaseServer()
    // @ts-ignore
    return client[prop]
  },
})

// クライアントサイドのSupabaseクライアント（匿名キーを使用）
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anonymous Key is missing. Please check your environment variables.")
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
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        success: false,
        error: "Supabase client not initialized",
        details: {
          url: !!supabaseUrl,
          anonKey: !!supabaseAnonKey,
          serviceRoleKey: !!supabaseServiceKey,
        },
      }
    }

    const client = getSupabaseServer()

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
