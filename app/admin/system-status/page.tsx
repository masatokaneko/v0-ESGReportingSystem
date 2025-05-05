"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isValidServiceRoleKey, isValidAnonKey } from "@/lib/supabase-validator"

export default function SystemStatusPage() {
  const [status, setStatus] = useState<any>(null)
  const [connectionTest, setConnectionTest] = useState<any>(null)
  const [authTest, setAuthTest] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("env")

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

  const testConnection = async () => {
    setTestLoading(true)

    try {
      const response = await fetch("/api/debug/connection-test")
      const data = await response.json()
      setConnectionTest(data)
    } catch (err) {
      setConnectionTest({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      })
    } finally {
      setTestLoading(false)
    }
  }

  const testAuth = async () => {
    setAuthLoading(true)

    try {
      const response = await fetch("/api/debug/auth-test")
      const data = await response.json()
      setAuthTest(data)
    } catch (err) {
      setAuthTest({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      })
    } finally {
      setAuthLoading(false)
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

  // 環境変数の検証
  const validateEnvVars = () => {
    if (!status) return null

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const isServiceRoleKeyValid = isValidServiceRoleKey(supabaseServiceRoleKey)
    const isAnonKeyValid = isValidAnonKey(supabaseAnonKey)

    return (
      <div className="space-y-4 mt-4">
        <h3 className="font-medium">環境変数の検証結果</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm">サービスロールキーの形式</div>
          <div className="flex items-center">
            {renderStatusIcon(isServiceRoleKeyValid)}
            <span className="ml-2">{isServiceRoleKeyValid ? "有効なJWTトークン形式" : "無効なトークン形式"}</span>
          </div>

          <div className="text-sm">匿名キーの形式</div>
          <div className="flex items-center">
            {renderStatusIcon(isAnonKeyValid)}
            <span className="ml-2">{isAnonKeyValid ? "有効なJWTトークン形式" : "無効なトークン形式"}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">システムステータス</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="env">環境変数</TabsTrigger>
          <TabsTrigger value="connection">接続テスト</TabsTrigger>
          <TabsTrigger value="auth">認証テスト</TabsTrigger>
          <TabsTrigger value="help">ヘルプ</TabsTrigger>
        </TabsList>

        <TabsContent value="env">
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

                  {validateEnvVars()}

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
        </TabsContent>

        <TabsContent value="connection">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>データベース接続テスト</CardTitle>
              <CardDescription>Supabaseへの接続状態を確認します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={testConnection} disabled={testLoading} className="flex items-center gap-2">
                  {testLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      テスト中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      接続テスト実行
                    </>
                  )}
                </Button>

                {connectionTest && (
                  <div className="mt-4">
                    <Alert variant={connectionTest.success ? "default" : "destructive"}>
                      <AlertTitle>{connectionTest.success ? "接続成功" : "接続エラー"}</AlertTitle>
                      <AlertDescription>
                        {connectionTest.success ? (
                          "Supabaseへの接続に成功しました。"
                        ) : (
                          <div className="space-y-2">
                            <p>エラー: {connectionTest.error}</p>
                            {connectionTest.details && (
                              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(connectionTest.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>認証テスト</CardTitle>
              <CardDescription>サービスロールと匿名ロールの認証状態を確認します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={testAuth} disabled={authLoading} className="flex items-center gap-2">
                  {authLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      テスト中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      認証テスト実行
                    </>
                  )}
                </Button>

                {authTest && (
                  <div className="mt-4 space-y-4">
                    <Alert variant={authTest.success ? "default" : "destructive"}>
                      <AlertTitle>
                        {authTest.success ? "サービスロール認証成功" : "サービスロール認証エラー"}
                      </AlertTitle>
                      <AlertDescription>
                        {authTest.serviceRole.success ? (
                          "サービスロールでの認証に成功しました。"
                        ) : (
                          <div className="space-y-2">
                            <p>エラー: {authTest.serviceRole.error}</p>
                            {authTest.serviceRole.details && (
                              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(authTest.serviceRole.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>

                    <Alert variant={authTest.anon.success ? "default" : "warning"}>
                      <AlertTitle>{authTest.anon.success ? "匿名ロール認証成功" : "匿名ロール認証エラー"}</AlertTitle>
                      <AlertDescription>
                        {authTest.anon.success ? (
                          "匿名ロールでの認証に成功しました。"
                        ) : (
                          <div className="space-y-2">
                            <p>エラー: {authTest.anon.error}</p>
                            {authTest.anon.details && (
                              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(authTest.anon.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>

                    <div className="pt-4">
                      <h3 className="font-medium mb-2">環境情報</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-sm">環境</div>
                        <div>{authTest.environment}</div>
                        <div className="text-sm">タイムスタンプ</div>
                        <div>{new Date(authTest.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle>403エラーの解決方法</CardTitle>
              <CardDescription>403 Forbiddenエラーが発生した場合の対処法</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">1. サービスロールキーの確認</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        Supabaseダッシュボード <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                      にアクセス
                    </li>
                    <li>プロジェクトを選択</li>
                    <li>左側のメニューから「Project Settings」→「API」を選択</li>
                    <li>「Project API keys」セクションで「service_role」キーをコピー</li>
                    <li>Vercelダッシュボードで環境変数「SUPABASE_SERVICE_ROLE_KEY」を更新</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">2. RLSポリシーの確認</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Supabaseダッシュボードで「Authentication」→「Policies」を選択</li>
                    <li>各テーブルのRLSポリシーを確認</li>
                    <li>
                      必要に応じて、サービスロールに対する全権限ポリシーを追加:
                      <pre className="bg-gray-100 p-2 mt-2 rounded text-xs">
                        {`CREATE POLICY "Service role has full access"
ON public.data_entries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);`}
                      </pre>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">3. プロジェクトの状態確認</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Supabaseダッシュボードでプロジェクトが有効であることを確認</li>
                    <li>支払い状況に問題がないか確認</li>
                    <li>プロジェクトの使用制限に達していないか確認</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">4. IPアドレス制限の確認</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Supabaseダッシュボードで「Project Settings」→「API」を選択</li>
                    <li>「API Settings」セクションでIPアドレス制限が設定されていないか確認</li>
                    <li>設定されている場合は、Vercelのデプロイ先IPを許可リストに追加</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">5. 再デプロイ</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>環境変数を更新した後、アプリケーションを再デプロイ</li>
                    <li>デプロイ後にシステムステータスページで接続テストを実行</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
