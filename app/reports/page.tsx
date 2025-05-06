import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">レポート出力</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>レポート出力</CardTitle>
          <CardDescription>ESGレポートを生成・出力します</CardDescription>
        </CardHeader>
        <CardContent>
          <p>レポート出力オプションはこちらに表示されます。</p>
        </CardContent>
      </Card>
    </div>
  )
}
