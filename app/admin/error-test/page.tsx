"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundary } from "@/components/error-boundary"
import { logClientError } from "@/lib/error-logger"
import { useGlobalErrorHandler } from "@/hooks/use-error-handler"
import { BugErrorComponent } from "@/components/test/bug-error-component"
import { toast } from "@/hooks/use-toast"

export default function ErrorTestPage() {
  useGlobalErrorHandler() // グローバルエラーハンドラーを有効化
  const [apiTestResult, setApiTestResult] = useState<string | null>(null)

  // クライアントサイドエラーをテスト
  const testClientError = () => {
    try {
      // 意図的にエラーを発生させる
      throw new Error("テスト用のクライアントエラー")
    } catch (error) {
      if (error instanceof Error) {
        logClientError({
          error_type: "TestClientError",
          message: error.message,
          stack_trace: error.stack,
          component: "ErrorTestPage",
          context: { test: "client-error-test" },
        })
        toast({
          title: "クライアントエラーをログに記録しました",
          description: "エラーログ管理画面で確認できます",
        })
      }
    }
  }

  // 未処理のPromiseエラーをテスト
  const testUnhandledPromiseError = () => {
    // 未処理のPromiseエラーを発生させる
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("テスト用の未処理Promiseエラー"))
      }, 100)
    })
    toast({
      title: "未処理のPromiseエラーを発生させました",
      description: "コンソールとエラーログを確認してください",
    })
  }

  // グローバルエラーをテスト
  const testGlobalError = () => {
    // グローバルエラーを発生させる
    setTimeout(() => {
      // @ts-ignore - 意図的にundefinedのプロパティにアクセスしてエラーを発生させる
      const obj = null
      obj.nonExistentMethod()
    }, 100)
    toast({
      title: "グローバルエラーを発生させました",
      description: "コンソールとエラーログを確認してください",
    })
  }

  // APIエラーをテスト
  const testApiError = async () => {
    try {
      setApiTestResult("テスト中...")
      const response = await fetch("/api/error-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: true }),
      })

      const data = await response.json()
      setApiTestResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setApiTestResult(`エラー: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">エラーログ機能テスト</h1>

      <Tabs defaultValue="client" className="space-y-4">
        <TabsList>
          <TabsTrigger value="client">クライアントエラー</TabsTrigger>
          <TabsTrigger value="component">コンポーネントエラー</TabsTrigger>
          <TabsTrigger value="api">APIエラー</TabsTrigger>
        </TabsList>

        <TabsContent value="client" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>クライアントサイドエラーテスト</CardTitle>
              <CardDescription>
                様々なクライアントサイドエラーをテストし、エラーログに記録されるか確認します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={testClientError} variant="outline">
                  try-catchエラーテスト
                </Button>
                <Button onClick={testUnhandledPromiseError} variant="outline">
                  未処理Promiseエラーテスト
                </Button>
                <Button onClick={testGlobalError} variant="outline">
                  グローバルエラーテスト
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="component" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>コンポーネントエラーテスト</CardTitle>
              <CardDescription>ErrorBoundaryを使用してコンポーネントエラーをキャプチャします</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">エラーを発生させるコンポーネント</h3>
                  <ErrorBoundary componentName="BugErrorComponent">
                    <BugErrorComponent shouldError={true} />
                  </ErrorBoundary>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">正常なコンポーネント</h3>
                  <ErrorBoundary componentName="BugErrorComponent">
                    <BugErrorComponent shouldError={false} />
                  </ErrorBoundary>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>APIエラーテスト</CardTitle>
              <CardDescription>APIエンドポイントでのエラーハンドリングをテストします</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testApiError}>APIエラーテスト実行</Button>
              {apiTestResult && (
                <div className="p-4 bg-muted rounded-md">
                  <pre className="whitespace-pre-wrap">{apiTestResult}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
