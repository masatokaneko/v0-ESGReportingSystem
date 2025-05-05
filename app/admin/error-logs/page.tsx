import { getSupabaseServer, isSupabaseServerInitialized } from "@/lib/supabase"
import { ErrorLogTable } from "@/components/admin/error-log-table"
import { ErrorLogFilters } from "@/components/admin/error-log-filters"
import type { ErrorSeverity, ErrorStatus } from "@/lib/error-logger"

export const dynamic = "force-dynamic"

interface SearchParams {
  error_type?: string
  severity?: ErrorSeverity
  status?: ErrorStatus
  component?: string
  route?: string
  from_date?: string
  to_date?: string
}

export default async function ErrorLogsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Supabaseクライアントが初期化されているかチェック
  if (!isSupabaseServerInitialized()) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">エラーログ管理</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Supabaseクライアントが初期化されていません。環境変数を確認してください。
        </div>
      </div>
    )
  }

  try {
    const supabaseServer = getSupabaseServer()
    let query = supabaseServer.from("error_logs").select("*")

    // フィルター条件を適用
    if (searchParams.error_type) {
      query = query.ilike("error_type", `%${searchParams.error_type}%`)
    }

    if (searchParams.severity) {
      query = query.eq("severity", searchParams.severity)
    }

    if (searchParams.status) {
      query = query.eq("status", searchParams.status)
    }

    if (searchParams.component) {
      query = query.ilike("component", `%${searchParams.component}%`)
    }

    if (searchParams.route) {
      query = query.ilike("route", `%${searchParams.route}%`)
    }

    if (searchParams.from_date) {
      query = query.gte("created_at", `${searchParams.from_date}T00:00:00`)
    }

    if (searchParams.to_date) {
      query = query.lte("created_at", `${searchParams.to_date}T23:59:59`)
    }

    // 並び替えと制限
    const { data: errorLogs, error } = await query.order("created_at", { ascending: false }).limit(100)

    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">エラーログ管理</h1>

        <ErrorLogFilters />

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            エラーログの取得中にエラーが発生しました: {error.message}
          </div>
        ) : (
          <ErrorLogTable errorLogs={errorLogs || []} />
        )}
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">エラーログ管理</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          エラーログの取得中にエラーが発生しました: {(error as Error).message}
        </div>
      </div>
    )
  }
}
