import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// 特定の排出係数を取得するAPI
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { data, error } = await supabaseServer.from("emission_factors").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Emission factor not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Emission factor fetch error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// 排出係数を更新するAPI
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // 必須フィールドの検証
    if (!body.activity_type || !body.category || body.factor === undefined || !body.unit) {
      return NextResponse.json({ error: "Activity type, category, factor and unit are required" }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from("emission_factors")
      .update({
        activity_type: body.activity_type,
        category: body.category,
        factor: body.factor,
        unit: body.unit,
        valid_from: body.valid_from || null,
        valid_to: body.valid_to || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      // 一意性制約違反の特別処理
      if (error.code === "23505") {
        return NextResponse.json({ error: "An emission factor with these parameters already exists" }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Emission factor not found" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Emission factor update error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// 排出係数を削除するAPI
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 関連データの確認
    const { count: relatedEntries, error: checkError } = await supabaseServer
      .from("data_entries")
      .select("*", { count: "exact", head: true })
      .eq("emission_factor_id", id)

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    // 関連データがある場合は削除を拒否
    if (relatedEntries && relatedEntries > 0) {
      return NextResponse.json({ error: "Cannot delete emission factor with related data entries" }, { status: 409 })
    }

    const { error } = await supabaseServer.from("emission_factors").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Emission factor deletion error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
