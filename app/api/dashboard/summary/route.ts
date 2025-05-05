import { NextResponse } from "next/server"
import { isSupabaseServerInitialized, getSupabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    // Supabaseクライアントが初期化されていない場合はダミーデータを返す
    if (!isSupabaseServerInitialized()) {
      return NextResponse.json({
        emissions: {
          totalEmissions: 0,
          monthlyChange: 0,
          yearlyChange: 0,
          unit: "tCO2e",
        },
        emissionsBySource: [],
        emissionsTrend: [],
        recentActivities: [],
      })
    }

    const supabase = getSupabaseServer()

    // 総排出量の取得 - 'emission'カラムを使用
    const { data: emissionsData, error: emissionsError } = await supabase
      .from("data_entries")
      .select("emission, emission_factors!inner(factor, category)")
      .eq("status", "approved")

    if (emissionsError) {
      console.error("Error fetching emissions data:", emissionsError)
      throw new Error(`Failed to fetch emissions data: ${emissionsError.message}`)
    }

    // 排出量の計算 - 直接'emission'カラムを使用
    const totalEmissions = emissionsData.reduce((sum, entry) => {
      return sum + (entry.emission || 0)
    }, 0)

    // 排出源別データの取得 - 'name'カラムを使用せず、'category'を使用
    const { data: sourceData, error: sourceError } = await supabase
      .from("data_entries")
      .select(`
        emission,
        activity_type,
        emission_factors!inner(id, factor, category)
      `)
      .eq("status", "approved")

    if (sourceError) {
      console.error("Error fetching source data:", sourceError)
      throw new Error(`Failed to fetch source data: ${sourceError.message}`)
    }

    // 排出源別データの集計 - activity_typeを使用
    const sourceMap = new Map()
    sourceData.forEach((entry) => {
      const category = entry.activity_type || "その他"
      const value = entry.emission || 0

      if (sourceMap.has(category)) {
        sourceMap.set(category, sourceMap.get(category) + value)
      } else {
        sourceMap.set(category, value)
      }
    })

    const emissionsBySource = Array.from(sourceMap.entries()).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }))

    // 月別排出量トレンドの取得
    const { data: trendData, error: trendError } = await supabase
      .from("data_entries")
      .select(`
        emission,
        entry_date,
        emission_factors!inner(factor, category)
      `)
      .eq("status", "approved")
      .order("entry_date", { ascending: true })

    if (trendError) {
      console.error("Error fetching trend data:", trendError)
      throw new Error(`Failed to fetch trend data: ${trendError.message}`)
    }

    // 月別データの集計 - entry_dateを使用
    const trendMap = new Map()
    trendData.forEach((entry) => {
      if (!entry.entry_date) return

      const date = new Date(entry.entry_date)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const value = entry.emission || 0

      if (trendMap.has(monthYear)) {
        trendMap.set(monthYear, trendMap.get(monthYear) + value)
      } else {
        trendMap.set(monthYear, value)
      }
    })

    const emissionsTrend = Array.from(trendMap.entries())
      .map(([month, value]) => ({
        month,
        emissions: Number(value.toFixed(2)),
      }))
      .slice(-12) // 直近12ヶ月のデータのみ

    // 最近のアクティビティの取得 - 'name'カラムを使用せず、'category'を使用
    const { data: activityData, error: activityError } = await supabase
      .from("data_entries")
      .select(`
        id,
        emission,
        status,
        created_at,
        updated_at,
        submitter,
        activity_type,
        emission_factors!inner(category)
      `)
      .order("updated_at", { ascending: false })
      .limit(5)

    if (activityError) {
      console.error("Error fetching activity data:", activityError)
      throw new Error(`Failed to fetch activity data: ${activityError.message}`)
    }

    const recentActivities = activityData.map((entry) => ({
      id: entry.id,
      action: `${entry.activity_type || "データ"} (${entry.emission_factors?.category || "未分類"})`,
      user: entry.submitter || "システム",
      timestamp: entry.updated_at || entry.created_at,
      details: `排出量: ${entry.emission || 0} kg-CO2e`,
      status: entry.status,
    }))

    // 月次変化率の計算（ダミーデータ）
    const monthlyChange = 5.2
    const yearlyChange = 12.5

    return NextResponse.json({
      emissions: {
        totalEmissions: Number(totalEmissions.toFixed(2)),
        monthlyChange,
        yearlyChange,
        unit: "kg-CO2e",
      },
      emissionsBySource,
      emissionsTrend,
      recentActivities,
    })
  } catch (error) {
    console.error("Error in dashboard summary API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
