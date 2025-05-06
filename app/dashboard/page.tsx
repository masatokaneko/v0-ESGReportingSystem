import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker"
import { EmissionsOverview } from "@/components/dashboard/emissions-overview"
import { EmissionsBySource } from "@/components/dashboard/emissions-by-source"
import { EmissionsTrend } from "@/components/dashboard/emissions-trend"
import { Button } from "@/components/ui/button"
import { Download, FileText, RefreshCw } from "lucide-react"

export const metadata: Metadata = {
  title: "ダッシュボード | ESGレポーティングシステム",
  description: "ESGレポーティングシステムのダッシュボード",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            更新
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="analytics">詳細分析</TabsTrigger>
          <TabsTrigger value="reports">レポート</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総排出量</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142,857 tCO2e</div>
                <p className="text-xs text-muted-foreground">前年比 -12.5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scope 1 排出量</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 18V2M10 18V6M4 18v-4" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">35,621 tCO2e</div>
                <p className="text-xs text-muted-foreground">前年比 -8.3%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scope 2 排出量</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48,392 tCO2e</div>
                <p className="text-xs text-muted-foreground">前年比 -15.2%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scope 3 排出量</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">58,844 tCO2e</div>
                <p className="text-xs text-muted-foreground">前年比 -13.7%</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>排出量の推移</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <EmissionsTrend />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>排出源別内訳</CardTitle>
                <CardDescription>2023年度の排出源別割合</CardDescription>
              </CardHeader>
              <CardContent>
                <EmissionsBySource />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>排出量の概要</CardTitle>
                <CardDescription>Scope別・カテゴリ別の排出量</CardDescription>
              </CardHeader>
              <CardContent>
                <EmissionsOverview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>最近のレポート</CardTitle>
                <CardDescription>最近生成されたレポート</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <FileText className="h-5 w-5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">2023年度 統合レポート</p>
                      <p className="text-sm text-muted-foreground">2023/12/15 生成</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      ダウンロード
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <FileText className="h-5 w-5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">2023年度 第3四半期レポート</p>
                      <p className="text-sm text-muted-foreground">2023/10/05 生成</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      ダウンロード
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <FileText className="h-5 w-5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">2023年度 第2四半期レポート</p>
                      <p className="text-sm text-muted-foreground">2023/07/10 生成</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      ダウンロード
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>詳細分析</CardTitle>
                <CardDescription>詳細な排出量分析とトレンド</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-20 text-muted-foreground">詳細分析ページは準備中です。</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>レポート</CardTitle>
                <CardDescription>ESGレポートの生成と管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-20 text-muted-foreground">レポートページは準備中です。</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
