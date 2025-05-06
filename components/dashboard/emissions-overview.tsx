"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Scope 1",
    direct_emissions: 35621,
  },
  {
    name: "Scope 2",
    electricity_use: 48392,
  },
  {
    name: "Scope 3.1",
    purchased_goods: 12500,
  },
  {
    name: "Scope 3.2",
    capital_goods: 8700,
  },
  {
    name: "Scope 3.3",
    fuel_energy: 6200,
  },
  {
    name: "Scope 3.4",
    upstream_transport: 9800,
  },
  {
    name: "Scope 3.5",
    waste_operations: 4300,
  },
  {
    name: "Scope 3.6",
    business_travel: 3100,
  },
  {
    name: "Scope 3.7",
    employee_commuting: 5600,
  },
  {
    name: "Scope 3.11",
    product_use: 8644,
  },
]

export function EmissionsOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 25, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis type="number" tickFormatter={(value) => `${value.toLocaleString()} tCO2e`} />
        <YAxis dataKey="name" type="category" width={80} fontSize={12} />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()} tCO2e`, ""]}
          labelFormatter={(label) => `${label}`}
        />
        <Legend />
        <Bar dataKey="direct_emissions" name="直接排出" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
        <Bar dataKey="electricity_use" name="電力使用" fill="#10b981" radius={[0, 4, 4, 0]} />
        <Bar dataKey="purchased_goods" name="購入した製品・サービス" fill="#6366f1" radius={[0, 4, 4, 0]} />
        <Bar dataKey="capital_goods" name="資本財" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
        <Bar dataKey="fuel_energy" name="燃料・エネルギー関連活動" fill="#ec4899" radius={[0, 4, 4, 0]} />
        <Bar dataKey="upstream_transport" name="輸送・配送（上流）" fill="#f43f5e" radius={[0, 4, 4, 0]} />
        <Bar dataKey="waste_operations" name="事業から発生する廃棄物" fill="#f59e0b" radius={[0, 4, 4, 0]} />
        <Bar dataKey="business_travel" name="出張" fill="#84cc16" radius={[0, 4, 4, 0]} />
        <Bar dataKey="employee_commuting" name="従業員の通勤" fill="#06b6d4" radius={[0, 4, 4, 0]} />
        <Bar dataKey="product_use" name="販売した製品の使用" fill="#d946ef" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
