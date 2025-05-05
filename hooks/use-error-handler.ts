"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function useGlobalErrorHandler() {
  const pathname = usePathname()

  useEffect(() => {
    // 未処理のPromiseエラーをキャプチャ
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled Promise Rejection:", event.reason)
    }

    // グローバルなエラーをキャプチャ
    const handleError = (event: ErrorEvent) => {
      console.error("Global Error:", event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
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
