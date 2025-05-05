import { NextResponse } from "next/server"

export async function GET() {
  // 本番環境では無効化することを推奨
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "This endpoint is disabled in production" }, { status: 403 })
  }

  // 環境変数の存在チェック（値自体は表示しない）
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    // 他の重要な環境変数も追加可能
  }

  // 環境変数のプレフィックスチェック
  const urlPrefix = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("https://")
  const anonKeyPrefix = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith("eyJ")
  const serviceKeyPrefix = process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith("eyJ")

  return NextResponse.json({
    envStatus,
    formatCheck: {
      NEXT_PUBLIC_SUPABASE_URL: urlPrefix,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKeyPrefix,
      SUPABASE_SERVICE_ROLE_KEY: serviceKeyPrefix,
    },
    nodeEnv: process.env.NODE_ENV,
  })
}
