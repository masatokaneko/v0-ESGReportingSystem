import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function GET() {
  try {
    console.log("Dashboard summary API called")

    // 総排出量
    const totalEmissionQuery = `
      SELECT COALESCE(SUM(emission), 0) as total_emission
      FROM data_entries
      WHERE status = 'approved'
    `
    const totalEmissionResult = await executeQuery(totalEmissionQuery)

    if (!totalEmissionResult.success) {
      console.error("Error fetching total emission:", totalEmissionResult.error)
      throw new Error(`Failed to fetch total emission: ${totalEmissionResult.error}`)
    }

    // スコープ別データの集計（仮のデータ）
    const totalEmission = Number(totalEmissionResult.data?.[0]?.total_emission || 0)
    const scopeData = {
      scope1: Number((totalEmission * 0.3).toFixed(2)),
      scope2: Number((totalEmission * 0.4).toFixed(2)),
      scope3: Number((totalEmission * 0.3).toFixed(2)),
    }

    // 排出源別データの取得
    const sourceQuery = `
      SELECT 
        activity_type as name,
        COALESCE(SUM(emission), 0) as value
      FROM data_entries
      WHERE status = 'approved'
      GROUP BY activity_type
      ORDER BY value DESC
    `
    const sourceResult = await executeQuery(sourceQuery)

    if (!sourceResult.success) {
      console.error("Error fetching emissions by source:", sourceResult.error)
      throw new Error(`Failed to fetch emissions by source: ${sourceResult.error}`)
    }

    // 数値型に変換して確実に正しい形式にする
    const emissionsBySource = (sourceResult.data || []).map((item) => ({
      name: item.name || "不明",
      value: Number(item.value) || 0,
    }))

    // 月別排出量トレンドの取得
    const trendQuery = `
      SELECT 
        TO_CHAR(entry_date, 'YYYY-MM') as month,
        COALESCE(SUM(emission), 0) as emissions
      FROM data_entries
      WHERE 
        status = 'approved' AND
        entry_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month
    `
    const trendResult = await executeQuery(trendQuery)

    if (!trendResult.success) {
      console.error("Error fetching emissions trend:", trendResult.error)
      throw new Error(`Failed to fetch emissions trend: ${trendResult.error}`)
    }

    // 数値型に変換
    const emissionsTrend = (trendResult.data || []).map((item) => ({
      month: item.month,
      emissions: Number(item.emissions) || 0,
    }))

    // 最近のアクティビティの取得
    const activityQuery = `
      SELECT 
        id,
        activity_type,
        submitter,
        status,
        emission,
        updated_at as timestamp
      FROM data_entries
      ORDER BY updated_at DESC
      LIMIT 5
    `
    const activityResult = await executeQuery(activityQuery)

    if (!activityResult.success) {
      console.error("Error fetching recent activities:", activityResult.error)
      throw new Error(`Failed to fetch recent activities: ${activityResult.error}`)
    }

    const recentActivities = (activityResult.data || []).map((entry) => ({
      id: entry.id,
      action: entry.activity_type || "データ",
      user: entry.submitter || "システム",
      timestamp: entry.timestamp,
      details: `排出量: ${Number(entry.emission) || 0} kg-CO2e`,
      status: entry.status,
    }))

    // レスポンスの構築
    return NextResponse.json(
      {
        totalEmission,
        scopeData,
        emissionsBySource,
        emissionsTrend,
        recentActivities,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("Error in dashboard summary API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
        message: error instanceof Error ? error.message : "Unknown error",
        totalEmission: 0,
        scopeData: {
          scope1: 0,
          scope2: 0,
          scope3: 0,
        },
        emissionsBySource: [],
        emissionsTrend: [],
        recentActivities: [],
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  }
}
