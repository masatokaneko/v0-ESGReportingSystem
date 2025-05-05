"use client"

import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { toast } from "@/hooks/use-toast"

interface SourceData {
  name: string
  value: number
  color: string
}

const COLORS = ["#002B5B", "#0059B8", "#0077CC", "#0095DD", "#00B3EE", "#00D1FF", "#00EFFF"]

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
          throw new Error(errorData.error || "Failed to fetch dashboard data")
        }

        const dashboardData = await response.json()
        if (!dashboardData.sourceData) {
          throw new Error("Source data is missing")
        }

        const sourceData = dashboardData.sourceData

        // データを配列に変換
        const chartData: SourceData[] = Object.entries(sourceData).map(([name, value], index) => ({
          name,
          value: Number(value) || 0,
          color: COLORS[index % COLORS.length],
        }))

        // 値の大きい順にソート
        chartData.sort((a, b) => b.value - a.value)

        // 上位5つを取得し、残りはその他にまとめる
        if (chartData.length > 5) {
          const top5 = chartData.slice(0, 5)
          const others = chartData.slice(5).reduce(
            (acc, curr) => {
              acc.value += curr.value
              return acc
            },
            { name: "その他", value: 0, color: COLORS[5] },
          )
          setData([...top5, others])
        } else {
          setData(chartData)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
        toast({
          title: "エラー",
          description: "ダッシュボードデータの取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[300px] text-red-500">
        <p>データの読み込みに失敗しました。</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px] text-muted-foreground">
        <p>データがありません</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value.toLocaleString()} kg-CO2`, ""]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
