"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface EmissionsBySourceProps {
  data: Array<{ name: string; value: number }>
}

// カラーパレット
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C"]

export function EmissionsBySource({ data = [] }: EmissionsBySourceProps) {
  // データがない場合のフォールバック
  const chartData =
    data.length > 0
      ? data
      : [
          { name: "電力", value: 4000 },
          { name: "ガス", value: 3000 },
          { name: "水道", value: 2000 },
          { name: "廃棄物", value: 1500 },
          { name: "その他", value: 1000 },
        ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>排出源別割合</CardTitle>
        <CardDescription>活動タイプ別の排出量割合</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()} kg-CO2e`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
