"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileInput,
  FileCheck,
  FileOutput,
  Search,
  Upload,
  Link2,
  Settings,
  AlertCircle,
  Bug,
  User,
  LogOut,
  BarChart2,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="text-2xl font-bold">
          ESGレポート
        </Link>
      </div>
      <nav className="flex flex-col space-y-1 px-3 py-4">
        <Link
          href="/dashboard"
          className={`flex items-center rounded-md px-3 py-2 ${
            isActive("/dashboard") ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <BarChart2 className="mr-2 h-5 w-5" />
          <span>ダッシュボード</span>
        </Link>
        <Link
          href="/data-entry"
          className={`flex items-center rounded-md px-3 py-2 ${
            isActive("/data-entry") ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <FileInput className="mr-2 h-5 w-5" />
          <span>データ登録</span>
        </Link>
        <Link
          href="/approval"
          className={`flex items-center rounded-md px-3 py-2 ${
            isActive("/approval") ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <FileCheck className="mr-2 h-5 w-5" />
          <span>データ承認</span>
        </Link>
        <Link
          href="/reports"
          className={`flex items-center rounded-md px-3 py-2 ${
            isActive("/reports") ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <FileOutput className="mr-2 h-5 w-5" />
          <span>レポート出力</span>
        </Link>
        <Link
          href="/data-search"
          className={`flex items-center rounded-md px-3 py-2 ${
            isActive("/data-search") ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <Search className="mr-2 h-5 w-5" />
          <span>データ参照/検索</span>
        </Link>
        <Link
          href="/csv-upload"
          className={`flex items-center rounded-md px-3 py-2 ${
            isActive("/csv-upload") ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <Upload className="mr-2 h-5 w-5" />
          <span>CSVアップロード</span>
        </Link>
        <Link
          href="/connectors"
          className={`flex items-center rounded-md px-3 py-2 ${
            isActive("/connectors") ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <Link2 className="mr-2 h-5 w-5" />
          <span>コネクタ設定</span>
        </Link>
        <Link
          href="/settings"
          className={`flex items-center rounded-md px-3 py-2 ${
            isActive("/settings") ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <Settings className="mr-2 h-5 w-5" />
          <span>設定</span>
        </Link>
        <Link
          href="/error-logs"
          className={`flex items-center rounded-md px-3 py-2 ${
            isActive("/error-logs") ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>エラーログ管理</span>
        </Link>
        <Link
          href="/error-test"
          className={`flex items-center rounded-md px-3 py-2 ${
            isActive("/error-test") ? "bg-slate-800" : "hover:bg-slate-800"
          }`}
        >
          <Bug className="mr-2 h-5 w-5" />
          <span>エラーテスト</span>
        </Link>

        <div className="mt-6 border-t border-slate-700 pt-4">
          <Link
            href="/admin"
            className={`flex items-center rounded-md px-3 py-2 ${
              isActive("/admin") ? "bg-slate-800" : "hover:bg-slate-800"
            }`}
          >
            <User className="mr-2 h-5 w-5" />
            <span>管理者</span>
          </Link>
          <Link
            href="/error-logs"
            className={`flex items-center rounded-md px-3 py-2 ${
              isActive("/error-logs") ? "bg-slate-800" : "hover:bg-slate-800"
            }`}
          >
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>エラーログ</span>
          </Link>
          <Link
            href="/error-test"
            className={`flex items-center rounded-md px-3 py-2 ${
              isActive("/error-test") ? "bg-slate-800" : "hover:bg-slate-800"
            }`}
          >
            <Bug className="mr-2 h-5 w-5" />
            <span>エラーテスト</span>
          </Link>
          <Link
            href="/system-status"
            className={`flex items-center rounded-md px-3 py-2 ${
              isActive("/system-status") ? "bg-slate-800" : "hover:bg-slate-800"
            }`}
          >
            <Settings className="mr-2 h-5 w-5" />
            <span>システムステータス</span>
          </Link>
        </div>

        <div className="mt-6 border-t border-slate-700 pt-4">
          <Link href="/auth/logout" className="flex items-center rounded-md px-3 py-2 hover:bg-slate-800">
            <LogOut className="mr-2 h-5 w-5" />
            <span>ログアウト</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
