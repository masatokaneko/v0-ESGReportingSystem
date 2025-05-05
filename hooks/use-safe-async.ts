"use client"

import { useState, useCallback } from "react"
import { safeAwait } from "@/lib/promise-utils"
import { logClientError } from "@/lib/error-logger"

/**
 * 安全な非同期操作を実行するためのカスタムフック
 * エラーハンドリングとローディング状態の管理を自動化
 */
export function useSafeAsync<T, P extends any[]>(
  asyncFn: (...args: P) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    errorType?: string
    componentName?: string
  } = {},
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(
    async (...args: P) => {
      setIsLoading(true)
      setError(null)

      const [result, error] = await safeAwait(asyncFn(...args))

      setIsLoading(false)

      if (error) {
        setError(error)

        // エラーログに記録
        logClientError({
          error_type: options.errorType || "AsyncOperationError",
          message: error.message,
          stack_trace: error.stack,
          component: options.componentName || "UnknownComponent",
          context: { args: JSON.stringify(args) },
        }).catch((logError) => {
          console.error("Failed to log error:", logError)
        })

        // エラーハンドラーを呼び出し
        options.onError?.(error)
        return null
      }

      setData(result as T)
      options.onSuccess?.(result as T)
      return result
    },
    [asyncFn, options],
  )

  return {
    execute,
    isLoading,
    error,
    data,
    reset: useCallback(() => {
      setData(null)
      setError(null)
      setIsLoading(false)
    }, []),
  }
}
