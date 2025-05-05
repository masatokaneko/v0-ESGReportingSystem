"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, AlertCircle } from "lucide-react"
import { logClientError } from "@/lib/error-logger"
import { Button } from "@/components/ui/button"

interface EmissionsData {
  totalEmissions: number
  monthlyChange: number
  yearlyChange: number
  unit: string
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

      const response = await fetch("/api/dashboard/summary", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error ${response.status}`)
      }

      const dashboardData = await response.json()

      if (dashboardData.emissions) {
        setData(dashboardData.emissions)
      } else {
        console.warn("Emissions overview data not found in API response")
        setData(null)
      }
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総排出量</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-6 w-24 rounded-md mb-2"></div>
          <div className="animate-pulse bg-muted h-4 w-32 rounded-md"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総排出量</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <p className="text-xs">データの読み込みに失敗しました</p>
            </div>
            <Button onClick={handleRetry} variant="outline" size="sm">
              再試行
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総排出量</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            <p>データがありません</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">総排出量</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {data.totalEmissions.toLocaleString()} {data.unit}
        </div>
        <div className="flex items-center pt-1 text-xs text-muted-foreground">
          {data.monthlyChange > 0 ? (
            <>
              <ArrowUpIcon className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 mr-1">+{data.monthlyChange}%</span>
            </>
          ) : (
            <>
              <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 mr-1">{data.monthlyChange}%</span>
            </>
          )}
          <span>前月比</span>
        </div>
      </CardContent>
    </Card>
  )
}
