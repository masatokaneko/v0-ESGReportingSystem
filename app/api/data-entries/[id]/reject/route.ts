import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase"

// データエントリを差し戻すAPI
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const { data, error } = await supabaseServer
      .from("data_entries")
      .update({
        status: "rejected",
        notes: body.reason
          ? body.notes
            ? `${body.notes}\n\n差戻理由: ${body.reason}`
            : `差戻理由: ${body.reason}`
          : body.notes,
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
    console.error("Data entry rejection error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
