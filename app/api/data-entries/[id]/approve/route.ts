import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// データエントリを承認するAPI
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const { data, error } = await supabaseServer
      .from("data_entries")
      .update({
        status: "approved",
        approved_by: body.approved_by || null,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (data.length === 0) {
      return NextResponse.json({ error: "Data entry not found" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Data entry approval error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
