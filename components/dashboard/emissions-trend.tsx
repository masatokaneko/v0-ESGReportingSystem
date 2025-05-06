"use client"

import { useState } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

type EmissionsTrendProps = {
  data: {
    monthly: {
      date: string
      scope1: number
      scope2: number
      scope3: number
      total: number
    }[]
    quarterly: {
      date: string
      scope1: number
      scope2: number
      scope3: number
      total: number
    }[]
    yearly: {
      date: string
      scope1: number
      scope2: number
      scope3: number
      total: number
    }[]
  } | null
  isLoading: boolean
  period: string
}

export function EmissionsTrend({ data, isLoading, period }: EmissionsTrendProps) {
  const [chartType, setChartType] = useState("line")

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[300px] mx-auto" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">データがありません</p>
      </div>
    )
  }

  // 期間に応じたデータの選択
  let chartData
  switch (period) {
    case "month":
      chartData = data.monthly
      break
    case "quarter":
      chartData = data.quarterly
      break
    default:
      chartData = data.yearly
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">データがありません</p>
      </div>
    )
  }

  // 日付フォーマットの調整
  const formattedData = chartData.map((item) => {
    let formattedDate
    if (period === "month") {
      // 日付を "MM/DD" 形式に変換
      const date = new Date(item.date)
      formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`
    } else if (period === "quarter") {
      // 四半期表示 "YYYY Q1" など
      const date = new Date(item.date)
      const quarter = Math.floor(date.getMonth() / 3) + 1
      formattedDate = `${date.getFullYear()} Q${quarter}`
    } else {
      // 年表示
      formattedDate = item.date
    }

    return {
      ...item,
      date: formattedDate,
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Tabs defaultValue="line" value={chartType} onValueChange={setChartType} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="line">折れ線</TabsTrigger>
            <TabsTrigger value="bar">棒グラフ</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[400px]">
        {chartType === "line" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()} t-CO2e`, ""]} />
              <Legend />
              <Line type="monotone" dataKey="scope1" name="Scope 1" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="scope2" name="Scope 2" stroke="#82ca9d" />
              <Line type="monotone" dataKey="scope3" name="Scope 3" stroke="#ffc658" />
              <Line type="monotone" dataKey="total" name name="Scope 3" stroke="#ffc658" />
              <Line type="monotone" dataKey="total" name="合計" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()} t-CO2e`, ""]} />
              <Legend />
              <Bar dataKey="scope1" name="Scope 1" fill="#8884d8" />
              <Bar dataKey="scope2" name="Scope 2" fill="#82ca9d" />
              <Bar dataKey="scope3" name="Scope 3" fill="#ffc658" />
              <Bar dataKey="total" name="合計" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
