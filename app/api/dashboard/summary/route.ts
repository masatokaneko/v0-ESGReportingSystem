import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"
import { logDatabaseConnectionError } from "@/lib/db-error-logger"

export async function GET() {
  try {
    // 総排出量
    const totalEmissionsQuery = `
      SELECT COALESCE(SUM(emission), 0) as total_emissions
      FROM data_entries
      WHERE status = 'approved'
    `
    const totalEmissionsResult = await executeQuery(totalEmissionsQuery)

    // 活動タイプ別の排出量
    const emissionsBySourceQuery = `
      SELECT activity_type, COALESCE(SUM(emission), 0) as total
      FROM data_entries
      WHERE status = 'approved'
      GROUP BY activity_type
      ORDER BY total DESC
    `
    const emissionsBySourceResult = await executeQuery(emissionsBySourceQuery)

    // 月別の排出量トレンド（過去12ヶ月）
    const emissionsTrendQuery = `
      SELECT 
        DATE_TRUNC('month', entry_date) as month,
        COALESCE(SUM(emission), 0) as total
      FROM data_entries
      WHERE 
        status = 'approved' AND
        entry_date >= DATE_TRUNC('month', NOW()) - INTERVAL '11 months'
      GROUP BY month
      ORDER BY month
    `
    const emissionsTrendResult = await executeQuery(emissionsTrendQuery)

    // 最近の活動
    const recentActivityQuery = `
      SELECT 
        de.id,
        de.entry_date,
        de.activity_type,
        de.activity_amount,
        de.emission,
        de.status,
        de.created_at,
        l.name as location_name,
        d.name as department_name
      FROM data_entries de
      LEFT JOIN locations l ON de.location_id = l.id
      LEFT JOIN departments d ON de.department_id = d.id
      ORDER BY de.created_at DESC
      LIMIT 10
    `
    const recentActivityResult = await executeQuery(recentActivityQuery)

    // 承認待ちの件数
    const pendingApprovalQuery = `
      SELECT COUNT(*) as count
      FROM data_entries
      WHERE status = 'pending'
    `
    const pendingApprovalResult = await executeQuery(pendingApprovalQuery)

    if (
      !totalEmissionsResult.success ||
      !emissionsBySourceResult.success ||
      !emissionsTrendResult.success ||
      !recentActivityResult.success ||
      !pendingApprovalResult.success
    ) {
      const error = new Error("One or more dashboard queries failed")
      await logDatabaseConnectionError(error, { endpoint: "/api/dashboard/summary" })
      return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
    }

    return NextResponse.json({
      totalEmissions: totalEmissionsResult.data?.[0]?.total_emissions || 0,
      emissionsBySource: emissionsBySourceResult.data || [],
      emissionsTrend: emissionsTrendResult.data || [],
      recentActivity: recentActivityResult.data || [],
      pendingApprovalCount: pendingApprovalResult.data?.[0]?.count || 0,
    })
  } catch (error) {
    await logDatabaseConnectionError(error as Error, { endpoint: "/api/dashboard/summary" })
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
