import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// 排出係数一覧を取得するAPI
export async function GET() {
  try {
    const { data, error } = await supabaseServer.from("emission_factors").select("*").order("activity_type")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Emission factors fetch error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// 新しい排出係数を追加するAPI
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 必須フィールドの検証
    if (!body.activity_type || !body.category || body.factor === undefined || !body.unit) {
      return NextResponse.json({ error: "Activity type, category, factor and unit are required" }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from("emission_factors")
      .insert([
        {
          activity_type: body.activity_type,
          category: body.category,
          factor: body.factor,
          unit: body.unit,
          valid_from: body.valid_from || null,
          valid_to: body.valid_to || null,
        },
      ])
      .select()

    if (error) {
      // 一意性制約違反の特別処理
      if (error.code === "23505") {
        return NextResponse.json({ error: "An emission factor with these parameters already exists" }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Emission factor creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
