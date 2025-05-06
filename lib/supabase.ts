import { createMockSupabaseClient } from "./supabase/mock"

// サーバーサイド用のSupabaseクライアント
export const createServerSupabaseClient = () => {
  // 環境変数がある場合は実際のSupabaseクライアントを使用
  // 環境変数がない場合はモッククライアントを使用
  return createMockSupabaseClient()
}

// クライアントサイド用のSupabaseクライアント（シングルトンパターン）
let clientSupabaseClient: ReturnType<typeof createMockSupabaseClient> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  // 環境変数がある場合は実際のSupabaseクライアントを使用
  // 環境変数がない場合はモッククライアントを使用
  clientSupabaseClient = createMockSupabaseClient()
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
