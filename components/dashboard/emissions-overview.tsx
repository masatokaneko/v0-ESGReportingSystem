"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Scope 1",
    直接排出: 3456,
  },
  {
    name: "Scope 2",
    間接排出: 5678,
  },
  {
    name: "Scope 3-1",
    購入した製品サービス: 1234,
  },
  {
    name: "Scope 3-2",
    資本財: 567,
  },
  {
    name: "Scope 3-3",
    燃料エネルギー関連: 345,
  },
  {
    name: "Scope 3-4",
    "輸送配送(上流)": 678,
  },
  {
    name: "Scope 3-5",
    事業から出る廃棄物: 234,
  },
]

export function EmissionsOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" unit=" t-CO2" />
        <YAxis dataKey="name" type="category" width={80} />
        <Tooltip formatter={(value) => [`${value} t-CO2`, ""]} labelFormatter={(label) => `${label}`} />
        <Legend />
        <Bar dataKey="直接排出" fill="#002B5B" />
        <Bar dataKey="間接排出" fill="#0059B8" />
        <Bar dataKey="購入した製品サービス" fill="#0077CC" />
        <Bar dataKey="資本財" fill="#0095DD" />
        <Bar dataKey="燃料エネルギー関連" fill="#00B3EE" />
        <Bar dataKey="輸送配送(上流)" fill="#00D1FF" />
        <Bar dataKey="事業から出る廃棄物" fill="#00EFFF" />
      </BarChart>
    </ResponsiveContainer>
  )
}
