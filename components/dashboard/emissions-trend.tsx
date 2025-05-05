"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
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

      const response = await fetch("/api/dashboard/summary", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error ${response.status}`)
      }

      const dashboardData = await response.json()

      if (dashboardData.emissionsTrend) {
        setData(dashboardData.emissionsTrend)
      } else {
        console.warn("Emissions trend data not found in API response")
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

  // 月名を日本語に変換する関数
  const formatMonth = (monthYear: string) => {
    if (!monthYear) return ""

    try {
      const [year, month] = monthYear.split("-")
      return `${year}年${Number.parseInt(month)}月`
    } catch (error) {
      console.error("Error formatting month:", error)
      return monthYear
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>月別排出量推移</CardTitle>
          <CardDescription>過去12ヶ月の排出量推移</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="w-full h-full animate-pulse bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>月別排出量推移</CardTitle>
          <CardDescription>過去12ヶ月の排出量推移</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-red-500">
          <div className="flex items-center gap-2 mb-4">
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
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>月別排出量推移</CardTitle>
          <CardDescription>過去12ヶ月の排出量推移</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p>データがありません</p>
        </CardContent>
      </Card>
    )
  }

  // データを日付順にソート
  const sortedData = [...data].sort((a, b) => {
    return new Date(a.month).getTime() - new Date(b.month).getTime()
  })

  // 月名を日本語に変換したデータを作成
  const formattedData = sortedData.map((item) => ({
    ...item,
    formattedMonth: formatMonth(item.month),
  }))

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>月別排出量推移</CardTitle>
        <CardDescription>過去12ヶ月の排出量推移</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedMonth" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value.toLocaleString()} kg-CO2e`, "排出量"]} />
            <Legend />
            <Bar dataKey="emissions" name="排出量" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
