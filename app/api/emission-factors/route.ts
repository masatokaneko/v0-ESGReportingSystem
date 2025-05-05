import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"
import { logDatabaseConnectionError } from "@/lib/db-error-logger"

export async function GET() {
  try {
    const result = await executeQuery(`
      SELECT * FROM emission_factors 
      ORDER BY activity_type, category, valid_from DESC
    `)

    if (!result.success) {
      const error = new Error(result.error || "Database query failed")
      await logDatabaseConnectionError(error, { endpoint: "/api/emission-factors" })
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
    await logDatabaseConnectionError(error as Error, { endpoint: "/api/emission-factors" })
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
    if (!body.activity_type || !body.category || !body.factor || !body.unit) {
      return NextResponse.json({ error: "Activity type, category, factor, and unit are required" }, { status: 400 })
    }

    const query = `
      INSERT INTO emission_factors (
        activity_type, category, factor, unit, valid_from, valid_to, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `

    const result = await executeQuery(query, [
      body.activity_type,
      body.category,
      body.factor,
      body.unit,
      body.valid_from || null,
      body.valid_to || null,
    ])

    if (!result.success) {
      // 一意性制約違反の特別処理
      if (result.error?.includes("duplicate key")) {
        return NextResponse.json({ error: "An emission factor with these details already exists" }, { status: 409 })
      }
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(result.data?.[0], { status: 201 })
  } catch (error) {
    console.error("Emission factor creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
