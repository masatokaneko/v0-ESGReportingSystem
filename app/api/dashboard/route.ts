import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 総排出量の計算
    const totalEmissions = await sql`
      SELECT 
        COALESCE(SUM(emission), 0) as total,
        COUNT(*) as entries
      FROM esg_entries
      WHERE status = 'approved'
    `

    // 今月と先月の比較
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

    const monthlyComparison = await sql`
      SELECT 
        EXTRACT(MONTH FROM date) as month,
        EXTRACT(YEAR FROM date) as year,
        SUM(emission) as total_emission
      FROM esg_entries
      WHERE status = 'approved'
        AND (
          (EXTRACT(MONTH FROM date) = ${currentMonth} AND EXTRACT(YEAR FROM date) = ${currentYear})
          OR
          (EXTRACT(MONTH FROM date) = ${lastMonth} AND EXTRACT(YEAR FROM date) = ${lastMonthYear})
        )
      GROUP BY EXTRACT(MONTH FROM date), EXTRACT(YEAR FROM date)
      ORDER BY year, month
    `

    // スコープ別排出量（簡易版）
    const scopeEmissions = await sql`
      SELECT 
        activity_type,
        SUM(emission) as total_emission
      FROM esg_entries
      WHERE status = 'approved'
      GROUP BY activity_type
    `

    // 承認待ちの件数
    const pendingApprovals = await sql`
      SELECT COUNT(*) as count
      FROM esg_entries
      WHERE status = 'pending'
    `

    // 最近のアクティビティ
    const recentActivities = await sql`
      SELECT 
        submitter as name,
        CASE 
          WHEN status = 'approved' THEN location || 'の' || activity_type || 'データを承認しました'
          WHEN status = 'pending' THEN location || 'の' || activity_type || 'データを登録しました'
          ELSE location || 'の' || activity_type || 'データを更新しました'
        END as action,
        CASE
          WHEN created_at >= NOW() - INTERVAL '1 hour' THEN EXTRACT(EPOCH FROM (NOW() - created_at))/60 || '分前'
          WHEN created_at >= NOW() - INTERVAL '1 day' THEN EXTRACT(EPOCH FROM (NOW() - created_at))/3600 || '時間前'
          ELSE TO_CHAR(created_at, 'MM/DD')
        END as date
      FROM esg_entries
      ORDER BY created_at DESC
      LIMIT 5
    `

    // 月別トレンドデータ（過去6ヶ月）
    const trendData = await sql`
      SELECT 
        TO_CHAR(date, 'MM月') as name,
        SUM(CASE WHEN activity_type IN ('electricity', 'gas', 'fuel') THEN emission ELSE 0 END) as "Scope 1",
        SUM(CASE WHEN activity_type = 'electricity' THEN emission ELSE 0 END) as "Scope 2",
        SUM(CASE WHEN activity_type IN ('water', 'waste') THEN emission ELSE 0 END) as "Scope 3"
      FROM esg_entries
      WHERE status = 'approved'
        AND date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY DATE_TRUNC('month', date)
    `

    // ソース別排出量
    const sourceData = await sql`
      SELECT 
        CASE activity_type
          WHEN 'electricity' THEN '電力'
          WHEN 'gas' THEN 'ガス'
          WHEN 'fuel' THEN '燃料'
          WHEN 'water' THEN '水'
          WHEN 'waste' THEN '廃棄物'
          ELSE activity_type
        END as name,
        SUM(emission) as value,
        CASE activity_type
          WHEN 'electricity' THEN 'hsl(12, 76%, 61%)'
          WHEN 'gas' THEN 'hsl(173, 58%, 39%)'
          WHEN 'fuel' THEN 'hsl(197, 37%, 24%)'
          WHEN 'water' THEN 'hsl(43, 74%, 66%)'
          WHEN 'waste' THEN 'hsl(27, 87%, 67%)'
          ELSE 'hsl(0, 0%, 50%)'
        END as color
      FROM esg_entries
      WHERE status = 'approved'
      GROUP BY activity_type
      ORDER BY value DESC
    `

    // 変化率の計算
    let changeFromLastMonth = 0
    if (monthlyComparison.rows.length >= 2) {
      const current = monthlyComparison.rows[1]?.total_emission || 0
      const previous = monthlyComparison.rows[0]?.total_emission || 0
      if (previous > 0) {
        changeFromLastMonth = ((current - previous) / previous) * 100
      }
    }

    const dashboard = {
      totalEmissions: Number(totalEmissions.rows[0].total) || 0,
      totalScope1: Number(scopeEmissions.rows.find(s => ['gas', 'fuel'].includes(s.activity_type))?.total_emission || 0),
      totalScope2: Number(scopeEmissions.rows.find(s => s.activity_type === 'electricity')?.total_emission || 0),
      totalScope3: Number(scopeEmissions.rows.find(s => ['water', 'waste'].includes(s.activity_type))?.total_emission || 0),
      changeFromLastMonth: Number(changeFromLastMonth.toFixed(1)),
      pendingApprovals: Number(pendingApprovals.rows[0].count),
      recentActivities: recentActivities.rows,
      trendData: trendData.rows,
      sourceData: sourceData.rows
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