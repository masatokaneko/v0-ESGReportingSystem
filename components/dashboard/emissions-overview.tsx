"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getEmissionOverviewData } from "@/lib/data-service"

export function EmissionsOverview() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const overviewData = await getEmissionOverviewData()
        setData(overviewData || [])
      } catch (error) {
        console.error('Failed to fetch overview data:', error)
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOverviewData()
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
      <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" unit=" kg-CO₂" />
        <YAxis dataKey="name" type="category" width={80} />
        <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} kg-CO₂`, ""]} labelFormatter={(label) => `${label}`} />
        <Legend />
        <Bar dataKey="electricity" name="電力" fill="#002B5B" />
        <Bar dataKey="gas" name="ガス" fill="#0059B8" />
        <Bar dataKey="fuel" name="燃料" fill="#0077CC" />
        <Bar dataKey="water" name="水" fill="#0095DD" />
        <Bar dataKey="waste" name="廃棄物" fill="#00B3EE" />
      </BarChart>
    </ResponsiveContainer>
  )
}
