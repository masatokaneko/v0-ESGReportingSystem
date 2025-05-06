"use client"

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    month: "1月",
    "Scope 1": 3200,
    "Scope 2": 4100,
    "Scope 3": 5300,
  },
  {
    month: "2月",
    "Scope 1": 3100,
    "Scope 2": 4000,
    "Scope 3": 5100,
  },
  {
    month: "3月",
    "Scope 1": 3300,
    "Scope 2": 4200,
    "Scope 3": 5400,
  },
  {
    month: "4月",
    "Scope 1": 2900,
    "Scope 2": 3900,
    "Scope 3": 4800,
  },
  {
    month: "5月",
    "Scope 1": 2800,
    "Scope 2": 3800,
    "Scope 3": 4700,
  },
  {
    month: "6月",
    "Scope 1": 2900,
    "Scope 2": 3900,
    "Scope 3": 4900,
  },
  {
    month: "7月",
    "Scope 1": 3100,
    "Scope 2": 4200,
    "Scope 3": 5200,
  },
  {
    month: "8月",
    "Scope 1": 3200,
    "Scope 2": 4300,
    "Scope 3": 5300,
  },
  {
    month: "9月",
    "Scope 1": 3000,
    "Scope 2": 4100,
    "Scope 3": 5000,
  },
  {
    month: "10月",
    "Scope 1": 2900,
    "Scope 2": 4000,
    "Scope 3": 4900,
  },
  {
    month: "11月",
    "Scope 1": 2800,
    "Scope 2": 3900,
    "Scope 3": 4800,
  },
  {
    month: "12月",
    "Scope 1": 2900,
    "Scope 2": 4000,
    "Scope 3": 4900,
  },
]

export function EmissionsTrend() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
        <Tooltip formatter={(value: number) => [`${value.toLocaleString()} tCO2e`, ""]} />
        <Legend />
        <Area type="monotone" dataKey="Scope 1" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
        <Area type="monotone" dataKey="Scope 2" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
        <Area type="monotone" dataKey="Scope 3" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
