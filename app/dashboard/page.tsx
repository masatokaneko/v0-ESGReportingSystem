"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { EmissionsOverview } from "@/components/dashboard/emissions-overview"
import { EmissionsBySource } from "@/components/dashboard/emissions-by-source"
import { EmissionsTrend } from "@/components/dashboard/emissions-trend"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { mockDB } from "@/lib/mock-data-store"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("year")
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [dashboardData, setDashboardData] = useState<any>(null)
  const { toast } = useToast()

  // ダッシュボードデータの取得
  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // 期間の設定
      let startDate, endDate
      const currentYear = new Date().getFullYear()

      if (period === "year") {
        startDate = `${year}-01-01`
        endDate = `${year}-12-31`
      } else if (period === "quarter") {
        const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1
        const quarterStartMonth = (currentQuarter - 1) * 3
        startDate = `${currentYear}-${(quarterStartMonth + 1).toString().padStart(2, "0")}-01`

        const nextQuarterStartMonth = quarterStartMonth + 3
        const nextQuarterStartYear = nextQuarterStartMonth >= 12 ? currentYear + 1 : currentYear
        const nextQuarterMonth = (nextQuarterStartMonth % 12) + 1
        endDate = `${nextQuarterStartYear}-${nextQuarterMonth.toString().padStart(2, "0")}-01`

        // 前日に設定
        const endDateObj = new Date(endDate)
        endDateObj.setDate(endDateObj.getDate() - 1)
        endDate = endDateObj.toISOString().split("T")[0]
      } else {
        // month
        const currentMonth = new Date().getMonth() + 1
        startDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-01`

        // 月末を計算
        const lastDay = new Date(currentYear, currentMonth, 0).getDate()
        endDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${lastDay}`
      }

      // モックデータストアからデータを取得
      const data = mockDB.getDashboardSummary(startDate, endDate)
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "エラー",
        description: "ダッシュボードデータの取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [period, year])

  // 年の選択肢を生成
  const yearOptions = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear - 5; i <= currentYear; i++) {
    yearOptions.push(i.toString())
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>

        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Tabs defaultValue="year" value={period} onValueChange={setPeriod} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="month">月次</TabsTrigger>
              <TabsTrigger value="quarter">四半期</TabsTrigger>
              <TabsTrigger value="year">年次</TabsTrigger>
            </TabsList>
          </Tabs>

          {period === "year" && (
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="年を選択" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>排出量概要</CardTitle>
            <CardDescription>スコープ別の排出量合計</CardDescription>
          </CardHeader>
          <CardContent>
            <EmissionsOverview data={dashboardData?.overview} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>排出源別内訳</CardTitle>
            <CardDescription>カテゴリ別の排出量割合</CardDescription>
          </CardHeader>
          <CardContent>
            <EmissionsBySource data={dashboardData?.bySource} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>排出量推移</CardTitle>
            <CardDescription>月別の排出量推移</CardDescription>
          </CardHeader>
          <CardContent>
            <EmissionsTrend data={dashboardData?.trend} isLoading={isLoading} period={period} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>最近のアクティビティ</CardTitle>
            <CardDescription>最近の排出量データ登録</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity data={dashboardData?.recentActivity} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
