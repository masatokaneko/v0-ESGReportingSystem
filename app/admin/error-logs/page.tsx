import { supabaseServer } from "@/lib/supabase"
import { ErrorLogTable } from "@/components/admin/error-log-table"
import { ErrorLogFilters } from "@/components/admin/error-log-filters"

export const dynamic = "force-dynamic"

export default async function ErrorLogsPage() {
  const { data: errorLogs, error } = await supabaseServer
    .from("error_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

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
}
