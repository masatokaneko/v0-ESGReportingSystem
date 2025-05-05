import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// 特定の部門を取得するAPI
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { data, error } = await supabaseServer.from("departments").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Department not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Department fetch error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// 部門を更新するAPI
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // 必須フィールドの検証
    if (!body.name || !body.code) {
      return NextResponse.json({ error: "Name and code are required" }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from("departments")
      .update({
        name: body.name,
        code: body.code,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      // コード重複エラーの特別処理
      if (error.code === "23505") {
        return NextResponse.json({ error: "A department with this code already exists" }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Department update error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// 部門を削除するAPI
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 関連データの確認
    const { count: relatedEntries, error: checkError } = await supabaseServer
      .from("data_entries")
      .select("*", { count: "exact", head: true })
      .eq("department_id", id)

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    // 関連データがある場合は削除を拒否
    if (relatedEntries && relatedEntries > 0) {
      return NextResponse.json({ error: "Cannot delete department with related data entries" }, { status: 409 })
    }

    const { error } = await supabaseServer.from("departments").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Department deletion error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
