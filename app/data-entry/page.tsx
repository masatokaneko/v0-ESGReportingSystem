import { DataEntryForm } from "@/components/data-entry/data-entry-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DataEntryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">データ登録</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>ESGデータ登録フォーム</CardTitle>
          <CardDescription>活動量と原単位を入力して、GHG排出量を計算します。</CardDescription>
        </CardHeader>
        <CardContent>
          <DataEntryForm />
        </CardContent>
      </Card>
    </div>
  )
}
