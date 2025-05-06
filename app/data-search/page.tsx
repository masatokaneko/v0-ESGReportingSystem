import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DataSearchPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">データ参照/検索</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>データ参照/検索</CardTitle>
          <CardDescription>登録済みのESGデータを検索・参照します</CardDescription>
        </CardHeader>
        <CardContent>
          <p>検索フォームはこちらに表示されます。</p>
        </CardContent>
      </Card>
    </div>
  )
}
