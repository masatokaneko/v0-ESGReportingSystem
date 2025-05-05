"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { logClientError } from "@/lib/error-logger"

interface ActivityItem {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
  status: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard/summary")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch dashboard data")
        }

        const dashboardData = await response.json()

        // APIからのデータ構造に合わせて処理
        if (dashboardData.recentActivities) {
          setActivities(dashboardData.recentActivities)
        } else {
          console.warn("Recent activities data not found in API response")
          setActivities([])
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        setError(errorMessage)
        logClientError({
          message: "Failed to fetch recent activities data",
          source: "RecentActivity",
          severity: "error",
          stack: error instanceof Error ? error.stack : undefined,
          context: { component: "RecentActivity" },
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  // ステータスに応じたバッジの色を返す関数
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">承認済</Badge>
      case "rejected":
        return <Badge className="bg-red-500">却下</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">審査中</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>最近の活動</CardTitle>
          <CardDescription>直近のデータ入力・承認状況</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center animate-pulse">
                <div className="w-full space-y-2">
                  <div className="h-4 bg-muted rounded-md w-3/4"></div>
                  <div className="h-3 bg-muted rounded-md w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>最近の活動</CardTitle>
          <CardDescription>直近のデータ入力・承認状況</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            <p>データの読み込みに失敗しました: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>最近の活動</CardTitle>
          <CardDescription>直近のデータ入力・承認状況</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            <p>最近の活動はありません</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>最近の活動</CardTitle>
        <CardDescription>直近のデータ入力・承認状況</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{activity.action}</p>
                {getStatusBadge(activity.status)}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{activity.user}</span>
                <span>{formatDate(activity.timestamp)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{activity.details}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
