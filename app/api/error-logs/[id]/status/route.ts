import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer, isSupabaseServerInitialized } from "@/lib/supabase"
import type { ErrorStatus } from "@/lib/error-logger"

interface UpdateStatusRequest {
  status: ErrorStatus
  resolution_notes?: string
  resolved_at?: string | null
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isSupabaseServerInitialized()) {
    return NextResponse.json({ error: "Database client not initialized" }, { status: 500 })
  }

  try {
    const { id } = params
    const data: UpdateStatusRequest = await request.json()

    // バリデーション
    if (!data.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const supabaseServer = getSupabaseServer()

    // エラーログのステータスを更新
    const updateData: any = {
      status: data.status,
    }

    if (data.resolution_notes) {
      updateData.resolution_notes = data.resolution_notes
    }

    if (data.status === "resolved") {
      updateData.resolved_at = data.resolved_at || new Date().toISOString()
    }

    const { error } = await supabaseServer.from("error_logs").update(updateData).eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating error log status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
