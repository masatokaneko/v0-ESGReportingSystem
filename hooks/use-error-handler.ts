"use client"

import { useEffect } from "react"
import { logClientError } from "@/lib/error-logger"
import { usePathname } from "next/navigation"

export function useGlobalErrorHandler() {
  const pathname = usePathname()

  useEffect(() => {
    // 未処理のPromiseエラーをキャプチャ
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logClientError({
        error_type: "UnhandledPromiseRejection",
        message: event.reason?.message || "Unknown promise rejection",
        stack_trace: event.reason?.stack,
        route: pathname,
        user_agent: navigator.userAgent,
        context: {
          reason: event.reason,
        },
      }).catch((err) => {
        console.error("Failed to log unhandled rejection:", err)
      })
    }

    // グローバルなエラーをキャプチャ
    const handleError = (event: ErrorEvent) => {
      logClientError({
        error_type: "GlobalError",
        message: event.message || "Unknown error",
        stack_trace: event.error?.stack,
        route: pathname,
        user_agent: navigator.userAgent,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      }).catch((err) => {
        console.error("Failed to log global error:", err)
      })
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [pathname])
}
