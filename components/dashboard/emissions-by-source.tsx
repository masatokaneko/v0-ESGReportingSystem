"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { logClientError } from "@/lib/error-logger"

interface SourceData {
  name: string
  value: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function EmissionsBySource() {
  const [data, setData] = useState<SourceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard/summary")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch dashboard data")
        }

        const dashboardData = await response.json()

        // APIからのデータ構造に合わせて処理
        if (dashboardData.emissionsBySource) {
          setData(dashboardData.emissionsBySource)
        } else {
          console.warn("Emissions by source data not found in API response")
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
          context: { component: "EmissionsBySource" },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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
        <CardContent className="h-[300px] flex items-center justify-center text-red-500">
          <p>データの読み込みに失敗しました: {error}</p>
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
            <Tooltip formatter={(value) => `${value.toLocaleString()} kg-CO2e`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
