import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"
import { logDatabaseConnectionError } from "@/lib/db-error-logger"

export async function GET() {
  try {
    const result = await executeQuery("SELECT * FROM departments ORDER BY name")

    if (!result.success) {
      const error = new Error(result.error || "Database query failed")
      await logDatabaseConnectionError(error, { endpoint: "/api/departments" })
      return NextResponse.json(
        {
          error: "Database query failed",
          message: result.error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    await logDatabaseConnectionError(error as Error, { endpoint: "/api/departments" })
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 必須フィールドの検証
    if (!body.name || !body.code) {
      return NextResponse.json({ error: "Name and code are required" }, { status: 400 })
    }

    const query = `
      INSERT INTO departments (name, code, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *
    `

    const result = await executeQuery(query, [body.name, body.code])

    if (!result.success) {
      // コード重複エラーの特別処理
      if (result.error?.includes("duplicate key")) {
        return NextResponse.json({ error: "A department with this code already exists" }, { status: 409 })
      }
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(result.data?.[0], { status: 201 })
  } catch (error) {
    console.error("Department creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
