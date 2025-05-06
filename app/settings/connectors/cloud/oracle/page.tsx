import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Save, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function OracleConnectorPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/settings/connectors/cloud" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center">
          <img src="/mystical-oracle.png" alt="Oracle" className="w-10 h-10 mr-3 rounded-md" />
          <h1 className="text-3xl font-bold">Oracle Fusion ERP接続設定</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>接続ステータス</CardTitle>
              <CardDescription>Oracle Fusion ERPとの接続状態</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ステータス</span>
                  <Badge className="bg-green-100 text-green-800 font-normal rounded-full px-3">接続済み</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">最終同期</span>
                  <span>2023-04-12 09:45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">取得レコード数</span>
                  <span>1,850件</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">API使用率</span>
                  <span>28% (280/1,000)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">認証有効期限</span>
                  <span>2023-05-12 09:45</span>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <Button className="w-full flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    今すぐ同期
                  </Button>
                  <Button variant="outline" className="w-full">
                    接続テスト
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Oracle Fusion ERP接続設定</CardTitle>
              <CardDescription>Oracle Fusion ERPとの接続設定を管理します</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="general">基本設定</TabsTrigger>
                  <TabsTrigger value="authentication">認証設定</TabsTrigger>
                  <TabsTrigger value="resources">リソース設定</TabsTrigger>
                  <TabsTrigger value="schedule">スケジュール</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="connector-name">コネクタ名</Label>
                        <Input id="connector-name" defaultValue="経理部Oracle Fusion ERP" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="oracle-version">Oracleバージョン</Label>
                        <Select defaultValue="23c">
                          <SelectTrigger id="oracle-version">
                            <SelectValue placeholder="バージョンを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="23c">Fusion Cloud ERP 23C</SelectItem>
                            <SelectItem value="22d">Fusion Cloud ERP 22D</SelectItem>
                            <SelectItem value="21c">Fusion Cloud ERP 21C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instance-url">インスタンスURL</Label>
                      <Input id="instance-url" defaultValue="https://fa-abcd-saasfaprod1.fa.ocs.oraclecloud.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="connector-description">説明</Label>
                      <Textarea
                        id="connector-description"
                        defaultValue="経理部で使用しているOracle Fusion ERPインスタンスからの会計データと調達データ取得用コネクタ"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="connector-enabled" defaultChecked />
                      <Label htmlFor="connector-enabled">コネクタを有効にする</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="authentication">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="auth-type">認証タイプ</Label>
                      <Select defaultValue="oauth2">
                        <SelectTrigger id="auth-type">
                          <SelectValue placeholder="認証タイプを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic認証</SelectItem>
                          <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                          <SelectItem value="jwt">JWT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-id">クライアントID</Label>
                      <Input id="client-id" type="text" defaultValue="12345abcde67890fghij" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-secret">クライアントシークレット</Label>
                      <Input id="client-secret" type="password" defaultValue="••••••••••••••••" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="token-url">トークンURL</Label>
                      <Input
                        id="token-url"
                        type="url"
                        defaultValue="https://idcs-abcd.identity.oraclecloud.com/oauth2/v1/token"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scope">スコープ</Label>
                      <Input
                        id="scope"
                        defaultValue="https://fa-abcd-saasfaprod1.fa.ocs.oraclecloud.com:443urn:opc:resource:consumer::all"
                      />
                      <p className="text-xs text-gray-500">必要なAPIアクセス権限のスコープを入力してください。</p>
                    </div>

                    <div className="flex justify-end">
                      <Button className="flex items-center">認証情報を更新</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resources">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>同期するリソース</Label>
                      <div className="rounded-md border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="resource-gl" className="rounded" defaultChecked />
                            <Label htmlFor="resource-gl">General Ledger（総勘定元帳）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="resource-ap" className="rounded" defaultChecked />
                            <Label htmlFor="resource-ap">Accounts Payable（買掛金）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="resource-ar" className="rounded" />
                            <Label htmlFor="resource-ar">Accounts Receivable（売掛金）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="resource-po" className="rounded" defaultChecked />
                            <Label htmlFor="resource-po">Purchase Orders（発注）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="resource-fa" className="rounded" defaultChecked />
                            <Label htmlFor="resource-fa">Fixed Assets（固定資産）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rest-filter">RESTフィルター</Label>
                      <Textarea
                        id="rest-filter"
                        className="font-mono"
                        defaultValue="CreationDate > '2023-01-01T00:00:00.000Z'"
                      />
                      <p className="text-xs text-gray-500">
                        取得するレコードを絞り込むためのRESTフィルター式を入力してください。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page-size">ページサイズ</Label>
                      <Input id="page-size" type="number" defaultValue="100" min="1" max="1000" />
                      <p className="text-xs text-gray-500">
                        一度に取得するレコード数を指定します。大きすぎるとタイムアウトする可能性があります。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-unit">ビジネスユニット</Label>
                      <Input id="business-unit" defaultValue="US1" />
                      <p className="text-xs text-gray-500">
                        データを取得するビジネスユニットのコードを入力してください。
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schedule">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-type">スケジュールタイプ</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="schedule-type">
                          <SelectValue placeholder="スケジュールタイプを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">手動実行のみ</SelectItem>
                          <SelectItem value="hourly">毎時</SelectItem>
                          <SelectItem value="daily">毎日</SelectItem>
                          <SelectItem value="weekly">毎週</SelectItem>
                          <SelectItem value="monthly">毎月</SelectItem>
                          <SelectItem value="custom">カスタム</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="schedule-time">実行時刻</Label>
                        <Input id="schedule-time" type="time" defaultValue="02:30" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="schedule-day">実行曜日</Label>
                        <Select defaultValue="1">
                          <SelectTrigger id="schedule-day">
                            <SelectValue placeholder="実行曜日を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">月曜日</SelectItem>
                            <SelectItem value="2">火曜日</SelectItem>
                            <SelectItem value="3">水曜日</SelectItem>
                            <SelectItem value="4">木曜日</SelectItem>
                            <SelectItem value="5">金曜日</SelectItem>
                            <SelectItem value="6">土曜日</SelectItem>
                            <SelectItem value="0">日曜日</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custom-cron">カスタムCron式</Label>
                      <Input id="custom-cron" placeholder="例: 30 2 * * 1" />
                      <p className="text-xs text-gray-500">
                        カスタムスケジュールを設定する場合は、Cron式を入力してください。例: 毎週月曜日午前2時30分 = 30 2
                        * * 1
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="retry-enabled" defaultChecked />
                      <Label htmlFor="retry-enabled">エラー時に自動再試行する</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-6">
                <Button className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  設定を保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
