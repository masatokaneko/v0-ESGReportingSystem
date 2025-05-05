"use client"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"

interface EmissionsTrendProps {
  data: Array<{ month: string; emissions: number }>
}

export function EmissionsTrend({ data = [] }: EmissionsTrendProps) {
  // データがない場合のフォールバック
  const chartData =
    data.length > 0
      ? data
      : [
          { month: "2023-01", emissions: 4000 },
          { month: "2023-02", emissions: 3000 },
          { month: "2023-03", emissions: 2000 },
          { month: "2023-04", emissions: 2780 },
          { month: "2023-05", emissions: 1890 },
          { month: "2023-06", emissions: 2390 },
          { month: "2023-07", emissions: 3490 },
          { month: "2023-08", emissions: 3490 },
          { month: "2023-09", emissions: 3490 },
          { month: "2023-10", emissions: 3490 },
          { month: "2023-11", emissions: 3490 },
          { month: "2023-12", emissions: 3490 },
        ]

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(value) => {
              // YYYY-MM形式を MM月 形式に変換
              const parts = value.split("-")
              if (parts.length === 2) {
                return `${Number.parseInt(parts[1])}月`
              }
              return value
            }}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${Number(value).toLocaleString()} kg-CO2e`, "排出量"]}
            labelFormatter={(label) => {
              // YYYY-MM形式を YYYY年MM月 形式に変換
              const parts = label.split("-")
              if (parts.length === 2) {
                return `${parts[0]}年${Number.parseInt(parts[1])}月`
              }
              return label
            }}
          />
          <Legend />
          <Bar dataKey="emissions" fill="#8884d8" name="月間排出量" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
