import { ReportGenerator } from "@/components/reports/report-generator"
import { DataExporter } from "@/components/reports/data-exporter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">レポート出力</h2>
      </div>
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">レポート生成</TabsTrigger>
          <TabsTrigger value="export">データエクスポート</TabsTrigger>
        </TabsList>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ESGレポート生成</CardTitle>
              <CardDescription>期間や対象範囲を選択して、定型フォーマットのESGレポートを生成します。</CardDescription>
            </CardHeader>
            <CardContent>
              <ReportGenerator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>データエクスポート</CardTitle>
              <CardDescription>登録されたESGデータをCSVやExcel形式でエクスポートします。</CardDescription>
            </CardHeader>
            <CardContent>
              <DataExporter />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
