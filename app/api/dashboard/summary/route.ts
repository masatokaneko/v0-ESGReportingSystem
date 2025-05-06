import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 1. 排出量概要データの取得（スコープ別合計）
    const { data: overviewData, error: overviewError } = await supabase.rpc("get_emissions_overview", {
      p_start_date: startDate,
      p_end_date: endDate,
    })

    if (overviewError) throw overviewError

    // 2. 排出源別データの取得（カテゴリ別）
    const { data: bySourceData, error: bySourceError } = await supabase.rpc("get_emissions_by_source", {
      p_start_date: startDate,
      p_end_date: endDate,
    })

    if (bySourceError) throw bySourceError

    // 3. 排出量推移データの取得（月別）
    const { data: trendData, error: trendError } = await supabase.rpc("get_emissions_trend", {
      p_start_date: startDate,
      p_end_date: endDate,
    })

    if (trendError) throw trendError

    // 4. 最近のアクティビティデータの取得
    const { data: recentActivityData, error: recentActivityError } = await supabase
      .from("data_entries")
      .select(`
        id,
        user_id,
        location_id,
        department_id,
        emission_factor_id,
        activity_date,
        activity_data,
        emissions,
        status,
        notes,
        rejection_reason,
        created_at,
        user_profiles(email),
        locations(name),
        departments(name),
        emission_factors(name, unit)
      `)
      .order("created_at", { ascending: false })
      .limit(10)

    if (recentActivityError) throw recentActivityError

    // データの整形
    const formattedRecentActivity = recentActivityData.map((entry: any) => ({
      id: entry.id,
      user_email: entry.user_profiles?.email || "-",
      location_name: entry.locations?.name || "-",
      department_name: entry.departments?.name || "-",
      emission_factor_name: entry.emission_factors?.name || "-",
      emission_factor_unit: entry.emission_factors?.unit || "-",
      activity_date: entry.activity_date,
      activity_data: entry.activity_data,
      emissions: entry.emissions,
      status: entry.status,
      notes: entry.notes,
      rejection_reason: entry.rejection_reason,
      created_at: entry.created_at,
    }))

    // 排出源別データの色の設定
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7300",
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#a4de6c",
      "#d0ed57",
      "#83a6ed",
      "#8dd1e1",
    ]

    const formattedBySourceData = {
      scope1: [],
      scope2: [],
      scope3: [],
      all: [],
    }

    // 排出源別データの整形
    bySourceData.forEach((item: any, index: number) => {
      const color = colors[index % colors.length]

      if (item.scope === "Scope1") {
        formattedBySourceData.scope1.push({
          name: item.category,
          value: item.emissions,
          color,
        })
      } else if (item.scope === "Scope2") {
        formattedBySourceData.scope2.push({
          name: item.category,
          value: item.emissions,
          color,
        })
      } else if (item.scope === "Scope3") {
        formattedBySourceData.scope3.push({
          name: item.category,
          value: item.emissions,
          color,
        })
      }

      formattedBySourceData.all.push({
        name: `${item.scope} - ${item.category}`,
        value: item.emissions,
        color,
      })
    })

    // 排出量推移データの整形
    const formattedTrendData = {
      monthly: [],
      quarterly: [],
      yearly: [],
    }

    // 月別データの整形
    const monthlyMap = new Map()
    trendData.forEach((item: any) => {
      const date = item.month_date
      if (!monthlyMap.has(date)) {
        monthlyMap.set(date, {
          date,
          scope1: 0,
          scope2: 0,
          scope3: 0,
          total: 0,
        })
      }

      const entry = monthlyMap.get(date)
      if (item.scope === "Scope1") {
        entry.scope1 += item.emissions
      } else if (item.scope === "Scope2") {
        entry.scope2 += item.emissions
      } else if (item.scope === "Scope3") {
        entry.scope3 += item.emissions
      }
      entry.total += item.emissions
    })

    formattedTrendData.monthly = Array.from(monthlyMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    // 四半期データの整形
    const quarterlyMap = new Map()
    trendData.forEach((item: any) => {
      const date = new Date(item.month_date)
      const quarter = Math.floor(date.getMonth() / 3)
      const quarterDate = new Date(date.getFullYear(), quarter * 3, 1).toISOString().split("T")[0]

      if (!quarterlyMap.has(quarterDate)) {
        quarterlyMap.set(quarterDate, {
          date: quarterDate,
          scope1: 0,
          scope2: 0,
          scope3: 0,
          total: 0,
        })
      }

      const entry = quarterlyMap.get(quarterDate)
      if (item.scope === "Scope1") {
        entry.scope1 += item.emissions
      } else if (item.scope === "Scope2") {
        entry.scope2 += item.emissions
      } else if (item.scope === "Scope3") {
        entry.scope3 += item.emissions
      }
      entry.total += item.emissions
    })

    formattedTrendData.quarterly = Array.from(quarterlyMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    // 年別データの整形
    const yearlyMap = new Map()
    trendData.forEach((item: any) => {
      const date = new Date(item.month_date)
      const year = date.getFullYear()
      const yearDate = `${year}`

      if (!yearlyMap.has(yearDate)) {
        yearlyMap.set(yearDate, {
          date: yearDate,
          scope1: 0,
          scope2: 0,
          scope3: 0,
          total: 0,
        })
      }

      const entry = yearlyMap.get(yearDate)
      if (item.scope === "Scope1") {
        entry.scope1 += item.emissions
      } else if (item.scope === "Scope2") {
        entry.scope2 += item.emissions
      } else if (item.scope === "Scope3") {
        entry.scope3 += item.emissions
      }
      entry.total += item.emissions
    })

    formattedTrendData.yearly = Array.from(yearlyMap.values()).sort((a, b) => a.date.localeCompare(b.date))

    // レスポンスの作成
    return NextResponse.json({
      overview: overviewData[0] || {
        scope1: 0,
        scope2: 0,
        scope3: 0,
        total: 0,
        previousPeriod: {
          scope1: 0,
          scope2: 0,
          scope3: 0,
          total: 0,
        },
      },
      bySource: formattedBySourceData,
      trend: formattedTrendData,
      recentActivity: formattedRecentActivity,
    })
  } catch (error) {
    console.error("Error in dashboard summary API:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
