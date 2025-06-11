"use client"

import { useState, useEffect } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { getDashboardSummary } from "@/lib/data-service"

export function EmissionsBySource() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSourceData = async () => {
      try {
        const dashboardData = await getDashboardSummary()
        setData(dashboardData.sourceData || [])
      } catch (error) {
        console.error('Failed to fetch source data:', error)
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSourceData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-muted-foreground">データを読み込み中...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-muted-foreground">データが見つかりません</div>
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
        <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} kg-CO₂`, ""]} labelFormatter={(label) => `${label}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
