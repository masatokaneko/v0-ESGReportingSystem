import { createClient } from "@supabase/supabase-js"

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// サーバーサイドで使用するクライアント
export const supabaseServer = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || "")

// クライアントサイドで使用するクライアント
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}
