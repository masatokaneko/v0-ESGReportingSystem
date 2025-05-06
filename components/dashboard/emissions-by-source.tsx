"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

type EmissionByCategory = {
  name: string
  value: number
}

type EmissionByLocation = {
  name: string
  scope1: number
  scope2: number
  scope3: number
  total: number
}

type EmissionByDepartment = {
  name: string
  scope1: number
  scope2: number
  scope3: number
  total: number
}

export default function EmissionsBySource() {
  const [categoryData, setCategoryData] = useState<EmissionByCategory[]>([])
  const [locationData, setLocationData] = useState<EmissionByLocation[]>([])
  const [departmentData, setDepartmentData] = useState<EmissionByDepartment[]>([])
  const [activeTab, setActiveTab] = useState("category")
  const [activeScope, setActiveScope] = useState("total")
  const [isLoading, setIsLoading] = useState(true)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6B66FF"]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // モックデータを定義
      const mockData = {
        success: true,
        categoryData: [
          { name: "電気", value: 20000 },
          { name: "ガス", value: 10000 },
          { name: "出張", value: 15000 },
          { name: "その他", value: 7500 },
        ],
        locationData: [
          { name: "東京本社", scope1: 5000, scope2: 2500, scope3: 10000, total: 17500 },
          { name: "大阪支店", scope1: 3000, scope2: 1500, scope3: 6000, total: 10500 },
          { name: "福岡営業所", scope1: 2000, scope2: 1000, scope3: 4000, total: 7000 },
        ],
        departmentData: [
          { name: "人事部", scope1: 1000, scope2: 500, scope3: 2000, total: 3500 },
          { name: "経理部", scope1: 800, scope2: 400, scope3: 1600, total: 2800 },
          { name: "営業部", scope1: 3200, scope2: 1600, scope3: 6400, total: 11200 },
        ],
      }

      let data
      try {
        const response = await fetch("/api/dashboard/emissions-by-source")
        if (!response.ok) {
          throw new Error("API response was not ok")
        }
        data = await response.json()
      } catch (error) {
        console.warn("API fetch failed, using mock data:", error)
        data = mockData
      }

      if (data.success) {
        setCategoryData(data.categoryData)
        setLocationData(data.locationData)
        setDepartmentData(data.departmentData)
      }
    } catch (error) {
      console.error("Error fetching emissions by source data:", error)
      // エラー時にもモックデータを使用
      setCategoryData([
        { name: "電気", value: 20000 },
        { name: "ガス", value: 10000 },
        { name: "出張", value: 15000 },
        { name: "その他", value: 7500 },
      ])
      setLocationData([
        { name: "東京本社", scope1: 5000, scope2: 2500, scope3: 10000, total: 17500 },
        { name: "大阪支店", scope1: 3000, scope2: 1500, scope3: 6000, total: 10500 },
        { name: "福岡営業所", scope1: 2000, scope2: 1000, scope3: 4000, total: 7000 },
      ])
      setDepartmentData([
        { name: "人事部", scope1: 1000, scope2: 500, scope3: 2000, total: 3500 },
        { name: "経理部", scope1: 800, scope2: 400, scope3: 1600, total: 2800 },
        { name: "営業部", scope1: 3200, scope2: 1600, scope3: 6400, total: 11200 },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getLocationChartData = () => {
    return locationData
      .map((item) => ({
        name: item.name,
        value: activeScope === "total" ? item.total : (item[activeScope as keyof typeof item] as number),
      }))
      .filter((item) => item.value > 0)
  }

  const getDepartmentChartData = () => {
    return departmentData
      .map((item) => ({
        name: item.name,
        value: activeScope === "total" ? item.total : (item[activeScope as keyof typeof item] as number),
      }))
      .filter((item) => item.value > 0)
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p>{`${payload[0].value.toLocaleString()} kg-CO2e`}</p>
          <p>{`${(payload[0].payload.percent * 100).toFixed(1)}%`}</p>
        </div>
      )
    }

    return null
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>排出源別構成比</CardTitle>
        <CardDescription>排出源別のCO2排出量構成比を表示しています</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="category">カテゴリ別</TabsTrigger>
            <TabsTrigger value="location">拠点別</TabsTrigger>
            <TabsTrigger value="department">部門別</TabsTrigger>
          </TabsList>

          <div className="mb-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="total" onClick={() => setActiveScope("total")}>
                合計
              </TabsTrigger>
              <TabsTrigger value="scope1" onClick={() => setActiveScope("scope1")}>
                Scope 1
              </TabsTrigger>
              <TabsTrigger value="scope2" onClick={() => setActiveScope("scope2")}>
                Scope 2
              </TabsTrigger>
              <TabsTrigger value="scope3" onClick={() => setActiveScope("scope3")}>
                Scope 3
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="category">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>読み込み中...</p>
              </div>
            ) : categoryData.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p>データがありません</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>

          <TabsContent value="location">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>読み込み中...</p>
              </div>
            ) : locationData.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p>データがありません</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getLocationChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getLocationChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>

          <TabsContent value="department">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>読み込み中...</p>
              </div>
            ) : departmentData.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p>データがありません</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getDepartmentChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getDepartmentChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
