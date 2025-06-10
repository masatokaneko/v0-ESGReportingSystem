import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

if (supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key') {
  console.warn('Please set Supabase environment variables for production use')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// サーバーサイド用のクライアント（Service Role Key使用）
export const createServerSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'
  
  if (supabaseServiceKey === 'your-service-role-key') {
    console.warn('Please set SUPABASE_SERVICE_ROLE_KEY environment variable for production use')
    // 開発時はanon keyを使用（制限あり）
    return createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}