"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { logClientError } from "@/lib/error-logger"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SourceData {
  name: string
  value: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function EmissionsBySource() {
  const [data, setData] = useState<SourceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Fetching emissions by source data...")
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

      if (dashboardData.emissionsBySource && Array.isArray(dashboardData.emissionsBySource)) {
        // 値が数値であることを確認
        const formattedData = dashboardData.emissionsBySource.map((item: any) => ({
          name: item.name || "不明",
          value: typeof item.value === "number" ? item.value : Number.parseFloat(item.value) || 0,
        }))
        setData(formattedData)
      } else {
        console.warn("Emissions by source data not found or not an array:", dashboardData.emissionsBySource)
        setData([])
      }
    } catch (error) {
      console.error("Error fetching emissions by source:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(errorMessage)
      logClientError({
        message: "Failed to fetch emissions by source data",
        source: "EmissionsBySource",
        severity: "error",
        stack: error instanceof Error ? error.stack : undefined,
        context: { component: "EmissionsBySource", retryCount },
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
          <CardTitle>排出源別割合</CardTitle>
          <CardDescription>活動タイプ別の排出量割合</CardDescription>
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
          <CardTitle>排出源別割合</CardTitle>
          <CardDescription>活動タイプ別の排出量割合</CardDescription>
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
          <CardTitle>排出源別割合</CardTitle>
          <CardDescription>活動タイプ別の排出量割合</CardDescription>
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
        <CardTitle>排出源別割合</CardTitle>
        <CardDescription>活動タイプ別の排出量割合</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()} kg-CO2e`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
