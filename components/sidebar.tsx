"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  Home,
  LayoutDashboard,
  LineChart,
  Settings,
  ShieldAlert,
  Building2,
  Factory,
  Leaf,
  Cloud,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "ホーム",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "ダッシュボード",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "データ入力",
    href: "/data-entry",
    icon: FileText,
  },
  {
    title: "分析",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "レポート",
    href: "/reports",
    icon: LineChart,
  },
  {
    title: "マスタ管理",
    icon: Building2,
    items: [
      {
        title: "組織",
        href: "/master/organizations",
        icon: Building2,
      },
      {
        title: "施設",
        href: "/master/facilities",
        icon: Factory,
      },
      {
        title: "排出係数",
        href: "/admin/emission-factors",
        icon: Leaf,
      },
    ],
  },
  {
    title: "設定",
    icon: Settings,
    items: [
      {
        title: "システム設定",
        href: "/settings/system",
        icon: Settings,
      },
      {
        title: "コネクタ設定",
        href: "/settings/connectors",
        icon: Cloud,
      },
      {
        title: "ユーザー管理",
        href: "/settings/users",
        icon: Users,
      },
      {
        title: "セキュリティ",
        href: "/settings/security",
        icon: ShieldAlert,
      },
    ],
  },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/dashboard">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              ESGレポーティング
              <br />
              システム
            </h2>
          </Link>
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              if (item.items) {
                return (
                  <div key={item.title} className="space-y-1">
                    <h3 className="px-2 py-1.5 text-sm font-semibold tracking-tight text-muted-foreground">
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </div>
                    </h3>
                    {item.items.map((subItem) => (
                      <Button
                        key={subItem.href}
                        variant={pathname === subItem.href ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start pl-8"
                        asChild
                      >
                        <Link href={subItem.href}>
                          <subItem.icon className="mr-2 h-4 w-4" />
                          {subItem.title}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )
              }

              return (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
