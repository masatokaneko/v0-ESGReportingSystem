"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

export default function SystemStatusPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkStatus = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/env")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const renderStatusIcon = (isAvailable: boolean | undefined) => {
    if (isAvailable === undefined) return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    return isAvailable ? (
      <CheckCircle2 className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">システムステータス</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>環境変数ステータス</CardTitle>
          <CardDescription>アプリケーションに必要な環境変数の設定状況</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : status ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-medium">環境変数</div>
                <div className="font-medium">ステータス</div>

                {Object.entries(status.envStatus).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <div className="text-sm">{key}</div>
                    <div className="flex items-center">
                      {renderStatusIcon(value as boolean)}
                      <span className="ml-2">{value ? "設定済み" : "未設定"}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">フォーマットチェック</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(status.formatCheck).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <div className="text-sm">{key}</div>
                      <div className="flex items-center">
                        {renderStatusIcon(value as boolean)}
                        <span className="ml-2">{value ? "正しいフォーマット" : "不正なフォーマット"}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">NODE_ENV</div>
                  <div>{status.nodeEnv}</div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-4">
            <Button onClick={checkStatus} disabled={loading}>
              {loading ? "チェック中..." : "再チェック"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>環境変数の設定方法</CardTitle>
          <CardDescription>環境変数が未設定の場合は、以下の手順で設定してください</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">開発環境での設定</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  プロジェクトのルートディレクトリに <code>.env.local</code> ファイルを作成
                </li>
                <li>
                  以下の環境変数を設定:
                  <pre className="bg-gray-100 p-2 mt-2 rounded">
                    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
                    <br />
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...（あなたのanon keyをここに）
                    <br />
                    SUPABASE_SERVICE_ROLE_KEY=eyJ...（あなたのservice role keyをここに）
                  </pre>
                </li>
                <li>開発サーバーを再起動</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">本番環境での設定</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>ホスティングプラットフォーム（Vercelなど）の環境変数設定ページにアクセス</li>
                <li>上記の3つの環境変数を追加</li>
                <li>アプリケーションを再デプロイ</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
