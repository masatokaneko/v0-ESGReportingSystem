import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-data-store"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 })
    }

    // モックデータストアからダッシュボードデータを取得
    const dashboardData = mockDB.getDashboardSummary(startDate, endDate)

    // レスポンスの作成
    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error in dashboard summary API:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
