"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { safeAwait, withTimeout, retry } from "@/lib/promise-utils"
import { useSafeAsync } from "@/hooks/use-safe-async"
import { toast } from "@/hooks/use-toast"

// 成功するAPI呼び出しをシミュレート
const simulateSuccessfulApiCall = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true, data: { message: "API呼び出しが成功しました" } }
}

// 失敗するAPI呼び出しをシミュレート
const simulateFailingApiCall = async () => {
  await new Promise((_, reject) =>
    setTimeout(() => {
      reject(new Error("API呼び出しが失敗しました"))
    }, 1000),
  )
  return { success: false }
}

// 時々失敗するAPI呼び出しをシミュレート
const simulateUnreliableApiCall = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  if (Math.random() > 0.5) {
    throw new Error("ランダムなエラーが発生しました")
  }
  return { success: true, data: { message: "不安定なAPI呼び出しが成功しました" } }
}

export default function SafeAsyncExample() {
  const [result, setResult] = useState<string | null>(null)

  // useSafeAsyncフックを使用した例
  const { execute, isLoading, error } = useSafeAsync(simulateFailingApiCall, {
    onSuccess: (data) => {
      toast({
        title: "成功",
        description: "API呼び出しが成功しました",
      })
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      })
    },
    errorType: "ApiCallError",
    componentName: "SafeAsyncExample",
  })

  // safeAwaitを使用した例
  const handleSafeAwait = async () => {
    setResult("処理中...")
    const [data, error] = await safeAwait(simulateSuccessfulApiCall())

    if (error) {
      setResult(`エラー: ${error.message}`)
      return
    }

    setResult(`結果: ${JSON.stringify(data)}`)
  }

  // withTimeoutを使用した例
  const handleWithTimeout = async () => {
    setResult("処理中...")
    try {
      const data = await withTimeout(simulateSuccessfulApiCall(), 500, "処理がタイムアウトしました")
      setResult(`結果: ${JSON.stringify(data)}`)
    } catch (error) {
      setResult(`エラー: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // retryを使用した例
  const handleRetry = async () => {
    setResult("処理中...")
    try {
      const data = await retry(() => simulateUnreliableApiCall(), 3, 500)
      setResult(`結果: ${JSON.stringify(data)}`)
    } catch (error) {
      setResult(`エラー: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>安全な非同期処理の例</CardTitle>
          <CardDescription>未処理のPromiseエラーを防ぐためのユーティリティ関数の使用例</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={() => execute()} disabled={isLoading}>
              {isLoading ? "処理中..." : "useSafeAsyncを使用"}
            </Button>
            {error && <p className="text-red-500">{error.message}</p>}

            <Button onClick={handleSafeAwait}>safeAwaitを使用</Button>

            <Button onClick={handleWithTimeout}>withTimeoutを使用</Button>

            <Button onClick={handleRetry}>retryを使用</Button>
          </div>

          {result && (
            <div className="p-4 bg-muted rounded-md">
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
