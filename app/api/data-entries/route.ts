import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"
import { logDatabaseConnectionError } from "@/lib/db-error-logger"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const locationId = searchParams.get("locationId")
    const departmentId = searchParams.get("departmentId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let query = `
      SELECT 
        de.*, 
        l.name as location_name, 
        d.name as department_name,
        ef.activity_type as emission_factor_activity_type,
        ef.category as emission_factor_category,
        ef.factor as emission_factor_value,
        ef.unit as emission_factor_unit
      FROM data_entries de
      LEFT JOIN locations l ON de.location_id = l.id
      LEFT JOIN departments d ON de.department_id = d.id
      LEFT JOIN emission_factors ef ON de.emission_factor_id = ef.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (status) {
      query += ` AND de.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (locationId) {
      query += ` AND de.location_id = $${paramIndex}`
      params.push(Number.parseInt(locationId))
      paramIndex++
    }

    if (departmentId) {
      query += ` AND de.department_id = $${paramIndex}`
      params.push(Number.parseInt(departmentId))
      paramIndex++
    }

    if (startDate) {
      query += ` AND de.entry_date >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      query += ` AND de.entry_date <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    query += ` ORDER BY de.entry_date DESC, de.created_at DESC`

    const result = await executeQuery(query, params)

    if (!result.success) {
      const error = new Error(result.error || "Database query failed")
      await logDatabaseConnectionError(error, { endpoint: "/api/data-entries" })
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
    await logDatabaseConnectionError(error as Error, { endpoint: "/api/data-entries" })
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
    if (!body.entry_date || !body.activity_type || !body.activity_amount) {
      return NextResponse.json(
        { error: "Entry date, activity type, and activity amount are required" },
        { status: 400 },
      )
    }

    // 排出係数の取得
    let emissionFactorId = body.emission_factor_id
    let emission = null

    if (!emissionFactorId && body.activity_type) {
      // 適切な排出係数を自動的に検索
      const efQuery = `
        SELECT id, factor FROM emission_factors
        WHERE activity_type = $1
        AND category = $2
        AND (valid_from IS NULL OR valid_from <= $3)
        AND (valid_to IS NULL OR valid_to >= $3)
        ORDER BY valid_from DESC NULLS LAST
        LIMIT 1
      `

      const efResult = await executeQuery(efQuery, [body.activity_type, body.category || "default", body.entry_date])

      if (efResult.success && efResult.data && efResult.data.length > 0) {
        emissionFactorId = efResult.data[0].id
        emission = Number.parseFloat(body.activity_amount) * Number.parseFloat(efResult.data[0].factor)
      }
    }

    const query = `
      INSERT INTO data_entries (
        entry_date, location_id, department_id, activity_type, 
        activity_amount, emission_factor_id, emission, notes, 
        status, submitter, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `

    const result = await executeQuery(query, [
      body.entry_date,
      body.location_id || null,
      body.department_id || null,
      body.activity_type,
      body.activity_amount,
      emissionFactorId || null,
      emission,
      body.notes || null,
      body.status || "pending",
      body.submitter || null,
    ])

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(result.data?.[0], { status: 201 })
  } catch (error) {
    console.error("Data entry creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
