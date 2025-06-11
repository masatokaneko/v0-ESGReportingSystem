"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getDashboardSummary } from "@/lib/data-service"

export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const dashboardData = await getDashboardSummary()
        setActivities(dashboardData.recentActivities || [])
      } catch (error) {
        console.error('Failed to fetch recent activities:', error)
        setActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-muted-foreground">データを読み込み中...</div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-muted-foreground">最近の活動がありません</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.avatar || "/placeholder.svg"} alt="Avatar" />
            <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.name}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">{activity.date}</div>
        </div>
      ))}
    </div>
  )
}
