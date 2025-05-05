import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"
import { testDatabaseConnection, checkTableExists } from "@/lib/db-utils"
import { logServerError } from "@/lib/error-logger"

export async function GET() {
  try {
    console.log("Dashboard summary API called")

    // データベース接続をテスト
    const connectionTest = await testDatabaseConnection()
    if (!connectionTest.connected) {
      console.error("Database connection failed:", connectionTest.error)
      return NextResponse.json(
        {
          error: "Database connection failed",
          message: connectionTest.error,
          totalEmission: 0,
          scopeData: { scope1: 0, scope2: 0, scope3: 0 },
          emissionsBySource: [],
          emissionsTrend: [],
          recentActivities: [],
        },
        { status: 500 },
      )
    }

    // data_entriesテーブルが存在するか確認
    const tableExists = await checkTableExists("data_entries")
    if (!tableExists.exists) {
      console.error("data_entries table does not exist:", tableExists.error)
      return NextResponse.json(
        {
          error: "Required table does not exist",
          message: "data_entries table not found in database",
          totalEmission: 0,
          scopeData: { scope1: 0, scope2: 0, scope3: 0 },
          emissionsBySource: [],
          emissionsTrend: [],
          recentActivities: [],
        },
        { status: 500 },
      )
    }

    // 総排出量
    const totalEmissionQuery = `
      SELECT COALESCE(SUM(emission), 0) as total_emission
      FROM data_entries
      WHERE status = 'approved'
    `

    try {
      const totalEmissionResult = await executeQuery(totalEmissionQuery)

      if (!totalEmissionResult.success) {
        console.error("Error fetching total emission:", totalEmissionResult.error)
        return NextResponse.json(
          {
            error: `Failed to fetch total emission: ${totalEmissionResult.error}`,
            totalEmission: 0,
            scopeData: { scope1: 0, scope2: 0, scope3: 0 },
            emissionsBySource: [],
            emissionsTrend: [],
            recentActivities: [],
          },
          { status: 500 },
        )
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

      try {
        const sourceResult = await executeQuery(sourceQuery)

        if (!sourceResult.success) {
          console.error("Error fetching emissions by source:", sourceResult.error)
          return NextResponse.json(
            {
              error: `Failed to fetch emissions by source: ${sourceResult.error}`,
              totalEmission,
              scopeData,
              emissionsBySource: [],
              emissionsTrend: [],
              recentActivities: [],
            },
            { status: 500 },
          )
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

        try {
          const trendResult = await executeQuery(trendQuery)

          if (!trendResult.success) {
            console.error("Error fetching emissions trend:", trendResult.error)
            return NextResponse.json(
              {
                error: `Failed to fetch emissions trend: ${trendResult.error}`,
                totalEmission,
                scopeData,
                emissionsBySource,
                emissionsTrend: [],
                recentActivities: [],
              },
              { status: 500 },
            )
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

          try {
            const activityResult = await executeQuery(activityQuery)

            if (!activityResult.success) {
              console.error("Error fetching recent activities:", activityResult.error)
              return NextResponse.json(
                {
                  error: `Failed to fetch recent activities: ${activityResult.error}`,
                  totalEmission,
                  scopeData,
                  emissionsBySource,
                  emissionsTrend,
                  recentActivities: [],
                },
                { status: 500 },
              )
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
          } catch (activityError) {
            await logServerError(activityError, { query: "activity query" })
            console.error("Error in activity query:", activityError)
            return NextResponse.json(
              {
                error: "Error in activity query",
                message: activityError instanceof Error ? activityError.message : "Unknown error",
                totalEmission,
                scopeData,
                emissionsBySource,
                emissionsTrend,
                recentActivities: [],
              },
              { status: 500 },
            )
          }
        } catch (trendError) {
          await logServerError(trendError, { query: "trend query" })
          console.error("Error in trend query:", trendError)
          return NextResponse.json(
            {
              error: "Error in trend query",
              message: trendError instanceof Error ? trendError.message : "Unknown error",
              totalEmission,
              scopeData,
              emissionsBySource,
              emissionsTrend: [],
              recentActivities: [],
            },
            { status: 500 },
          )
        }
      } catch (sourceError) {
        await logServerError(sourceError, { query: "source query" })
        console.error("Error in source query:", sourceError)
        return NextResponse.json(
          {
            error: "Error in source query",
            message: sourceError instanceof Error ? sourceError.message : "Unknown error",
            totalEmission,
            scopeData,
            emissionsBySource: [],
            emissionsTrend: [],
            recentActivities: [],
          },
          { status: 500 },
        )
      }
    } catch (totalEmissionError) {
      await logServerError(totalEmissionError, { query: "total emission query" })
      console.error("Error in total emission query:", totalEmissionError)
      return NextResponse.json(
        {
          error: "Error in total emission query",
          message: totalEmissionError instanceof Error ? totalEmissionError.message : "Unknown error",
          totalEmission: 0,
          scopeData: { scope1: 0, scope2: 0, scope3: 0 },
          emissionsBySource: [],
          emissionsTrend: [],
          recentActivities: [],
        },
        { status: 500 },
      )
    }
  } catch (error) {
    await logServerError(error, { route: "dashboard summary" })
    console.error("Error in dashboard summary API:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
        message: error instanceof Error ? error.message : "Unknown error",
        totalEmission: 0,
        scopeData: { scope1: 0, scope2: 0, scope3: 0 },
        emissionsBySource: [],
        emissionsTrend: [],
        recentActivities: [],
      },
      { status: 500 },
    )
  }
}
