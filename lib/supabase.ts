import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your environment configuration.')
  // ビルド時はエラーを投げない
  if (typeof window !== 'undefined') {
    throw new Error('Missing Supabase environment variables.')
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// サーバーサイド用のクライアント（Service Role Key使用）
export const createServerSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Using anon key with limited permissions.')
    // Service Keyが設定されていない場合はanon keyを使用（制限あり）
    return createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}