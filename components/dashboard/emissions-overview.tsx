"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

type EmissionSummary = {
  scope1: number
  scope2: number
  scope3: number
  total: number
}

type LocationSummary = {
  id: string
  name: string
  scope1: number
  scope2: number
  scope3: number
  total: number
}

type DepartmentSummary = {
  id: string
  name: string
  scope1: number
  scope2: number
  scope3: number
  total: number
}

export default function EmissionsOverview() {
  const [summary, setSummary] = useState<EmissionSummary>({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0,
  })
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [departments, setDepartments] = useState<DepartmentSummary[]>([])
  const [activeScope, setActiveScope] = useState("total")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [previousPeriodSummary, setPreviousPeriodSummary] = useState<EmissionSummary>({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/dashboard/summary")
      const data = await response.json()

      if (data.success) {
        setSummary(data.summary)
        setLocations(data.locationSummary)
        setDepartments(data.departmentSummary)
        setPreviousPeriodSummary(data.previousPeriodSummary)
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredSummary = () => {
    let filteredSummary = { ...summary }

    if (selectedLocation) {
      const locationData = locations.find((loc) => loc.id === selectedLocation)
      if (locationData) {
        filteredSummary = {
          scope1: locationData.scope1,
          scope2: locationData.scope2,
          scope3: locationData.scope3,
          total: locationData.total,
        }
      }
    }

    if (selectedDepartment) {
      const departmentData = departments.find((dep) => dep.id === selectedDepartment)
      if (departmentData) {
        filteredSummary = {
          scope1: departmentData.scope1,
          scope2: departmentData.scope2,
          scope3: departmentData.scope3,
          total: departmentData.total,
        }
      }
    }

    return filteredSummary
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const renderChangeIndicator = (current: number, previous: number) => {
    const percentChange = getPercentageChange(current, previous)

    if (Math.abs(percentChange) < 0.1) {
      return (
        <div className="flex items-center text-gray-500">
          <Minus className="h-4 w-4 mr-1" />
          <span>変化なし</span>
        </div>
      )
    }

    if (percentChange > 0) {
      return (
        <div className="flex items-center text-red-500">
          <ArrowUpRight className="h-4 w-4 mr-1" />
          <span>{percentChange.toFixed(1)}% 増加</span>
        </div>
      )
    }

    return (
      <div className="flex items-center text-green-500">
        <ArrowDownRight className="h-4 w-4 mr-1" />
        <span>{Math.abs(percentChange).toFixed(1)}% 削減</span>
      </div>
    )
  }

  const filteredSummary = getFilteredSummary()

  return (
    <Card>
      <CardHeader>
        <CardTitle>排出量概要</CardTitle>
        <CardDescription>CO2排出量の概要を表示しています</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location-filter">拠点フィルター</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger id="location-filter">
                  <SelectValue placeholder="すべての拠点" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての拠点</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department-filter">部門フィルター</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                disabled={selectedLocation === ""}
              >
                <SelectTrigger id="department-filter">
                  <SelectValue placeholder={selectedLocation === "" ? "先に拠点を選択してください" : "すべての部門"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての部門</SelectItem>
                  {departments
                    .filter((dep) => {
                      if (!selectedLocation) return true
                      const locationDepartments = locations.find((loc) => loc.id === selectedLocation)
                      return locationDepartments && dep.id.includes(selectedLocation)
                    })
                    .map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={activeScope} onValueChange={setActiveScope}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="total">合計</TabsTrigger>
              <TabsTrigger value="scope1">Scope 1</TabsTrigger>
              <TabsTrigger value="scope2">Scope 2</TabsTrigger>
              <TabsTrigger value="scope3">Scope 3</TabsTrigger>
            </TabsList>

            <TabsContent value="total" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">総排出量</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{filteredSummary.total.toLocaleString()} kg-CO2e</div>
                    {renderChangeIndicator(filteredSummary.total, previousPeriodSummary.total)}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Scope 1 + 2</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(filteredSummary.scope1 + filteredSummary.scope2).toLocaleString()} kg-CO2e
                    </div>
                    {renderChangeIndicator(
                      filteredSummary.scope1 + filteredSummary.scope2,
                      previousPeriodSummary.scope1 + previousPeriodSummary.scope2,
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Scope 3</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{filteredSummary.scope3.toLocaleString()} kg-CO2e</div>
                    {renderChangeIndicator(filteredSummary.scope3, previousPeriodSummary.scope3)}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Scope 1 比率</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredSummary.total > 0
                        ? ((filteredSummary.scope1 / filteredSummary.total) * 100).toFixed(1)
                        : "0"}
                      %
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Scope 2 比率</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredSummary.total > 0
                        ? ((filteredSummary.scope2 / filteredSummary.total) * 100).toFixed(1)
                        : "0"}
                      %
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Scope 3 比率</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredSummary.total > 0
                        ? ((filteredSummary.scope3 / filteredSummary.total) * 100).toFixed(1)
                        : "0"}
                      %
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="scope1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Scope 1 排出量</CardTitle>
                  <CardDescription>直接排出（燃料の燃焼など）</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{filteredSummary.scope1.toLocaleString()} kg-CO2e</div>
                  {renderChangeIndicator(filteredSummary.scope1, previousPeriodSummary.scope1)}
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1">総排出量に占める割合</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${filteredSummary.total > 0 ? (filteredSummary.scope1 / filteredSummary.total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm mt-1">
                      {filteredSummary.total > 0
                        ? ((filteredSummary.scope1 / filteredSummary.total) * 100).toFixed(1)
                        : "0"}
                      %
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scope2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Scope 2 排出量</CardTitle>
                  <CardDescription>間接排出（電力の使用など）</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{filteredSummary.scope2.toLocaleString()} kg-CO2e</div>
                  {renderChangeIndicator(filteredSummary.scope2, previousPeriodSummary.scope2)}
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1">総排出量に占める割合</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{
                          width: `${filteredSummary.total > 0 ? (filteredSummary.scope2 / filteredSummary.total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm mt-1">
                      {filteredSummary.total > 0
                        ? ((filteredSummary.scope2 / filteredSummary.total) * 100).toFixed(1)
                        : "0"}
                      %
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scope3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Scope 3 排出量</CardTitle>
                  <CardDescription>その他の間接排出（出張、通勤、廃棄物など）</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{filteredSummary.scope3.toLocaleString()} kg-CO2e</div>
                  {renderChangeIndicator(filteredSummary.scope3, previousPeriodSummary.scope3)}
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1">総排出量に占める割合</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{
                          width: `${filteredSummary.total > 0 ? (filteredSummary.scope3 / filteredSummary.total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm mt-1">
                      {filteredSummary.total > 0
                        ? ((filteredSummary.scope3 / filteredSummary.total) * 100).toFixed(1)
                        : "0"}
                      %
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
