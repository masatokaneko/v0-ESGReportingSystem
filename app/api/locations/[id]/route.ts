import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// 特定の拠点を取得するAPI
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { data, error } = await supabaseServer.from("locations").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Location not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Location fetch error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// 拠点を更新するAPI
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // 必須フィールドの検証
    if (!body.name || !body.code) {
      return NextResponse.json({ error: "Name and code are required" }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from("locations")
      .update({
        name: body.name,
        code: body.code,
        address: body.address || null,
        type: body.type || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      // コード重複エラーの特別処理
      if (error.code === "23505") {
        return NextResponse.json({ error: "A location with this code already exists" }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Location update error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// 拠点を削除するAPI
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 関連データの確認
    const { count: relatedEntries, error: checkError } = await supabaseServer
      .from("data_entries")
      .select("*", { count: "exact", head: true })
      .eq("location_id", id)

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    // 関連データがある場合は削除を拒否
    if (relatedEntries && relatedEntries > 0) {
      return NextResponse.json({ error: "Cannot delete location with related data entries" }, { status: 409 })
    }

    const { error } = await supabaseServer.from("locations").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Location deletion error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
