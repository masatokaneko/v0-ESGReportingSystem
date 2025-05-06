import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ErrorTestPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">エラーテスト</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>エラーテスト</CardTitle>
          <CardDescription>システムエラーをテストします</CardDescription>
        </CardHeader>
        <CardContent>
          <p>エラーテスト機能はこちらに表示されます。</p>
        </CardContent>
      </Card>
    </div>
  )
}
