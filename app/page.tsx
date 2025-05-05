"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmissionsOverview } from "@/components/dashboard/emissions-overview"
import { EmissionsBySource } from "@/components/dashboard/emissions-by-source"
import { EmissionsTrend } from "@/components/dashboard/emissions-trend"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface DashboardSummary {
  totalEmission: number
  scopeData: {
    scope1: number
    scope2: 0
    scope3: number
  }
  emissionsBySource: Array<{ name: string; value: number }>
  emissionsTrend: Array<{ month: string; emissions: number }>
  recentActivities: Array<{
    id: string
    action: string
    user: string
    timestamp: string
    details: string
    status: string
  }>
}

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [isDbInitialized, setIsDbInitialized] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setErrorDetails(null)

      console.log("Fetching dashboard data...")
      const response = await fetch("/api/dashboard/summary")

      // レスポンスのステータスコードをチェック
      if (!response.ok) {
        let errorMessage = `API error: ${response.status} ${response.statusText}`
        let errorDetailsMessage = null

        try {
          // レスポンスをテキストとして読み取る
          const errorText = await response.text()
          console.error("API error response:", errorText)

          try {
            // JSONとしてパースを試みる
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.error || "Failed to fetch dashboard data"
            errorDetailsMessage = errorData.message || errorText
          } catch (parseError) {
            // JSONパースに失敗した場合はテキストをそのまま使用
            errorDetailsMessage = errorText.substring(0, 500)
          }
        } catch (textError) {
          // テキスト読み取りに失敗した場合
          errorDetailsMessage = "Could not read error response"
        }

        throw new Error(errorMessage, { cause: errorDetailsMessage })
      }

      const dashboardData = await response.json()

      // エラーフィールドをチェック
      if (dashboardData.error) {
        throw new Error(dashboardData.error, { cause: dashboardData.message })
      }

      setSummary(dashboardData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)

      // エラーメッセージの設定
      if (error instanceof Error) {
        setError(error.message)
        setErrorDetails((error.cause as string) || null)
      } else {
        setError("Unknown error")
        setErrorDetails(null)
      }

      toast({
        title: "エラー",
        description: "ダッシュボードデータの取得に失敗しました。",
        variant: "destructive",
      })

      // エラー時にもデフォルトデータを設定
      setSummary({
        totalEmission: 0,
        scopeData: {
          scope1: 0,
          scope2: 0,
          scope3: 0,
        },
        emissionsBySource: [],
        emissionsTrend: [],
        recentActivities: [],
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
        <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          更新
        </Button>
      </div>

      {!isDbInitialized && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                データベース接続が初期化されていません。環境変数を設定してください。
                <a
                  href="/admin/system-status"
                  className="font-medium text-yellow-700 underline hover:text-yellow-600 ml-1"
                >
                  システムステータスを確認
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">データ取得エラー: {error}</p>
              {errorDetails && <p className="mt-1 text-sm text-red-700 whitespace-pre-wrap">詳細: {errorDetails}</p>}
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDashboardData}
                  className="text-red-700 hover:text-red-800 border-red-300 hover:bg-red-50"
                >
                  再試行
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
          <TabsTrigger value="reports">レポート</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総GHG排出量</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {summary && summary.totalEmission ? (summary.totalEmission / 1000).toFixed(2) : "0"} t-CO2
                    </div>
                    <p className="text-xs text-muted-foreground">前年比 +2.5%</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scope 1排出量</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {summary && summary.scopeData && summary.scopeData.scope1
                        ? (summary.scopeData.scope1 / 1000).toFixed(2)
                        : "0"}{" "}
                      t-CO2
                    </div>
                    <p className="text-xs text-muted-foreground">前年比 -1.2%</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scope 2排出量</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {summary && summary.scopeData && summary.scopeData.scope2
                        ? (summary.scopeData.scope2 / 1000).toFixed(2)
                        : "0"}{" "}
                      t-CO2
                    </div>
                    <p className="text-xs text-muted-foreground">前年比 +4.3%</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">再エネ比率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23.5%</div>
                <p className="text-xs text-muted-foreground">前年比 +5.2%</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>排出量推移</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <EmissionsTrend data={summary?.emissionsTrend || []} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>排出源内訳</CardTitle>
              </CardHeader>
              <CardContent>
                <EmissionsBySource data={summary?.emissionsBySource || []} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>排出量概要</CardTitle>
                <CardDescription>Scope別・カテゴリ別の排出量</CardDescription>
              </CardHeader>
              <CardContent>
                <EmissionsOverview data={summary?.scopeData || { scope1: 0, scope2: 0, scope3: 0 }} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>最近の活動</CardTitle>
                <CardDescription>直近のデータ登録・承認状況</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity data={summary?.recentActivities || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
