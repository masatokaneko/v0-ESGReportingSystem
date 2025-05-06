import { NextResponse } from "next/server"
import { mockDataStore } from "@/lib/mock-data-store"

export async function GET() {
  try {
    // カテゴリ別データを取得
    const categoryData = mockDataStore.getEmissionsByCategory()

    // 拠点別データを取得
    const locationData = mockDataStore.getEmissionsByLocation()

    // 部門別データを取得
    const departmentData = mockDataStore.getEmissionsByDepartment()

    return NextResponse.json({
      success: true,
      categoryData,
      locationData,
      departmentData,
    })
  } catch (error) {
    console.error("Error fetching emissions by source data:", error)
    return NextResponse.json({ success: false, message: "データの取得中にエラーが発生しました" }, { status: 500 })
  }
}
