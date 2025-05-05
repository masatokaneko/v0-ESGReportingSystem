import { NextResponse } from "next/server"
import { testNeonConnection } from "@/lib/neon"

export async function GET() {
  const result = await testNeonConnection()
  return NextResponse.json(result)
}
