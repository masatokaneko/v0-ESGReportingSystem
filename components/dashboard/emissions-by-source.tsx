"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "電力", value: 5678, color: "#002B5B" },
  { name: "ガス", value: 2345, color: "#0059B8" },
  { name: "ガソリン", value: 1111, color: "#0077CC" },
  { name: "軽油", value: 890, color: "#0095DD" },
  { name: "その他", value: 2321, color: "#00B3EE" },
]

export function EmissionsBySource() {
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
        <Tooltip formatter={(value) => [`${value} t-CO2`, ""]} labelFormatter={(label) => `${label}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
