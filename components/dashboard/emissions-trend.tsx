"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getDashboardSummary } from "@/lib/data-service"

export function EmissionsTrend() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const dashboardData = await getDashboardSummary()
        setData(dashboardData.trendData || [])
      } catch (error) {
        console.error('Failed to fetch trend data:', error)
        // エラー時のフォールバックデータ
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-muted-foreground">データを読み込み中...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-muted-foreground">データが見つかりません</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis unit=" kg-CO₂" />
        <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} kg-CO₂`, ""]} labelFormatter={(label) => `${label}`} />
        <Legend />
        <Bar dataKey="Scope 1" stackId="a" fill="#002B5B" />
        <Bar dataKey="Scope 2" stackId="a" fill="#0059B8" />
        <Bar dataKey="Scope 3" stackId="a" fill="#0077CC" />
      </BarChart>
    </ResponsiveContainer>
  )
}
