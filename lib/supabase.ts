import { createClient } from "@supabase/supabase-js"

// サーバーサイド用のSupabaseクライアント
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseKey)
}

// クライアントサイド用のSupabaseクライアント（シングルトンパターン）
let clientSupabaseClient: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  clientSupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return clientSupabaseClient
}

// 認証状態を取得するヘルパー関数
export const getSession = async () => {
  const supabase = createClientSupabaseClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error("Error getting session:", error.message)
    return null
  }

  return session
}

// ユーザー情報を取得するヘルパー関数
export const getUserProfile = async (userId: string) => {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error.message)
    return null
  }

  return data
}

// ユーザーロールを取得するヘルパー関数
export const getUserRole = async (userId: string) => {
  const profile = await getUserProfile(userId)
  return profile?.role || "user"
}
