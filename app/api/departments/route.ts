import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// 部門一覧を取得するAPI
export async function GET() {
  try {
    const { data, error } = await supabaseServer.from("departments").select("*").order("name")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Departments fetch error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// 新しい部門を追加するAPI
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 必須フィールドの検証
    if (!body.name || !body.code) {
      return NextResponse.json({ error: "Name and code are required" }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from("departments")
      .insert([
        {
          name: body.name,
          code: body.code,
        },
      ])
      .select()

    if (error) {
      // コード重複エラーの特別処理
      if (error.code === "23505") {
        return NextResponse.json({ error: "A department with this code already exists" }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Department creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
