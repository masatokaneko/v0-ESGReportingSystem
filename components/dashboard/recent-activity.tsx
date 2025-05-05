"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface RecentActivityProps {
  data: Array<{
    id: string
    action: string
    user: string
    timestamp: string
    details: string
    status: string
  }>
}

export function RecentActivity({ data = [] }: RecentActivityProps) {
  // データがない場合のフォールバック
  const activities =
    data.length > 0
      ? data
      : [
          {
            id: "1",
            action: "電力使用量",
            user: "田中太郎",
            timestamp: new Date().toISOString(),
            details: "排出量: 1,200 kg-CO2e",
            status: "approved",
          },
          {
            id: "2",
            action: "ガス使用量",
            user: "佐藤花子",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            details: "排出量: 800 kg-CO2e",
            status: "pending",
          },
          {
            id: "3",
            action: "廃棄物",
            user: "鈴木一郎",
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            details: "排出量: 500 kg-CO2e",
            status: "rejected",
          },
        ]

  // ステータスに応じたバッジの色を返す関数
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // ステータスの日本語表示を返す関数
  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "承認済"
      case "pending":
        return "承認待ち"
      case "rejected":
        return "却下"
      default:
        return "不明"
    }
  }

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.action}</p>
            <p className="text-sm text-muted-foreground">
              {activity.user} - {formatDate(activity.timestamp)}
            </p>
            <p className="text-xs text-muted-foreground">{activity.details}</p>
          </div>
          <div className="ml-auto">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
              {getStatusText(activity.status)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
