"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"

interface ErrorLog {
  id: number
  error_type: string
  message: string
  stack_trace: string | null
  component: string | null
  route: string | null
  user_id: string | null
  user_agent: string | null
  request_data: any
  context: any
  severity: string
  status: string
  created_at: string
  updated_at: string
}

export default function ErrorLogDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [errorLog, setErrorLog] = useState<ErrorLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchErrorLog = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/error-logs/${params.id}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch error log")
      }

      setErrorLog(data.data || null)
    } catch (error) {
      console.error("Error fetching error log:", error)
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
    fetchErrorLog()
  }, [params.id])

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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">エラーログ詳細</h2>
        </div>
        <Button variant="outline" size="sm" onClick={fetchErrorLog} disabled={isLoading}>
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
                  onClick={fetchErrorLog}
                  className="text-red-700 hover:text-red-800 border-red-300 hover:bg-red-50"
                >
                  再試行
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : errorLog ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>エラー情報</CardTitle>
              <CardDescription>エラーの基本情報</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p>{errorLog.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">エラータイプ</p>
                  <p>{errorLog.error_type}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">メッセージ</p>
                  <p className="break-words">{errorLog.message}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">重要度</p>
                  <Badge className={getSeverityColor(errorLog.severity)}>{errorLog.severity}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ステータス</p>
                  <Badge className={getStatusColor(errorLog.status)}>{errorLog.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>発生場所</CardTitle>
              <CardDescription>エラーが発生した場所の情報</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">コンポーネント</p>
                  <p>{errorLog.component || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ルート</p>
                  <p>{errorLog.route || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ユーザーID</p>
                  <p>{errorLog.user_id || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ユーザーエージェント</p>
                  <p className="break-words text-xs">{errorLog.user_agent || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>タイムスタンプ</CardTitle>
              <CardDescription>エラーの発生時刻と更新時刻</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">発生日時</p>
                  <p>{formatDate(errorLog.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">更新日時</p>
                  <p>{formatDate(errorLog.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>スタックトレース</CardTitle>
              <CardDescription>エラーのスタックトレース情報</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                {errorLog.stack_trace || "スタックトレースはありません"}
              </pre>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>コンテキスト情報</CardTitle>
              <CardDescription>エラー発生時のコンテキスト情報</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">リクエストデータ</p>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                    {errorLog.request_data
                      ? JSON.stringify(errorLog.request_data, null, 2)
                      : "リクエストデータはありません"}
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">コンテキスト</p>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                    {errorLog.context ? JSON.stringify(errorLog.context, null, 2) : "コンテキスト情報はありません"}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">エラーログが見つかりませんでした</div>
      )}
    </div>
  )
}
