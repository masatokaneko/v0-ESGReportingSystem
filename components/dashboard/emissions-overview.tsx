"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { logClientError } from "@/lib/error-logger"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const [retryCount, setRetryCount] = useState(0)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Fetching emissions overview data...")
      const response = await fetch("/api/dashboard/summary", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP error ${response.status}`

        try {
          const errorData = JSON.parse(errorText)
          if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch (e) {
          // テキストをそのまま使用
          if (errorText) {
            errorMessage = errorText
          }
        }

        throw new Error(errorMessage)
      }

      const dashboardData = await response.json()
      console.log("Dashboard data received:", dashboardData)

      setData({
        totalEmission: Number(dashboardData.totalEmission) || 0,
        scopeData: {
          scope1: Number(dashboardData.scopeData?.scope1) || 0,
          scope2: Number(dashboardData.scopeData?.scope2) || 0,
          scope3: Number(dashboardData.scopeData?.scope3) || 0,
        },
      })
    } catch (error) {
      console.error("Error fetching emissions overview:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(errorMessage)
      logClientError({
        message: "Failed to fetch emissions overview data",
        source: "EmissionsOverview",
        severity: "error",
        stack: error instanceof Error ? error.stack : undefined,
        context: { component: "EmissionsOverview", retryCount },
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>排出量概要</CardTitle>
          <CardDescription>総排出量とスコープ別内訳</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">総排出量</div>
              <div className="h-4 w-24 animate-pulse bg-muted rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">スコープ別内訳</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-xs">スコープ1</div>
                <div className="h-3 w-16 animate-pulse bg-muted rounded"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs">スコープ2</div>
                <div className="h-3 w-16 animate-pulse bg-muted rounded"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs">スコープ3</div>
                <div className="h-3 w-16 animate-pulse bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>排出量概要</CardTitle>
          <CardDescription>総排出量とスコープ別内訳</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>データの読み込みに失敗しました: {error}</p>
          </div>
          <Button onClick={handleRetry} variant="outline">
            再試行
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>排出量概要</CardTitle>
          <CardDescription>総排出量とスコープ別内訳</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center text-muted-foreground">
          <p>データがありません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>排出量概要</CardTitle>
        <CardDescription>総排出量とスコープ別内訳</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">総排出量</div>
            <div className="text-sm font-bold">{data.totalEmission.toLocaleString()} kg-CO2e</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">スコープ別内訳</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-xs">スコープ1 (直接排出)</div>
              <div className="text-xs font-medium">{data.scopeData.scope1.toLocaleString()} kg-CO2e</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs">スコープ2 (間接排出-エネルギー)</div>
              <div className="text-xs font-medium">{data.scopeData.scope2.toLocaleString()} kg-CO2e</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs">スコープ3 (その他の間接排出)</div>
              <div className="text-xs font-medium">{data.scopeData.scope3.toLocaleString()} kg-CO2e</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
