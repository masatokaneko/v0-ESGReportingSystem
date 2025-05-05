"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, RefreshCw, ChevronDown, ChevronRight, AlertTriangle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiDiagnosticsPage() {
  const [results, setResults] = useState<any>(null)
  const [rlsPolicies, setRlsPolicies] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [rlsLoading, setRlsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rlsError, setRlsError] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("api-test")

  const runDiagnostics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/api-test")
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchRlsPolicies = async () => {
    setRlsLoading(true)
    setRlsError(null)

    try {
      const response = await fetch("/api/debug/rls-policies")
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      setRlsPolicies(data)
    } catch (err) {
      setRlsError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setRlsLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const renderStatusIcon = (isSuccess: boolean | undefined) => {
    if (isSuccess === undefined) return null
    return isSuccess ? (
      <CheckCircle2 className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">API診断ツール</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="api-test">API診断</TabsTrigger>
          <TabsTrigger value="rls-policies">RLSポリシー</TabsTrigger>
          <TabsTrigger value="solutions">解決策</TabsTrigger>
        </TabsList>

        <TabsContent value="api-test">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>API診断</CardTitle>
              <CardDescription>APIエンドポイントとデータベースアクセスの診断を実行します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={runDiagnostics} disabled={loading} className="flex items-center gap-2">
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      診断実行中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      診断を実行
                    </>
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>エラー</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {results && (
                  <div className="space-y-6 mt-4">
                    {/* 全体の結果サマリー */}
                    <Alert variant={results.success ? "default" : "destructive"}>
                      <AlertTitle>診断結果</AlertTitle>
                      <AlertDescription>
                        {results.success
                          ? "すべてのテストが成功しました。"
                          : "一部のテストに失敗しました。詳細を確認してください。"}
                      </AlertDescription>
                    </Alert>

                    {/* テーブルアクセステスト */}
                    <Collapsible
                      open={openSections.tables}
                      onOpenChange={() => toggleSection("tables")}
                      className="border rounded-md"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 font-medium">
                        <div className="flex items-center gap-2">
                          {renderStatusIcon(results.results.tables)}
                          <span>テーブル一覧へのアクセス</span>
                        </div>
                        {openSections.tables ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 pt-0 border-t">
                        {results.results.tables ? (
                          <div className="text-green-600">テーブル一覧へのアクセスに成功しました。</div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-red-600">テーブル一覧へのアクセスに失敗しました。</div>
                            {results.errors?.tables && (
                              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(results.errors.tables, null, 2)}
                              </pre>
                            )}
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* 特定のテーブルへのアクセステスト */}
                    <Collapsible
                      open={openSections.tablesAccess}
                      onOpenChange={() => toggleSection("tablesAccess")}
                      className="border rounded-md"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 font-medium">
                        <div className="flex items-center gap-2">
                          {renderStatusIcon(Object.values(results.results.tablesAccess).every(Boolean))}
                          <span>特定のテーブルへのアクセス</span>
                        </div>
                        {openSections.tablesAccess ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 pt-0 border-t">
                        <div className="space-y-2">
                          {Object.entries(results.results.tablesAccess).map(([table, success]) => (
                            <div key={table} className="flex items-center gap-2">
                              {renderStatusIcon(success as boolean)}
                              <span className={success ? "text-green-600" : "text-red-600"}>
                                {table}: {success ? "アクセス可能" : "アクセス不可"}
                              </span>
                            </div>
                          ))}

                          {results.errors?.tablesAccess && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">エラー詳細:</h4>
                              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(results.errors.tablesAccess, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* APIエンドポイントテスト */}
                    <Collapsible
                      open={openSections.apiEndpoints}
                      onOpenChange={() => toggleSection("apiEndpoints")}
                      className="border rounded-md"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 font-medium">
                        <div className="flex items-center gap-2">
                          {renderStatusIcon(Object.values(results.results.apiEndpoints).every(Boolean))}
                          <span>APIエンドポイント</span>
                        </div>
                        {openSections.apiEndpoints ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 pt-0 border-t">
                        <div className="space-y-2">
                          {Object.entries(results.results.apiEndpoints).map(([endpoint, success]) => (
                            <div key={endpoint} className="flex items-center gap-2">
                              {renderStatusIcon(success as boolean)}
                              <span className={success ? "text-green-600" : "text-red-600"}>
                                {endpoint}: {success ? "正常" : "エラー"}
                              </span>
                            </div>
                          ))}

                          {results.errors?.apiEndpoints && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">エラー詳細:</h4>
                              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                                {JSON.stringify(results.errors.apiEndpoints, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* 環境変数の状態 */}
                    <Collapsible
                      open={openSections.envVars}
                      onOpenChange={() => toggleSection("envVars")}
                      className="border rounded-md"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 font-medium">
                        <div className="flex items-center gap-2">
                          {renderStatusIcon(Object.values(results.results.envVars).every(Boolean))}
                          <span>環境変数</span>
                        </div>
                        {openSections.envVars ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 pt-0 border-t">
                        <div className="space-y-2">
                          {Object.entries(results.results.envVars).map(([name, isSet]) => (
                            <div key={name} className="flex items-center gap-2">
                              {renderStatusIcon(isSet as boolean)}
                              <span className={isSet ? "text-green-600" : "text-red-600"}>
                                {name}: {isSet ? "設定済み" : "未設定"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* リクエスト情報 */}
                    <Collapsible
                      open={openSections.requestInfo}
                      onOpenChange={() => toggleSection("requestInfo")}
                      className="border rounded-md"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 font-medium">
                        <span>リクエスト情報</span>
                        {openSections.requestInfo ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 pt-0 border-t">
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                          {JSON.stringify(results.results.requestInfo, null, 2)}
                        </pre>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* タイムスタンプ */}
                    <div className="text-sm text-gray-500">
                      診断実行時刻: {new Date(results.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rls-policies">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>RLSポリシー診断</CardTitle>
              <CardDescription>テーブルのRLSポリシー設定を確認します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={fetchRlsPolicies} disabled={rlsLoading} className="flex items-center gap-2">
                  {rlsLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      ポリシー取得中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      RLSポリシーを取得
                    </>
                  )}
                </Button>

                {rlsError && (
                  <Alert variant="destructive">
                    <AlertTitle>エラー</AlertTitle>
                    <AlertDescription>{rlsError}</AlertDescription>
                  </Alert>
                )}

                {rlsPolicies && (
                  <div className="space-y-6 mt-4">
                    {/* サービスロールポリシーがないテーブル */}
                    {rlsPolicies.tablesWithoutServiceRolePolicy.length > 0 && (
                      <Alert variant="destructive">
                        <AlertTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          サービスロールポリシーがないテーブル
                        </AlertTitle>
                        <AlertDescription>
                          <p className="mb-2">
                            以下のテーブルにはRLSが有効ですが、サービスロール用のポリシーがありません。これが403エラーの原因かもしれません。
                          </p>
                          <ul className="list-disc list-inside">
                            {rlsPolicies.tablesWithoutServiceRolePolicy.map((table: string) => (
                              <li key={table}>{table}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* テーブルごとのRLSポリシー */}
                    <div className="space-y-4">
                      <h3 className="font-medium">テーブルごとのRLSポリシー</h3>
                      {Object.entries(rlsPolicies.tables).map(([tableName, tableInfo]: [string, any]) => (
                        <Collapsible
                          key={tableName}
                          open={openSections[`table_${tableName}`]}
                          onOpenChange={() => toggleSection(`table_${tableName}`)}
                          className="border rounded-md"
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 font-medium">
                            <div className="flex items-center gap-2">
                              {tableInfo.has_rls && !tableInfo.has_service_role_policy ? (
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                              ) : tableInfo.has_rls ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                              )}
                              <span>{tableName}</span>
                              {tableInfo.has_rls && (
                                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">RLS有効</span>
                              )}
                              {tableInfo.has_service_role_policy && (
                                <span className="ml-2 text-xs bg-green-100 px-2 py-0.5 rounded">
                                  サービスロールポリシー有り
                                </span>
                              )}
                            </div>
                            {openSections[`table_${tableName}`] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-4 pt-0 border-t">
                            {tableInfo.policies.length > 0 ? (
                              <div className="space-y-4">
                                {tableInfo.policies.map((policy: any, index: number) => (
                                  <div key={index} className="border p-3 rounded-md">
                                    <h4 className="font-medium">{policy.policy_name}</h4>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                      <div className="text-gray-600">ロール:</div>
                                      <div>{policy.roles.join(", ")}</div>
                                      <div className="text-gray-600">コマンド:</div>
                                      <div>{policy.cmd}</div>
                                      <div className="text-gray-600">条件式:</div>
                                      <div className="font-mono text-xs bg-gray-50 p-1 rounded">
                                        {policy.qual || "なし"}
                                      </div>
                                      <div className="text-gray-600">チェック式:</div>
                                      <div className="font-mono text-xs bg-gray-50 p-1 rounded">
                                        {policy.with_check || "なし"}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-gray-500">このテーブルにはポリシーがありません。</div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>

                    {/* タイムスタンプ */}
                    <div className="text-sm text-gray-500">
                      取得時刻: {new Date(rlsPolicies.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solutions">
          <Card>
            <CardHeader>
              <CardTitle>403エラーの解決方法</CardTitle>
              <CardDescription>診断結果に基づく解決策</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">RLSポリシーの追加</h3>
                <p>
                  403エラーの最も一般的な原因は、テーブルにRLSが有効になっているにもかかわらず、サービスロール用のポリシーが設定されていないことです。以下のSQLを実行して、各テーブルにサービスロール用のポリシーを追加してください。
                </p>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h4 className="font-medium mb-2">サービスロールポリシーの追加SQL</h4>
                  <pre className="text-xs overflow-auto">
                    {`-- data_entries テーブル用
CREATE POLICY "Service role has full access to data_entries"
ON public.data_entries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- locations テーブル用
CREATE POLICY "Service role has full access to locations"
ON public.locations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- departments テーブル用
CREATE POLICY "Service role has full access to departments"
ON public.departments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- emission_factors テーブル用
CREATE POLICY "Service role has full access to emission_factors"
ON public.emission_factors
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- error_logs テーブル用
CREATE POLICY "Service role has full access to error_logs"
ON public.error_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);`}
                  </pre>
                </div>

                <h3 className="font-medium">RLSの無効化（代替手段）</h3>
                <p>
                  サービスロールポリシーを追加する代わりに、テーブルのRLSを無効化することもできます。ただし、これはセキュリティ上のリスクがあるため、本番環境では推奨されません。
                </p>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h4 className="font-medium mb-2">RLS無効化SQL</h4>
                  <pre className="text-xs overflow-auto">
                    {`-- data_entries テーブルのRLSを無効化
ALTER TABLE public.data_entries DISABLE ROW LEVEL SECURITY;

-- locations テーブルのRLSを無効化
ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;

-- departments テーブルのRLSを無効化
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;

-- emission_factors テーブルのRLSを無効化
ALTER TABLE public.emission_factors DISABLE ROW LEVEL SECURITY;

-- error_logs テーブルのRLSを無効化
ALTER TABLE public.error_logs DISABLE ROW LEVEL SECURITY;`}
                  </pre>
                </div>

                <h3 className="font-medium">環境変数の確認</h3>
                <p>
                  RLSポリシーの問題でない場合は、環境変数が正しく設定されているか確認してください。特に、サービスロールキーが正しいことを確認してください。
                </p>

                <div className="mt-4">
                  <Button asChild>
                    <a href="/admin/system-status" className="flex items-center gap-2">
                      システムステータスページへ
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
