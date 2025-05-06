"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type EmissionTrend = {
  date: string
  scope1: number
  scope2: number
  scope3: number
  total: number
}

export default function EmissionsTrend() {
  const [trendData, setTrendData] = useState<EmissionTrend[]>([])
  const [chartType, setChartType] = useState("line")
  const [displayMode, setDisplayMode] = useState("stacked")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/dashboard/emissions-trend")
      const data = await response.json()

      if (data.success) {
        setTrendData(data.trendData)
      }
    } catch (error) {
      console.error("Error fetching emissions trend data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`
    }
    return value
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()} kg-CO2e`}
            </p>
          ))}
          {displayMode === "stacked" && (
            <p className="font-medium mt-1">
              {`合計: ${payload.reduce((sum: number, entry: any) => sum + entry.value, 0).toLocaleString()} kg-CO2e`}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>排出量推移</CardTitle>
        <CardDescription>CO2排出量の推移を表示しています</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chart-type">グラフタイプ</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger id="chart-type">
                  <SelectValue placeholder="グラフタイプを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">折れ線グラフ</SelectItem>
                  <SelectItem value="bar">棒グラフ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-mode">表示モード</Label>
              <Select value={displayMode} onValueChange={setDisplayMode}>
                <SelectTrigger id="display-mode">
                  <SelectValue placeholder="表示モードを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stacked">積み上げ</SelectItem>
                  <SelectItem value="separate">分離</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>読み込み中...</p>
            </div>
          ) : trendData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>データがありません</p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="scope1" name="Scope 1" stroke="#0088FE" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="scope2" name="Scope 2" stroke="#00C49F" />
                    <Line type="monotone" dataKey="scope3" name="Scope 3" stroke="#FFBB28" />
                    {displayMode === "separate" && (
                      <Line type="monotone" dataKey="total" name="合計" stroke="#FF8042" strokeWidth={2} />
                    )}
                  </LineChart>
                ) : (
                  <BarChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={formatYAxis} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {displayMode === "stacked" ? (
                      <>
                        <Bar dataKey="scope1" name="Scope 1" stackId="a" fill="#0088FE" />
                        <Bar dataKey="scope2" name="Scope 2" stackId="a" fill="#00C49F" />
                        <Bar dataKey="scope3" name="Scope 3" stackId="a" fill="#FFBB28" />
                      </>
                    ) : (
                      <>
                        <Bar dataKey="scope1" name="Scope 1" fill="#0088FE" />
                        <Bar dataKey="scope2" name="Scope 2" fill="#00C49F" />
                        <Bar dataKey="scope3" name="Scope 3" fill="#FFBB28" />
                        <Bar dataKey="total" name="合計" fill="#FF8042" />
                      </>
                    )}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
