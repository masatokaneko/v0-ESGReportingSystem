import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DataApprovalPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">データ承認</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>データ承認</CardTitle>
          <CardDescription>登録されたデータを確認・承認します</CardDescription>
        </CardHeader>
        <CardContent>
          <p>承認待ちデータはこちらに表示されます。</p>
        </CardContent>
      </Card>
    </div>
  )
}
