"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { toast } from "@/hooks/use-toast"

interface MonthlyData {
  name: string
  scope1: number
  scope2: number
  scope3: number
}

export function EmissionsTrend() {
  const [data, setData] = useState<MonthlyData[]>([])
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
        if (!dashboardData.monthlyData) {
          throw new Error("Monthly data is missing")
        }

        // データを配列に変換
        const chartData: MonthlyData[] = Object.entries(dashboardData.monthlyData).map(
          ([month, values]: [string, any]) => ({
            name: month,
            scope1: values.scope1 || 0,
            scope2: values.scope2 || 0,
            scope3: values.scope3 || 0,
          }),
        )

        // 月の順番に並べ替え
        const monthOrder = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        chartData.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name))

        setData(chartData)
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
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `${value.toLocaleString()} kg-CO2`} />
        <Legend />
        <Bar dataKey="scope1" name="Scope 1" stackId="a" fill="#0077CC" />
        <Bar dataKey="scope2" name="Scope 2" stackId="a" fill="#00B3EE" />
        <Bar dataKey="scope3" name="Scope 3" stackId="a" fill="#00EFFF" />
      </BarChart>
    </ResponsiveContainer>
  )
}
