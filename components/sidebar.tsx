"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  ClipboardList,
  FileInput,
  FileSpreadsheet,
  Home,
  Settings,
  ShieldCheck,
  AlertTriangle,
  Database,
  FileCode,
} from "lucide-react"

const navItems = [
  {
    title: "ダッシュボード",
    href: "/",
    icon: Home,
  },
  {
    title: "データ入力",
    href: "/data-entry",
    icon: FileInput,
  },
  {
    title: "データ検索",
    href: "/data-search",
    icon: FileSpreadsheet,
  },
  {
    title: "承認管理",
    href: "/approval",
    icon: ShieldCheck,
  },
  {
    title: "レポート",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "設定",
    href: "/settings",
    icon: Settings,
    submenu: [
      {
        title: "コネクタ",
        href: "/settings/connectors",
      },
    ],
  },
  {
    title: "管理者",
    href: "/admin",
    icon: ShieldCheck,
    submenu: [
      {
        title: "エラーログ",
        href: "/admin/error-logs",
        icon: AlertTriangle,
      },
      {
        title: "エラー分析",
        href: "/admin/error-analytics",
        icon: BarChart3,
      },
      {
        title: "システムステータス",
        href: "/admin/system-status",
        icon: Database,
      },
      {
        title: "API診断",
        href: "/admin/api-diagnostics",
        icon: FileCode,
      },
      {
        title: "RLSポリシー",
        href: "/admin/rls-policies",
        icon: ShieldCheck,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64 border-r">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">ESGレポーティングシステム</h2>
        </div>
        <div className="px-3">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            const hasSubmenu = item.submenu && item.submenu.length > 0

            return (
              <div key={index} className="mb-2">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>

                {hasSubmenu && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu?.map((subitem, subindex) => {
                      const isSubActive = pathname === subitem.href
                      const Icon = subitem.icon || ClipboardList

                      return (
                        <Link
                          key={subindex}
                          href={subitem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                            isSubActive
                              ? "bg-muted text-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <Icon className="h-3 w-3" />
                          {subitem.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
