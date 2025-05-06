import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmissionsOverview } from "@/components/dashboard/emissions-overview"
import { EmissionsBySource } from "@/components/dashboard/emissions-by-source"
import { EmissionsTrend } from "@/components/dashboard/emissions-trend"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
          <TabsTrigger value="reports">レポート</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総GHG排出量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,345 t-CO2</div>
                <p className="text-xs text-muted-foreground">前年比 +2.5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scope 1排出量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,456 t-CO2</div>
                <p className="text-xs text-muted-foreground">前年比 -1.2%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scope 2排出量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,678 t-CO2</div>
                <p className="text-xs text-muted-foreground">前年比 +4.3%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">再エネ比率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23.5%</div>
                <p className="text-xs text-muted-foreground">前年比 +5.2%</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>排出量推移</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <EmissionsTrend />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>排出源内訳</CardTitle>
              </CardHeader>
              <CardContent>
                <EmissionsBySource />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>排出量概要</CardTitle>
                <CardDescription>Scope別・カテゴリ別の排出量</CardDescription>
              </CardHeader>
              <CardContent>
                <EmissionsOverview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>最近の活動</CardTitle>
                <CardDescription>直近のデータ登録・承認状況</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
