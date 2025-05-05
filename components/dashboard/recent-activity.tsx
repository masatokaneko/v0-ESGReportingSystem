"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface Activity {
  id: string
  entry_date: string
  activity_type: string
  status: string
  submitter: string
  created_at: string
  location: { name: string }
  department: { name: string }
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
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
        if (!dashboardData.recentActivities) {
          throw new Error("Recent activities data is missing")
        }

        setActivities(dashboardData.recentActivities)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">承認済</Badge>
      case "rejected":
        return <Badge variant="destructive">却下</Badge>
      case "pending":
        return <Badge variant="outline">審査中</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>最近の活動</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center animate-pulse">
                <div className="w-full space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
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
      <Card>
        <CardHeader>
          <CardTitle>最近の活動</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[200px] text-red-500">
            <p>データの読み込みに失敗しました。</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>最近の活動</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[200px] text-muted-foreground">
            <p>最近の活動はありません</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近の活動</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.activity_type} - {getStatusBadge(activity.status)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.location?.name || "不明"} / {activity.department?.name || "不明"} /{" "}
                  {activity.submitter || "不明"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.created_at
                    ? format(new Date(activity.created_at), "yyyy年MM月dd日 HH:mm", { locale: ja })
                    : "日時不明"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
