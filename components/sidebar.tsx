"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  FileInput,
  CheckSquare,
  FileOutput,
  Search,
  Settings,
  LogOut,
  Upload,
  Link2,
  AlertCircle,
  Bug,
  ShieldAlert,
} from "lucide-react"

const navItems = [
  {
    title: "ダッシュボード",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "データ登録",
    href: "/data-entry",
    icon: FileInput,
  },
  {
    title: "データ承認",
    href: "/approval",
    icon: CheckSquare,
  },
  {
    title: "レポート出力",
    href: "/reports",
    icon: FileOutput,
  },
  {
    title: "データ参照/検索",
    href: "/data-search",
    icon: Search,
  },
  {
    title: "CSVアップロード",
    href: "/upload/csv",
    icon: Upload,
  },
  {
    title: "コネクタ設定",
    href: "/settings/connectors",
    icon: Link2,
  },
  {
    title: "設定",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "エラーログ管理",
    href: "/admin/error-logs",
    icon: AlertCircle,
  },
  {
    title: "エラーテスト",
    href: "/admin/error-test",
    icon: Bug,
  },
  {
    title: "管理者",
    icon: ShieldAlert,
    items: [
      {
        title: "エラーログ",
        href: "/admin/error-logs",
      },
      {
        title: "エラーテスト",
        href: "/admin/error-test",
      },
      {
        title: "システムステータス",
        href: "/admin/system-status",
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-muted/40 lg:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b bg-primary px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="text-xl">ESGレポート</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {navItems.map((item, index) => {
              if (item.items) {
                return (
                  <div key={index}>
                    <div className="mb-2 mt-4 px-3 text-sm font-bold uppercase text-muted-foreground">{item.title}</div>
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                          pathname === subItem.href ? "bg-muted text-primary" : "text-muted-foreground",
                        )}
                      >
                        <span>{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                )
              }
              const Icon = item.icon
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <LogOut className="h-4 w-4" />
            <span>ログアウト</span>
          </button>
        </div>
      </div>
    </div>
  )
}
