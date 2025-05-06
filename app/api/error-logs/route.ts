import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"
import type { ErrorLogData } from "@/lib/error-logger"

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as ErrorLogData

    // 必須フィールドの検証
    if (!data.error_type || !data.message) {
      return NextResponse.json({ error: "error_type and message are required" }, { status: 400 })
    }

    // エラーログをデータベースに保存
    const query = `
      INSERT INTO error_logs (
        error_type, message, stack_trace, component, route, 
        user_id, user_agent, request_data, context, severity, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11
      ) RETURNING id
    `

    const result = await executeQuery(query, [
      data.error_type,
      data.message,
      data.stack_trace || null,
      data.component || null,
      data.route || null,
      data.user_id || null,
      data.user_agent || null,
      data.request_data ? JSON.stringify(data.request_data) : null,
      data.context ? JSON.stringify(data.context) : null,
      data.severity || "error",
      data.status || "open",
    ])

    if (!result.success) {
      console.error("Failed to save error log:", result.error)
      return NextResponse.json({ error: "Failed to save error log" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      id: result.data?.[0]?.id,
      message: "Error log saved successfully",
    })
  } catch (error) {
    console.error("Error saving error log:", error)
    return NextResponse.json(
      {
        error: "Failed to process error log",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const query = `
      SELECT * FROM error_logs
      ORDER BY created_at DESC
      LIMIT 100
    `

    const result = await executeQuery(query)

    if (!result.success) {
      console.error("Failed to fetch error logs:", result.error)
      return NextResponse.json({ error: "Failed to fetch error logs" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("Error fetching error logs:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch error logs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
