"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TableData {
  table_name: string
  has_rls: boolean
}

interface Policy {
  table_name: string
  policy_name: string
  roles: string[]
  cmd: string
  qual: string
  with_check: string
}

export default function RLSPoliciesPage() {
  const [tables, setTables] = useState<TableData[]>([])
  const [policies, setPolicies] = useState<Policy[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<any>(null)

  const fetchPolicies = async () => {
    setIsLoading(true)
    setError(null)
    setErrorDetails(null)
    try {
      const response = await fetch("/api/debug/rls-policies")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch RLS policies")
      }

      if (!data.success) {
        throw new Error(data.message || data.error || "Failed to fetch RLS policies")
      }

      setTables(data.tables || [])
      setPolicies(data.policies || [])
    } catch (error) {
      console.error("Error fetching RLS policies:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      toast({
        title: "エラー",
        description: "RLSポリシーの取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPolicies()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">RLSポリシー管理</h1>
        <Button onClick={fetchPolicies} disabled={isLoading} className="flex items-center gap-2">
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              読み込み中...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              更新
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>エラーが発生しました</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
            {errorDetails && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">詳細を表示</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(errorDetails, null, 2)}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>テーブル一覧</CardTitle>
            <CardDescription>データベース内のテーブルとRLS有効状態</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>テーブル名</TableHead>
                  <TableHead>RLS有効</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                      {isLoading ? "読み込み中..." : "テーブルが見つかりません"}
                    </TableCell>
                  </TableRow>
                ) : (
                  tables.map((table) => (
                    <TableRow key={table.table_name}>
                      <TableCell className="font-medium">{table.table_name}</TableCell>
                      <TableCell>
                        {table.has_rls ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            有効
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            無効
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RLSポリシー一覧</CardTitle>
            <CardDescription>テーブルに設定されているRLSポリシー</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>テーブル名</TableHead>
                  <TableHead>ポリシー名</TableHead>
                  <TableHead>ロール</TableHead>
                  <TableHead>コマンド</TableHead>
                  <TableHead>条件 (USING)</TableHead>
                  <TableHead>チェック (WITH CHECK)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      {isLoading ? "読み込み中..." : "ポリシーが見つかりません"}
                    </TableCell>
                  </TableRow>
                ) : (
                  policies.map((policy, index) => (
                    <TableRow key={`${policy.table_name}-${policy.policy_name}-${index}`}>
                      <TableCell className="font-medium">{policy.table_name}</TableCell>
                      <TableCell>{policy.policy_name}</TableCell>
                      <TableCell>
                        {policy.roles.map((role) => (
                          <Badge key={role} variant="outline" className="mr-1 mb-1">
                            {role}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell>{policy.cmd}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 p-1 rounded">{policy.qual}</code>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 p-1 rounded">{policy.with_check}</code>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>環境変数の確認</CardTitle>
            <CardDescription>必要な環境変数が設定されているか確認します</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTitle>環境変数の設定方法</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  以下の環境変数がVercelダッシュボードで正しく設定されていることを確認してください：
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>NEXT_PUBLIC_SUPABASE_URL - Supabaseプロジェクトの URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY - 匿名キー（anon key）</li>
                  <li>SUPABASE_SERVICE_ROLE_KEY - サービスロールキー（service_role key）</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="mt-4">
              <Button onClick={() => (window.location.href = "/admin/system-status")} variant="outline">
                システムステータスを確認
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RLSポリシーの解説</CardTitle>
            <CardDescription>RLSポリシーの基本的な説明と設定方法</CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h3>RLSポリシーとは</h3>
            <p>
              Row Level Security (RLS) は、データベースのテーブルに対して行レベルのアクセス制御を提供する機能です。
              これにより、ユーザーやロールごとに異なるデータアクセス権限を設定できます。
            </p>

            <h3>ポリシーの基本構造</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
              {`CREATE POLICY "ポリシー名"
ON テーブル名
FOR 操作 (SELECT, INSERT, UPDATE, DELETE, ALL)
TO ロール名
USING (条件式) -- 行の読み取り条件
WITH CHECK (条件式) -- 行の書き込み条件`}
            </pre>

            <h3>サービスロール用のポリシー例</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
              {`CREATE POLICY "Service role has full access"
ON public.テーブル名
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);`}
            </pre>

            <h3>一般的な問題と解決策</h3>
            <ul>
              <li>
                <strong>403エラー</strong>: サービスロールキーを使用しているにもかかわらず403エラーが発生する場合は、
                そのテーブルにサービスロール用のポリシーが設定されていない可能性があります。
              </li>
              <li>
                <strong>RLSが有効になっていない</strong>: テーブルにRLSが有効になっていない場合、
                ポリシーは適用されません。RLSを有効にするには以下のSQLを実行します：
                <pre className="bg-gray-100 p-2 rounded mt-2">
                  {`ALTER TABLE テーブル名 ENABLE ROW LEVEL SECURITY;`}
                </pre>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
