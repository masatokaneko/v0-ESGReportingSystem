import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
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

const activities = [
  {
    name: "山田太郎",
    avatar: "/placeholder.svg?key=7cts5",
    action: "東京本社の電力データを登録しました",
    date: "2分前",
  },
  {
    name: "佐藤花子",
    avatar: "/placeholder.svg?key=cleby",
    action: "大阪支社のガスデータを承認しました",
    date: "34分前",
  },
  {
    name: "鈴木一郎",
    avatar: "/placeholder.svg?key=vh9tt",
    action: "名古屋支社の廃棄物データを登録しました",
    date: "3時間前",
  },
  {
    name: "田中誠",
    avatar: "/placeholder.svg?key=f3nyu",
    action: "福岡支社の社用車データを承認しました",
    date: "5時間前",
  },
]
