import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// ダッシュボード用のサマリーデータを取得するAPI
export async function GET() {
  try {
    // 総排出量
    const { data: totalEmission, error: totalEmissionError } = await supabaseServer
      .from("data_entries")
      .select("emission")

    if (totalEmissionError) {
      return NextResponse.json({ error: totalEmissionError.message }, { status: 500 })
    }

    const total = totalEmission.reduce((sum, item) => sum + (item.emission || 0), 0)

    // Scope別排出量 - テーブル名を修正
    const { data: scopeEmissions, error: scopeEmissionsError } = await supabaseServer.from("data_entries").select(`
        emission,
        emission_factors!inner(category)
      `)

    if (scopeEmissionsError) {
      return NextResponse.json({ error: scopeEmissionsError.message }, { status: 500 })
    }

    const scopeData = {
      scope1: 0,
      scope2: 0,
      scope3: 0,
    }

    scopeEmissions.forEach((item) => {
      if (!item.emission_factors || !item.emission) return

      const category = item.emission_factors.category || ""
      if (category.startsWith("Scope 1")) {
        scopeData.scope1 += item.emission
      } else if (category.startsWith("Scope 2")) {
        scopeData.scope2 += item.emission
      } else if (category.startsWith("Scope 3")) {
        scopeData.scope3 += item.emission
      }
    })

    // 最近の活動
    const { data: recentActivities, error: recentActivitiesError } = await supabaseServer
      .from("data_entries")
      .select(
        `
        id,
        entry_date,
        activity_type,
        status,
        submitter,
        created_at,
        approved_by,
        approved_at,
        location:location_id(name),
        department:department_id(name)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentActivitiesError) {
      return NextResponse.json({ error: recentActivitiesError.message }, { status: 500 })
    }

    // nullチェックを追加
    const safeRecentActivities = recentActivities.map((activity) => ({
      ...activity,
      location: activity.location || { name: "不明" },
      department: activity.department || { name: "不明" },
      submitter: activity.submitter || "不明",
      activity_type: activity.activity_type || "不明",
      status: activity.status || "pending",
      created_at: activity.created_at || new Date().toISOString(),
    }))

    // 排出源別データ
    const { data: emissionsBySource, error: emissionsBySourceError } = await supabaseServer
      .from("data_entries")
      .select("activity_type, emission")

    if (emissionsBySourceError) {
      return NextResponse.json({ error: emissionsBySourceError.message }, { status: 500 })
    }

    const sourceData: Record<string, number> = {}
    emissionsBySource.forEach((item) => {
      if (!item.activity_type || !item.emission) return

      if (sourceData[item.activity_type]) {
        sourceData[item.activity_type] += item.emission
      } else {
        sourceData[item.activity_type] = item.emission
      }
    })

    // 月別排出量データ - テーブル名を修正
    const { data: monthlyEmissions, error: monthlyEmissionsError } = await supabaseServer.from("data_entries").select(`
        entry_date,
        emission,
        emission_factors!inner(category)
      `)

    if (monthlyEmissionsError) {
      return NextResponse.json({ error: monthlyEmissionsError.message }, { status: 500 })
    }

    const monthlyData: Record<string, { scope1: number; scope2: number; scope3: number }> = {}
    const currentYear = new Date().getFullYear()

    // 過去12ヶ月分のデータを初期化
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1)
      const monthKey = date.toLocaleString("ja-JP", { month: "long" })
      monthlyData[monthKey] = { scope1: 0, scope2: 0, scope3: 0 }
    }

    monthlyEmissions.forEach((item) => {
      if (!item.entry_date || !item.emission_factors || !item.emission) return

      try {
        const date = new Date(item.entry_date)
        const monthKey = date.toLocaleString("ja-JP", { month: "long" })

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { scope1: 0, scope2: 0, scope3: 0 }
        }

        const category = item.emission_factors.category || ""
        if (category.startsWith("Scope 1")) {
          monthlyData[monthKey].scope1 += item.emission
        } else if (category.startsWith("Scope 2")) {
          monthlyData[monthKey].scope2 += item.emission
        } else if (category.startsWith("Scope 3")) {
          monthlyData[monthKey].scope3 += item.emission
        }
      } catch (error) {
        console.error("Error processing monthly data:", error)
      }
    })

    return NextResponse.json({
      totalEmission: total,
      scopeData,
      recentActivities: safeRecentActivities,
      sourceData,
      monthlyData,
    })
  } catch (error) {
    console.error("Dashboard summary error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
