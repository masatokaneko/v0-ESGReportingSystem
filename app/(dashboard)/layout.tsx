"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart3, FileText, Settings, Users, LogOut, Menu, X, User, CheckSquare, Home, Upload } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase/supabase"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, signOut } = useAuth()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // ユーザーロールの取得
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return

      try {
        const supabase = createClientSupabaseClient()
        const { data, error } = await supabase.from("user_profiles").select("role").eq("user_id", user.id).single()

        if (error) throw error
        setUserRole(data.role)
      } catch (error) {
        console.error("Error fetching user role:", error)
      }
    }

    fetchUserRole()
  }, [user])

  // 認証状態のチェック
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  // ログアウト処理
  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  // ナビゲーションアイテム
  const navItems = [
    {
      name: "ダッシュボード",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "データ登録",
      href: "/data-entry",
      icon: Upload,
    },
    {
      name: "承認管理",
      href: "/approval",
      icon: CheckSquare,
    },
    {
      name: "レポート",
      href: "/reports",
      icon: FileText,
    },
  ]

  // 管理者用ナビゲーションアイテム
  const adminNavItems = [
    {
      name: "ユーザー管理",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "拠点管理",
      href: "/admin/locations",
      icon: Settings,
    },
    {
      name: "部門管理",
      href: "/admin/departments",
      icon: Settings,
    },
    {
      name: "排出係数管理",
      href: "/admin/emission-factors",
      icon: BarChart3,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">メニュー</span>
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold">ESGレポーティングシステム</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">ユーザーメニュー</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">プロフィール設定</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ログアウト</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* サイドバー（モバイル） */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 left-0 z-40 w-64 animate-in slide-in-from-left bg-background p-6 shadow-lg">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}

                {userRole === "admin" && (
                  <>
                    <div className="my-2 border-t pt-2 text-xs font-semibold">管理者メニュー</div>
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                          pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
            </div>
          </div>
        )}

        {/* サイドバー（デスクトップ） */}
        <div className="hidden w-64 flex-shrink-0 border-r md:block">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}

            {userRole === "admin" && (
              <>
                <div className="my-2 border-t pt-2 text-xs font-semibold">管理者メニュー</div>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
