import { createClient } from "@supabase/supabase-js"

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 環境変数のチェック（警告のみ、エラーは投げない）
if (!supabaseUrl) {
  console.warn("Warning: Missing environment variable NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
  console.warn("Warning: Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

if (!supabaseServiceRoleKey) {
  console.warn("Warning: Missing environment variable SUPABASE_SERVICE_ROLE_KEY")
}

// サーバーサイドで使用するクライアント
let supabaseServer: ReturnType<typeof createClient> | null = null

// サーバーサイドクライアントの初期化を試みる（環境変数がある場合のみ）
if (supabaseUrl && supabaseServiceRoleKey) {
  try {
    supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey)
  } catch (error) {
    console.error("Error initializing Supabase server client:", error)
  }
}

// クライアントサイドで使用するクライアント
let supabaseClientInstance: ReturnType<typeof createClient> | null = null

export const createSupabaseClient = () => {
  if (typeof window === "undefined") {
    throw new Error("createSupabaseClient should only be called in client components")
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key are required. Check your environment variables.")
  }

  // クライアントインスタンスをシングルトンとして管理
  if (!supabaseClientInstance) {
    try {
      supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      throw new Error(`Failed to initialize Supabase client: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return supabaseClientInstance
}

// サーバーサイドクライアントが初期化されているかチェックするヘルパー関数
export const isSupabaseServerInitialized = () => {
  return !!supabaseServer
}

// サーバーサイドクライアントを安全に取得するヘルパー関数
export const getSupabaseServer = () => {
  if (!supabaseServer) {
    // エラーメッセージを改善
    const missingVars = []
    if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL")
    if (!supabaseServiceRoleKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY")

    const errorMessage =
      missingVars.length > 0
        ? `Supabase server client is not initialized. Missing environment variables: ${missingVars.join(", ")}`
        : "Supabase server client initialization failed. Check the console for more details."

    throw new Error(errorMessage)
  }
  return supabaseServer
}

// サーバーサイドクライアントのエクスポート
export { supabaseServer }
