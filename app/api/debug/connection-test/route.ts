import { NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/supabase"

export async function GET() {
  try {
    const result = await testSupabaseConnection()

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
