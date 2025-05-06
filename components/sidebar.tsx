"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  CheckSquare,
  FileOutput,
  Search,
  Upload,
  Link2,
  Settings,
  AlertCircle,
  Bug,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "ダッシュボード",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "データ登録",
    href: "/data-entry",
    icon: FileText,
  },
  {
    title: "データ承認",
    href: "/data-approval",
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
    href: "/csv-upload",
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
    href: "/error-logs",
    icon: AlertCircle,
  },
  {
    title: "エラーテスト",
    href: "/error-test",
    icon: Bug,
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 min-h-screen w-64 bg-slate-900", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/dashboard">
            <h2 className="mb-6 px-2 text-xl font-semibold tracking-tight text-white">ESGレポート</h2>
          </Link>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-white hover:bg-slate-800 hover:text-white",
                  pathname === item.href && "bg-slate-800",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
