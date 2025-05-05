import { NextResponse } from "next/server"
import { logServerError } from "./error-logger"

export async function handleApiError(error: any, message: string) {
  console.error(message + ":", error)

  if (error instanceof Error) {
    await logServerError({
      error_type: error.name,
      message: `${message}: ${error.message}`,
      stack_trace: error.stack,
    })
  }

  return NextResponse.json({ error: message || "Internal Server Error" }, { status: 500 })
}
