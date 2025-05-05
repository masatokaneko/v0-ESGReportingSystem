import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// データエントリ一覧を取得するAPI
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // クエリパラメータの取得
    const locationId = searchParams.get("location_id")
    const departmentId = searchParams.get("department_id")
    const status = searchParams.get("status")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    // Supabaseクエリの構築
    let query = supabaseServer
      .from("data_entries")
      .select(`
        *,
        locations(id, name, code),
        departments(id, name, code),
        emission_factors(id, activity_type, factor, unit)
      `)
      .order("entry_date", { ascending: false })

    // フィルタの適用
    if (locationId) {
      query = query.eq("location_id", locationId)
    }

    if (departmentId) {
      query = query.eq("department_id", departmentId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (startDate) {
      query = query.gte("entry_date", startDate)
    }

    if (endDate) {
      query = query.lte("entry_date", endDate)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Data entries fetch error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// 新しいデータエントリを追加するAPI
export async function POST(request: Request) {
  try {
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
      .insert([
        {
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
        },
      ])
      .select(`
        *,
        locations(id, name, code),
        departments(id, name, code),
        emission_factors(id, activity_type, factor, unit)
      `)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Data entry creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
