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

export default function FreeeConnectorPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/settings/connectors/cloud" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center">
          <img src="/placeholder.svg?key=l2syi" alt="Freee" className="w-10 h-10 mr-3 rounded-md" />
          <h1 className="text-3xl font-bold">Freee接続設定</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>接続ステータス</CardTitle>
              <CardDescription>Freeeとの接続状態</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ステータス</span>
                  <Badge className="bg-green-100 text-green-800 font-normal rounded-full px-3">接続済み</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">最終同期</span>
                  <span>2023-04-15 10:30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">取得レコード数</span>
                  <span>1,250件</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">API使用率</span>
                  <span>25% (2,500/10,000)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">認証有効期限</span>
                  <span>2023-05-15 10:30</span>
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
              <CardTitle>Freee接続設定</CardTitle>
              <CardDescription>Freeeとの接続設定を管理します</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="general">基本設定</TabsTrigger>
                  <TabsTrigger value="authentication">認証設定</TabsTrigger>
                  <TabsTrigger value="data">データ設定</TabsTrigger>
                  <TabsTrigger value="schedule">スケジュール</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="connector-name">コネクタ名</Label>
                        <Input id="connector-name" defaultValue="経理部Freee" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="freee-plan">Freeeプラン</Label>
                        <Select defaultValue="professional">
                          <SelectTrigger id="freee-plan">
                            <SelectValue placeholder="プランを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="starter">スターター</SelectItem>
                            <SelectItem value="standard">スタンダード</SelectItem>
                            <SelectItem value="professional">プロフェッショナル</SelectItem>
                            <SelectItem value="enterprise">エンタープライズ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-id">事業所ID</Label>
                      <Input id="company-id" defaultValue="1234567" />
                      <p className="text-xs text-gray-500">
                        Freeeの事業所IDを入力してください。複数の事業所がある場合は、カンマ区切りで入力できます。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="connector-description">説明</Label>
                      <Textarea
                        id="connector-description"
                        defaultValue="経理部で使用しているFreeeからの会計データ取得用コネクタ"
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
                          <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                          <SelectItem value="apikey">APIキー</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-id">クライアントID</Label>
                      <Input id="client-id" type="text" defaultValue="abcdef1234567890" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-secret">クライアントシークレット</Label>
                      <Input id="client-secret" type="password" defaultValue="••••••••••••••••" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="redirect-url">リダイレクトURL</Label>
                      <Input
                        id="redirect-url"
                        type="url"
                        value="https://esg-reporting.example.com/auth/callback"
                        readOnly
                      />
                      <p className="text-xs text-gray-500">
                        このURLをFreeeのAPI連携アプリケーション設定のコールバックURLとして設定してください。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-version">API バージョン</Label>
                      <Select defaultValue="v1">
                        <SelectTrigger id="api-version">
                          <SelectValue placeholder="APIバージョンを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v1">v1</SelectItem>
                          <SelectItem value="v2">v2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end">
                      <Button className="flex items-center">認証情報を更新</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="data">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>取得するデータ</Label>
                      <div className="rounded-md border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="data-account" className="rounded" defaultChecked />
                            <Label htmlFor="data-account">勘定科目</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="data-transaction" className="rounded" defaultChecked />
                            <Label htmlFor="data-transaction">取引</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="data-invoice" className="rounded" defaultChecked />
                            <Label htmlFor="data-invoice">請求書</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="data-partner" className="rounded" />
                            <Label htmlFor="data-partner">取引先</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="data-item" className="rounded" />
                            <Label htmlFor="data-item">品目</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="query-filter">フィルター条件</Label>
                      <Textarea
                        id="query-filter"
                        className="font-mono"
                        defaultValue="start_date=2023-01-01&end_date=2023-12-31"
                      />
                      <p className="text-xs text-gray-500">
                        取得するデータを絞り込むためのクエリパラメータを入力してください。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mapping-settings">データマッピング設定</Label>
                      <div className="rounded-md border p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                              <Label>ソースフィールド</Label>
                              <div className="p-2 bg-gray-100 rounded-md mt-1">取引.金額</div>
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="w-8 h-0.5 bg-gray-300"></div>
                            </div>
                            <div>
                              <Label>ターゲットフィールド</Label>
                              <Select defaultValue="value">
                                <SelectTrigger>
                                  <SelectValue placeholder="ターゲットフィールドを選択" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="value">値</SelectItem>
                                  <SelectItem value="company_code">会社コード</SelectItem>
                                  <SelectItem value="site_code">拠点コード</SelectItem>
                                  <SelectItem value="kpi_category">KPIカテゴリ</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                              <Label>ソースフィールド</Label>
                              <div className="p-2 bg-gray-100 rounded-md mt-1">取引.取引日</div>
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="w-8 h-0.5 bg-gray-300"></div>
                            </div>
                            <div>
                              <Label>ターゲットフィールド</Label>
                              <Select defaultValue="date">
                                <SelectTrigger>
                                  <SelectValue placeholder="ターゲットフィールドを選択" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="date">日付</SelectItem>
                                  <SelectItem value="fiscal_year">会計年度</SelectItem>
                                  <SelectItem value="fiscal_quarter">会計四半期</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <Button variant="outline" className="w-full">
                            + マッピングを追加
                          </Button>
                        </div>
                      </div>
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
                        <Input id="schedule-time" type="time" defaultValue="03:00" />
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
                      <Input id="custom-cron" placeholder="例: 0 3 * * 1" />
                      <p className="text-xs text-gray-500">
                        カスタムスケジュールを設定する場合は、Cron式を入力してください。例: 毎週月曜日午前3時 = 0 3 * *
                        1
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
