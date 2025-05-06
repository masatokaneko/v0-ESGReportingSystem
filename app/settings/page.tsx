import { SettingsTabs } from "@/components/settings/settings-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">設定</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>システム設定</CardTitle>
          <CardDescription>ESGレポーティングシステムの各種設定を管理します。</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsTabs />
        </CardContent>
      </Card>
    </div>
  )
}
