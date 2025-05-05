"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface EmissionsData {
  totalEmission: number
  scopeData: {
    scope1: number
    scope2: number
    scope3: number
  }
}

export function EmissionsOverview() {
  const [data, setData] = useState<EmissionsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard/summary")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch dashboard data")
        }

        const dashboardData = await response.json()
        setData({
          totalEmission: dashboardData.totalEmission || 0,
          scopeData: {
            scope1: dashboardData.scopeData?.scope1 || 0,
            scope2: dashboardData.scopeData?.scope2 || 0,
            scope3: dashboardData.scopeData?.scope3 || 0,
          },
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
        toast({
          title: "エラー",
          description: "ダッシュボードデータの取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-muted rounded"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px] text-red-500">
        <p>データの読み込みに失敗しました。</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-[200px] text-muted-foreground">
        <p>データがありません</p>
      </div>
    )
  }

  const { totalEmission, scopeData } = data
  const total = scopeData.scope1 + scopeData.scope2 + scopeData.scope3

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総排出量</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmission.toLocaleString()} kg-CO2</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scope 1</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{scopeData.scope1.toLocaleString()} kg-CO2</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? `${((scopeData.scope1 / total) * 100).toFixed(1)}%` : "0%"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scope 2</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{scopeData.scope2.toLocaleString()} kg-CO2</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? `${((scopeData.scope2 / total) * 100).toFixed(1)}%` : "0%"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scope 3</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{scopeData.scope3.toLocaleString()} kg-CO2</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? `${((scopeData.scope3 / total) * 100).toFixed(1)}%` : "0%"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
