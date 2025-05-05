"use client"

import type { ReactNode } from "react"
import { useGlobalErrorHandler } from "@/hooks/use-error-handler"

export function Providers({ children }: { children: ReactNode }) {
  // グローバルエラーハンドラーを設定
  useGlobalErrorHandler()

  return <>{children}</>
}
