import { db } from '@/lib/neon'
import { esgEntries } from '@/lib/database.schema'
import { NextResponse } from 'next/server'
import { eq, gte, lte, and, desc, sql } from 'drizzle-orm'

export async function GET() {
  try {
    // 総排出量の計算
    const totalData = await db
      .select({
        emission: esgEntries.calculatedEmissions
      })
      .from(esgEntries)
      .where(sql`${esgEntries.metadata}->>'status' = 'approved'`)

    const totalEmissions = totalData?.reduce((sum, entry) => sum + Number(entry.emission || 0), 0) || 0
    const entriesCount = totalData?.length || 0

    // 今月と先月の比較
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

    const currentMonthStart = new Date(currentYear, currentMonth - 1, 1)
    const lastMonthStart = new Date(lastMonthYear, lastMonth - 1, 1)
    const lastMonthEnd = new Date(lastMonthYear, lastMonth, 0)

    const currentMonthData = await db
      .select({
        emission: esgEntries.calculatedEmissions
      })
      .from(esgEntries)
      .where(
        and(
          sql`${esgEntries.metadata}->>'status' = 'approved'`,
          gte(esgEntries.date, currentMonthStart)
        )
      )

    const lastMonthData = await db
      .select({
        emission: esgEntries.calculatedEmissions
      })
      .from(esgEntries)
      .where(
        and(
          sql`${esgEntries.metadata}->>'status' = 'approved'`,
          gte(esgEntries.date, lastMonthStart),
          lte(esgEntries.date, lastMonthEnd)
        )
      )

    const currentMonthTotal = currentMonthData?.reduce((sum, entry) => sum + Number(entry.emission || 0), 0) || 0
    const lastMonthTotal = lastMonthData?.reduce((sum, entry) => sum + Number(entry.emission || 0), 0) || 0

    // スコープ別排出量
    const scopeData = await db
      .select({
        activityType: esgEntries.subcategory,
        emission: esgEntries.calculatedEmissions
      })
      .from(esgEntries)
      .where(sql`${esgEntries.metadata}->>'status' = 'approved'`)

    const scopeEmissions = scopeData?.reduce((acc, entry) => {
      if (!acc[entry.activityType]) {
        acc[entry.activityType] = 0
      }
      acc[entry.activityType] += Number(entry.emission || 0)
      return acc
    }, {} as Record<string, number>) || {}

    // 承認待ちの件数
    const pendingData = await db
      .select({ count: sql<number>`count(*)` })
      .from(esgEntries)
      .where(sql`${esgEntries.metadata}->>'status' = 'pending'`)

    const pendingCount = pendingData[0]?.count || 0

    // 最近のアクティビティ
    const recentData = await db
      .select({
        submitter: esgEntries.metadata,
        locationId: esgEntries.locationId,
        activityType: esgEntries.subcategory,
        status: esgEntries.metadata,
        createdAt: esgEntries.createdAt
      })
      .from(esgEntries)
      .orderBy(desc(esgEntries.createdAt))
      .limit(5)

    const recentActivities = recentData?.map(entry => {
      const timeDiff = Date.now() - new Date(entry.createdAt).getTime()
      const hours = Math.floor(timeDiff / (1000 * 60 * 60))
      const minutes = Math.floor(timeDiff / (1000 * 60))
      
      let timeString
      if (minutes < 60) {
        timeString = `${minutes}分前`
      } else if (hours < 24) {
        timeString = `${hours}時間前`
      } else {
        const date = new Date(entry.createdAt)
        timeString = `${date.getMonth() + 1}/${date.getDate()}`
      }

      const activityMap: Record<string, string> = {
        electricity: '電力',
        gas: 'ガス',
        fuel: '燃料',
        water: '水',
        waste: '廃棄物'
      }

      const metadata = entry.submitter as any || {}
      const status = entry.status as any || {}
      const actionText = status.status === 'approved' 
        ? `Location ${entry.locationId}の${activityMap[entry.activityType] || entry.activityType}データを承認しました`
        : `Location ${entry.locationId}の${activityMap[entry.activityType] || entry.activityType}データを登録しました`

      return {
        name: metadata.submitter || 'Unknown',
        action: actionText,
        date: timeString
      }
    }) || []

    // 月別トレンドデータ（過去12ヶ月のデータを取得）
    const trendData = await db
      .select({
        date: esgEntries.date,
        activityType: esgEntries.subcategory,
        emission: esgEntries.calculatedEmissions
      })
      .from(esgEntries)
      .where(
        and(
          sql`${esgEntries.metadata}->>'status' = 'approved'`,
          gte(esgEntries.date, new Date('2024-01-01'))
        )
      )
      .orderBy(esgEntries.date)

    // 月別集計（年月をキーとして使用）
    const monthlyData: Record<string, { scope1: number, scope2: number, scope3: number, year: number, month: number }> = {}
    
    trendData?.forEach(entry => {
      const date = new Date(entry.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { scope1: 0, scope2: 0, scope3: 0, year, month }
      }
      
      const emission = Number(entry.emission || 0)
      if (['gas', 'fuel'].includes(entry.activityType)) {
        monthlyData[monthKey].scope1 += emission
      } else if (entry.activityType === 'electricity') {
        monthlyData[monthKey].scope2 += emission
      } else if (['water', 'waste'].includes(entry.activityType)) {
        monthlyData[monthKey].scope3 += emission
      }
    })

    // 月別データを時系列順に並べて、表示用の名前に変換
    const trendDataArray = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))  // 年月順でソート
      .map(([key, data]) => ({
        name: `${data.year}年${data.month}月`,
        "Scope 1": Number(data.scope1.toFixed(2)),
        "Scope 2": Number(data.scope2.toFixed(2)),
        "Scope 3": Number(data.scope3.toFixed(2))
      }))

    // ソース別排出量
    const activityTypeMap: Record<string, { name: string, color: string }> = {
      electricity: { name: '電力', color: 'hsl(12, 76%, 61%)' },
      gas: { name: 'ガス', color: 'hsl(173, 58%, 39%)' },
      fuel: { name: '燃料', color: 'hsl(197, 37%, 24%)' },
      water: { name: '水', color: 'hsl(43, 74%, 66%)' },
      waste: { name: '廃棄物', color: 'hsl(27, 87%, 67%)' }
    }

    const sourceData = Object.entries(scopeEmissions)
      .map(([activityType, value]) => ({
        name: activityTypeMap[activityType]?.name || activityType,
        value: Number(value.toFixed(2)),
        color: activityTypeMap[activityType]?.color || 'hsl(0, 0%, 50%)'
      }))
      .sort((a, b) => b.value - a.value)

    // 変化率の計算
    let changeFromLastMonth = 0
    if (lastMonthTotal > 0) {
      changeFromLastMonth = Number((((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1))
    }

    const dashboard = {
      totalEmissions: Number(totalEmissions.toFixed(2)),
      totalScope1: Number((scopeEmissions.gas || 0) + (scopeEmissions.fuel || 0)).toFixed(2),
      totalScope2: Number(scopeEmissions.electricity || 0).toFixed(2),
      totalScope3: Number((scopeEmissions.water || 0) + (scopeEmissions.waste || 0)).toFixed(2),
      changeFromLastMonth,
      pendingApprovals: pendingCount,
      recentActivities,
      trendData: trendDataArray,
      sourceData
    }

    return NextResponse.json(dashboard)
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}