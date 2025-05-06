"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorLog {
  id: number
  error_type: string
  message: string
  stack_trace: string | null
  component: string | null
  route: string | null
  severity: string
  status: string
  created_at: string
}

export default function ErrorLogsPage() {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchErrorLogs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/error-logs")

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch error logs")
      }

      setErrorLogs(data.data || [])
    } catch (error) {
      console.error("Error fetching error logs:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      toast({
        title: "エラー",
        description: "エラーログの取得に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchErrorLogs()
  }, [])

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // 重要度に応じたバッジの色を返す関数
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "error":
        return "bg-orange-100 text-orange-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // ステータスに応じたバッジの色を返す関数
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "ignored":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">エラーログ</h2>
        <Button variant="outline" size="sm" onClick={fetchErrorLogs} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          更新
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">エラーログの取得に失敗しました: {error}</p>
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchErrorLogs}
                  className="text-red-700 hover:text-red-800 border-red-300 hover:bg-red-50"
                >
                  再試行
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>エラーログ一覧</CardTitle>
          <CardDescription>システムで発生したエラーの記録</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : errorLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">エラーログはありません</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>メッセージ</TableHead>
                    <TableHead>コンポーネント</TableHead>
                    <TableHead>重要度</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>発生日時</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errorLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.error_type}</TableCell>
                      <TableCell className="max-w-xs truncate">{log.message}</TableCell>
                      <TableCell>{log.component || log.route || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(log.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
