"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { logClientError } from "@/lib/error-logger"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrendData {
  month: string
  emissions: number
}

export function EmissionsTrend() {
  const [data, setData] = useState<TrendData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Fetching emissions trend data...")
      const response = await fetch("/api/dashboard/summary", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP error ${response.status}`

        try {
          const errorData = JSON.parse(errorText)
          if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch (e) {
          // テキストをそのまま使用
          if (errorText) {
            errorMessage = errorText
          }
        }

        throw new Error(errorMessage)
      }

      const dashboardData = await response.json()
      console.log("Dashboard data received:", dashboardData)

      if (dashboardData.emissionsTrend && Array.isArray(dashboardData.emissionsTrend)) {
        // 月名を日本語に変換する関数
        const formatMonth = (monthStr: string) => {
          const [year, month] = monthStr.split("-")
          return `${year}年${month}月`
        }

        // データを整形
        const formattedData = dashboardData.emissionsTrend.map((item: any) => ({
          month: formatMonth(item.month),
          emissions: Number(item.emissions) || 0,
        }))

        setData(formattedData)
      } else {
        console.warn("Emissions trend data not found or not an array:", dashboardData.emissionsTrend)
        setData([])
      }
    } catch (error) {
      console.error("Error fetching emissions trend:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(errorMessage)
      logClientError({
        message: "Failed to fetch emissions trend data",
        source: "EmissionsTrend",
        severity: "error",
        stack: error instanceof Error ? error.stack : undefined,
        context: { component: "EmissionsTrend", retryCount },
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>排出量トレンド</CardTitle>
          <CardDescription>月別の排出量推移</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="w-full h-full animate-pulse bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>排出量トレンド</CardTitle>
          <CardDescription>月別の排出量推移</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>データの読み込みに失敗しました: {error}</p>
          </div>
          <Button onClick={handleRetry} variant="outline">
            再試行
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>排出量トレンド</CardTitle>
          <CardDescription>月別の排出量推移</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p>データがありません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>排出量トレンド</CardTitle>
        <CardDescription>月別の排出量推移</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()} kg-CO2e`} />
            <Area type="monotone" dataKey="emissions" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
