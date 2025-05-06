"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "4月",
    "Scope 1": 240,
    "Scope 2": 380,
    "Scope 3": 220,
  },
  {
    name: "5月",
    "Scope 1": 300,
    "Scope 2": 400,
    "Scope 3": 250,
  },
  {
    name: "6月",
    "Scope 1": 280,
    "Scope 2": 410,
    "Scope 3": 260,
  },
  {
    name: "7月",
    "Scope 1": 320,
    "Scope 2": 490,
    "Scope 3": 280,
  },
  {
    name: "8月",
    "Scope 1": 350,
    "Scope 2": 520,
    "Scope 3": 290,
  },
  {
    name: "9月",
    "Scope 1": 310,
    "Scope 2": 480,
    "Scope 3": 270,
  },
  {
    name: "10月",
    "Scope 1": 290,
    "Scope 2": 460,
    "Scope 3": 260,
  },
  {
    name: "11月",
    "Scope 1": 280,
    "Scope 2": 450,
    "Scope 3": 250,
  },
  {
    name: "12月",
    "Scope 1": 300,
    "Scope 2": 470,
    "Scope 3": 260,
  },
  {
    name: "1月",
    "Scope 1": 320,
    "Scope 2": 490,
    "Scope 3": 270,
  },
  {
    name: "2月",
    "Scope 1": 290,
    "Scope 2": 460,
    "Scope 3": 250,
  },
  {
    name: "3月",
    "Scope 1": 310,
    "Scope 2": 480,
    "Scope 3": 260,
  },
]

export function EmissionsTrend() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis unit=" t-CO2" />
        <Tooltip formatter={(value) => [`${value} t-CO2`, ""]} labelFormatter={(label) => `${label}`} />
        <Legend />
        <Bar dataKey="Scope 1" stackId="a" fill="#002B5B" />
        <Bar dataKey="Scope 2" stackId="a" fill="#0059B8" />
        <Bar dataKey="Scope 3" stackId="a" fill="#0077CC" />
      </BarChart>
    </ResponsiveContainer>
  )
}
