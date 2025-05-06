import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid error log ID" }, { status: 400 })
    }

    const query = `
      SELECT * FROM error_logs
      WHERE id = $1
    `

    const result = await executeQuery(query, [id])

    if (!result.success) {
      console.error("Failed to fetch error log:", result.error)
      return NextResponse.json({ error: "Failed to fetch error log" }, { status: 500 })
    }

    if (!result.data || result.data.length === 0) {
      return NextResponse.json({ error: "Error log not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result.data[0],
    })
  } catch (error) {
    console.error("Error fetching error log:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch error log",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid error log ID" }, { status: 400 })
    }

    const data = await request.json()

    // 更新可能なフィールドを制限
    const allowedFields = ["status", "severity"]
    const updates: Record<string, any> = {}

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates[field] = data[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    // 更新クエリを構築
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ")

    const query = `
      UPDATE error_logs
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `

    const values = [id, ...Object.values(updates)]
    const result = await executeQuery(query, values)

    if (!result.success) {
      console.error("Failed to update error log:", result.error)
      return NextResponse.json({ error: "Failed to update error log" }, { status: 500 })
    }

    if (!result.data || result.data.length === 0) {
      return NextResponse.json({ error: "Error log not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result.data[0],
      message: "Error log updated successfully",
    })
  } catch (error) {
    console.error("Error updating error log:", error)
    return NextResponse.json(
      {
        error: "Failed to update error log",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
