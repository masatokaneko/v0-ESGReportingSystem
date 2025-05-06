"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "電力使用", value: 48392, color: "#10b981" },
  { name: "燃料燃焼", value: 35621, color: "#0ea5e9" },
  { name: "購入した製品・サービス", value: 12500, color: "#6366f1" },
  { name: "輸送・配送", value: 9800, color: "#f43f5e" },
  { name: "資本財", value: 8700, color: "#8b5cf6" },
  { name: "製品使用", value: 8644, color: "#d946ef" },
  { name: "その他", value: 19200, color: "#94a3b8" },
]

export function EmissionsBySource() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={1}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value.toLocaleString()} tCO2e`, ""]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
