import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// 保護されたルートのリスト
const PROTECTED_ROUTES = ["/dashboard", "/data-entry", "/admin", "/reports", "/approval", "/profile"]

// 管理者専用ルート
const ADMIN_ROUTES = ["/admin"]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // ログインページへのリダイレクトが必要かチェック
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => path.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some((route) => path.startsWith(route))

  // ユーザーがログインしていない場合、保護されたルートへのアクセスを拒否
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(redirectUrl)
  }

  // 管理者ルートへのアクセス制御（ユーザーロールのチェック）
  if (isAdminRoute && session) {
    // ユーザーロールの取得
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    // 管理者でない場合はダッシュボードにリダイレクト
    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    // 保護されたルート
    "/dashboard/:path*",
    "/data-entry/:path*",
    "/admin/:path*",
    "/reports/:path*",
    "/approval/:path*",
    "/profile/:path*",
    // 認証ページ
    "/auth/:path*",
  ],
}
