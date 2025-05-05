import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// 特定のデータエントリを取得するAPI
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { data, error } = await supabaseServer
      .from("data_entries")
      .select(`
        *,
        locations(id, name, code),
        departments(id, name, code),
        emission_factors(id, activity_type, factor, unit)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Data entry not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Data entry fetch error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// データエントリを更新するAPI
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // 必須フィールドの検証
    if (!body.entry_date || !body.activity_type || body.activity_amount === undefined) {
      return NextResponse.json({ error: "Entry date, activity type and activity amount are required" }, { status: 400 })
    }

    // 排出量の計算（emission_factor_idが提供されている場合）
    let emission = body.emission
    if (body.emission_factor_id && !emission) {
      const { data: factor, error: factorError } = await supabaseServer
        .from("emission_factors")
        .select("factor")
        .eq("id", body.emission_factor_id)
        .single()

      if (factorError) {
        if (factorError.code !== "PGRST116") {
          // Not found以外のエラー
          return NextResponse.json({ error: factorError.message }, { status: 500 })
        }
      } else if (factor) {
        emission = body.activity_amount * factor.factor
      }
    }

    const { data, error } = await supabaseServer
      .from("data_entries")
      .update({
        entry_date: body.entry_date,
        location_id: body.location_id || null,
        department_id: body.department_id || null,
        activity_type: body.activity_type,
        activity_amount: body.activity_amount,
        emission_factor_id: body.emission_factor_id || null,
        emission: emission || null,
        notes: body.notes || null,
        status: body.status || "pending",
        submitter: body.submitter || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        locations(id, name, code),
        departments(id, name, code),
        emission_factors(id, activity_type, factor, unit)
      `)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Data entry not found" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Data entry update error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// データエントリを削除するAPI
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { error } = await supabaseServer.from("data_entries").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Data entry deletion error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
