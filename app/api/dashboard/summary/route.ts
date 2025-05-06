import { NextResponse } from "next/server"
import { mockDataStore } from "@/lib/mock-data-store"

export async function GET() {
  try {
    // 現在の期間の排出量サマリーを取得
    const summary = mockDataStore.getSummaryByScope()

    // 拠点別サマリーを取得
    const locationSummary = mockDataStore.getEmissionsByLocation()

    // 部門別サマリーを取得
    const departmentSummary = mockDataStore.getEmissionsByDepartment()

    // 前期間のサマリー（モックデータ）
    const previousPeriodSummary = {
      scope1: summary.scope1 * 0.9, // 10%減少と仮定
      scope2: summary.scope2 * 1.1, // 10%増加と仮定
      scope3: summary.scope3 * 0.95, // 5%減少と仮定
      total: 0,
    }
    previousPeriodSummary.total =
      previousPeriodSummary.scope1 + previousPeriodSummary.scope2 + previousPeriodSummary.scope3

    return NextResponse.json({
      success: true,
      summary,
      locationSummary,
      departmentSummary,
      previousPeriodSummary,
    })
  } catch (error) {
    console.error("Error fetching dashboard summary data:", error)
    return NextResponse.json({ success: false, message: "データの取得中にエラーが発生しました" }, { status: 500 })
  }
}
