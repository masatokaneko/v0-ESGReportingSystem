import { NextResponse } from "next/server"
import { mockDataStore } from "@/lib/mock-data-store"

export async function GET() {
  try {
    // 排出量推移データを取得
    const trendData = mockDataStore.getEmissionsTrend()

    return NextResponse.json({
      success: true,
      trendData,
    })
  } catch (error) {
    console.error("Error fetching emissions trend data:", error)
    return NextResponse.json({ success: false, message: "データの取得中にエラーが発生しました" }, { status: 500 })
  }
}
