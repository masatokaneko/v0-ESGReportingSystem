import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">設定</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>システム設定</CardTitle>
          <CardDescription>システム全体の設定を管理します</CardDescription>
        </CardHeader>
        <CardContent>
          <p>設定オプションはこちらに表示されます。</p>
        </CardContent>
      </Card>
    </div>
  )
}
