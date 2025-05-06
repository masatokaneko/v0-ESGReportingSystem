import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 保護されたルートのリスト
const PROTECTED_ROUTES = ["/dashboard", "/data-entry", "/admin", "/reports", "/approval", "/profile"]

// 管理者専用ルート
const ADMIN_ROUTES = ["/admin"]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const path = request.nextUrl.pathname

  // モック認証のためのクッキーチェック
  const authCookie = request.cookies.get("mock-auth-session")
  const isAuthenticated = !!authCookie?.value

  // ユーザーロールの取得（モック）
  const roleCookie = request.cookies.get("mock-user-role")
  const userRole = roleCookie?.value || "user"

  // ログインページへのリダイレクトが必要かチェック
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => path.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some((route) => path.startsWith(route))

  // ユーザーがログインしていない場合、保護されたルートへのアクセスを拒否
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(redirectUrl)
  }

  // 管理者ルートへのアクセス制御（ユーザーロールのチェック）
  if (isAdminRoute && isAuthenticated && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
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
