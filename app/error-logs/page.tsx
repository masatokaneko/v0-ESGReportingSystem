import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ErrorLogsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">エラーログ管理</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>エラーログ管理</CardTitle>
          <CardDescription>システムエラーログを確認・管理します</CardDescription>
        </CardHeader>
        <CardContent>
          <p>エラーログはこちらに表示されます。</p>
        </CardContent>
      </Card>
    </div>
  )
}
