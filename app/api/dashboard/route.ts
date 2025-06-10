import { createServerSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // 総排出量の計算
    const { data: totalData, error: totalError } = await supabase
      .from('esg_entries')
      .select('emission')
      .eq('status', 'approved')

    if (totalError) throw totalError

    const totalEmissions = totalData?.reduce((sum, entry) => sum + entry.emission, 0) || 0
    const entriesCount = totalData?.length || 0

    // 今月と先月の比較
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

    const currentMonthStart = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`
    const lastMonthStart = `${lastMonthYear}-${lastMonth.toString().padStart(2, '0')}-01`
    const lastMonthEnd = new Date(lastMonthYear, lastMonth, 0).toISOString().split('T')[0]

    const { data: currentMonthData } = await supabase
      .from('esg_entries')
      .select('emission')
      .eq('status', 'approved')
      .gte('date', currentMonthStart)

    const { data: lastMonthData } = await supabase
      .from('esg_entries')
      .select('emission')
      .eq('status', 'approved')
      .gte('date', lastMonthStart)
      .lte('date', lastMonthEnd)

    const currentMonthTotal = currentMonthData?.reduce((sum, entry) => sum + entry.emission, 0) || 0
    const lastMonthTotal = lastMonthData?.reduce((sum, entry) => sum + entry.emission, 0) || 0

    // スコープ別排出量
    const { data: scopeData, error: scopeError } = await supabase
      .from('esg_entries')
      .select('activity_type, emission')
      .eq('status', 'approved')

    if (scopeError) throw scopeError

    const scopeEmissions = scopeData?.reduce((acc, entry) => {
      if (!acc[entry.activity_type]) {
        acc[entry.activity_type] = 0
      }
      acc[entry.activity_type] += entry.emission
      return acc
    }, {} as Record<string, number>) || {}

    // 承認待ちの件数
    const { count: pendingCount, error: pendingError } = await supabase
      .from('esg_entries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (pendingError) throw pendingError

    // 最近のアクティビティ
    const { data: recentData, error: recentError } = await supabase
      .from('esg_entries')
      .select('submitter, location, activity_type, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentError) throw recentError

    const recentActivities = recentData?.map(entry => {
      const timeDiff = Date.now() - new Date(entry.created_at).getTime()
      const hours = Math.floor(timeDiff / (1000 * 60 * 60))
      const minutes = Math.floor(timeDiff / (1000 * 60))
      
      let timeString
      if (minutes < 60) {
        timeString = `${minutes}分前`
      } else if (hours < 24) {
        timeString = `${hours}時間前`
      } else {
        const date = new Date(entry.created_at)
        timeString = `${date.getMonth() + 1}/${date.getDate()}`
      }

      const activityMap: Record<string, string> = {
        electricity: '電力',
        gas: 'ガス',
        fuel: '燃料',
        water: '水',
        waste: '廃棄物'
      }

      const actionText = entry.status === 'approved' 
        ? `${entry.location}の${activityMap[entry.activity_type] || entry.activity_type}データを承認しました`
        : `${entry.location}の${activityMap[entry.activity_type] || entry.activity_type}データを登録しました`

      return {
        name: entry.submitter,
        action: actionText,
        date: timeString
      }
    }) || []

    // 月別トレンドデータ（過去6ヶ月）
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const sixMonthsAgoString = sixMonthsAgo.toISOString().split('T')[0]

    const { data: trendData, error: trendError } = await supabase
      .from('esg_entries')
      .select('date, activity_type, emission')
      .eq('status', 'approved')
      .gte('date', sixMonthsAgoString)

    if (trendError) throw trendError

    // 月別集計
    const monthlyData: Record<string, { scope1: number, scope2: number, scope3: number }> = {}
    
    trendData?.forEach(entry => {
      const date = new Date(entry.date)
      const monthKey = `${date.getMonth() + 1}月`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { scope1: 0, scope2: 0, scope3: 0 }
      }
      
      if (['gas', 'fuel'].includes(entry.activity_type)) {
        monthlyData[monthKey].scope1 += entry.emission
      } else if (entry.activity_type === 'electricity') {
        monthlyData[monthKey].scope2 += entry.emission
      } else if (['water', 'waste'].includes(entry.activity_type)) {
        monthlyData[monthKey].scope3 += entry.emission
      }
    })

    const trendDataArray = Object.entries(monthlyData).map(([name, data]) => ({
      name,
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
      pendingApprovals: pendingCount || 0,
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