import { NextResponse } from "next/server"
import { getSupabaseServer, isSupabaseServerInitialized } from "@/lib/supabase"
import { handleApiError } from "@/lib/api-error-handler"
import { logDatabaseConnectionError } from "@/lib/db-error-logger"

export async function GET() {
  try {
    // Supabaseサーバークライアントが初期化されているか確認
    if (!isSupabaseServerInitialized()) {
      const error = new Error("Supabase server client is not initialized")
      await logDatabaseConnectionError(error, { endpoint: "/api/locations" })
      return NextResponse.json(
        {
          error: "Database connection error",
          message: "Supabase client is not initialized. Please check environment variables.",
          requiredEnvVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
        },
        { status: 500 },
      )
    }

    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("locations").select("*").order("name")

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    return handleApiError(error, "Failed to fetch locations")
  }
}

// 他のメソッド（POST, PUT, DELETE）も同様に修正
