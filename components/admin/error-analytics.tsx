"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorAnalytics {
  summary: {
    totalErrors: number
    errorTypeCounts: Record<string, number>
    mostCommonErrorType: [string, number][]
    mostProblematicRoutes: [string, number][]
    mostProblematicComponents: [string, number][]
  }
  solutions: Record<string, string>
  recentErrors: any[]
}

export function ErrorAnalytics() {
  const [analytics, setAnalytics] = useState<ErrorAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/error-logs/analyze")

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラー分析の取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  // エラータイプのグラフデータを作成
  const errorTypeChartData =
    analytics?.summary.mostCommonErrorType.map(([name, value]) => ({
      name,
      value,
    })) || []

  // 問題のあるルートのグラフデータを作成
  const routeChartData =
    analytics?.summary.mostProblematicRoutes.map(([name, value]) => ({
      name: name || "不明",
      value,
    })) || []

  // 円グラフの色
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>エラー分析</span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            更新
          </Button>
        </CardTitle>
        <CardDescription>エラーログの分析と解決策の提案</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && <p>データを読み込み中...</p>}

        {analytics && (
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">概要</TabsTrigger>
              <TabsTrigger value="errorTypes">エラータイプ</TabsTrigger>
              <TabsTrigger value="routes">問題のあるルート</TabsTrigger>
              <TabsTrigger value="solutions">解決策</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>エラー総数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{analytics.summary.totalErrors}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>最も多いエラータイプ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics.summary.mostCommonErrorType.length > 0 ? (
                      <p className="text-xl">
                        {analytics.summary.mostCommonErrorType[0][0]}
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({analytics.summary.mostCommonErrorType[0][1]}件)
                        </span>
                      </p>
                    ) : (
                      <p>データがありません</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="errorTypes">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={errorTypeChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="routes">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={routeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {routeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">問題のあるルート</h3>
                  <ul className="space-y-2">
                    {analytics.summary.mostProblematicRoutes.map(([route, count]) => (
                      <li key={route} className="flex justify-between">
                        <span>{route || "不明"}</span>
                        <span className="font-medium">{count}件</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="solutions">
              <div className="space-y-4">
                <h3 className="font-medium">一般的なエラーの解決策</h3>
                <div className="space-y-2">
                  {Object.entries(analytics.solutions).map(([errorType, solution]) => (
                    <div key={errorType} className="rounded-lg border p-4">
                      <h4 className="font-medium">{errorType}</h4>
                      <p className="text-sm text-muted-foreground">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
