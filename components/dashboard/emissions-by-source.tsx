"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

type EmissionsBySourceProps = {
  data: {
    scope1: { name: string; value: number; color: string }[]
    scope2: { name: string; value: number; color: string }[]
    scope3: { name: string; value: number; color: string }[]
    all: { name: string; value: number; color: string }[]
  } | null
  isLoading: boolean
}

export function EmissionsBySource({ data, isLoading }: EmissionsBySourceProps) {
  const [activeTab, setActiveTab] = useState("all")

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[300px] mx-auto" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">データがありません</p>
      </div>
    )
  }

  const renderActiveTabContent = () => {
    let chartData
    switch (activeTab) {
      case "scope1":
        chartData = data.scope1
        break
      case "scope2":
        chartData = data.scope2
        break
      case "scope3":
        chartData = data.scope3
        break
      default:
        chartData = data.all
    }

    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">データがありません</p>
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value.toLocaleString()} t-CO2e`, "排出量"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">全体</TabsTrigger>
          <TabsTrigger value="scope1">Scope 1</TabsTrigger>
          <TabsTrigger value="scope2">Scope 2</TabsTrigger>
          <TabsTrigger value="scope3">Scope 3</TabsTrigger>
        </TabsList>
      </Tabs>

      {renderActiveTabContent()}
    </div>
  )
}
