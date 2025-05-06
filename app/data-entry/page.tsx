import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DataEntryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">データ登録</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>データ登録</CardTitle>
          <CardDescription>ESGデータを手動で登録します</CardDescription>
        </CardHeader>
        <CardContent>
          <p>データ登録フォームはこちらに表示されます。</p>
        </CardContent>
      </Card>
    </div>
  )
}
