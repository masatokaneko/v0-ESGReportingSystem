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

export default function EnergyCAPConnectorPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/settings/connectors/cloud" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center">
          <img src="/placeholder.svg?key=r8nfc" alt="EnergyCAP" className="w-10 h-10 mr-3 rounded-md" />
          <h1 className="text-3xl font-bold">EnergyCAP接続設定</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>接続ステータス</CardTitle>
              <CardDescription>EnergyCAP との接続状態</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ステータス</span>
                  <Badge className="bg-green-100 text-green-800 font-normal rounded-full px-3">接続済み</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">最終同期</span>
                  <span>2023-04-12 08:45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">取得レコード数</span>
                  <span>3,250件</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">API使用率</span>
                  <span>15% (1,500/10,000)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">認証有効期限</span>
                  <span>2023-05-12 08:45</span>
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
              <CardTitle>EnergyCAP接続設定</CardTitle>
              <CardDescription>EnergyCAP との接続設定を管理します</CardDescription>
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
                        <Input id="connector-name" defaultValue="施設管理部EnergyCAP" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instance-url">インスタンスURL</Label>
                        <Input id="instance-url" defaultValue="https://api.energycap.com/v1" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="connector-description">説明</Label>
                      <Textarea
                        id="connector-description"
                        defaultValue="施設管理部で使用しているEnergyCAP からのエネルギー使用量データ取得用コネクタ"
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
                      <Select defaultValue="apikey">
                        <SelectTrigger id="auth-type">
                          <SelectValue placeholder="認証タイプを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apikey">APIキー</SelectItem>
                          <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-key">APIキー</Label>
                      <Input id="api-key" type="password" defaultValue="••••••••••••••••" />
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
                            <input type="checkbox" id="data-meter" className="rounded" defaultChecked />
                            <Label htmlFor="data-meter">MeterReading（メーター読取値）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="data-cost" className="rounded" defaultChecked />
                            <Label htmlFor="data-cost">Cost（コスト）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="data-fuel" className="rounded" defaultChecked />
                            <Label htmlFor="data-fuel">FuelType（燃料タイプ）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="data-building" className="rounded" />
                            <Label htmlFor="data-building">Building（建物）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date-range">データ取得期間</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">開始日</Label>
                          <Input id="start-date" type="date" defaultValue="2023-01-01" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-date">終了日</Label>
                          <Input id="end-date" type="date" defaultValue="2023-12-31" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mapping-settings">データマッピング設定</Label>
                      <div className="rounded-md border p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                              <Label>ソースフィールド</Label>
                              <div className="p-2 bg-gray-100 rounded-md mt-1">MeterReading.Value</div>
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="w-8 h-0.5 bg-gray-300"></div>
                            </div>
                            <div>
                              <Label>ターゲットフィールド</Label>
                              <Select defaultValue="energy_consumption">
                                <SelectTrigger>
                                  <SelectValue placeholder="ターゲットフィールドを選択" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="energy_consumption">エネルギー消費量</SelectItem>
                                  <SelectItem value="value">値</SelectItem>
                                  <SelectItem value="site_code">拠点コード</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                              <Label>ソースフィールド</Label>
                              <div className="p-2 bg-gray-100 rounded-md mt-1">FuelType.Name</div>
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="w-8 h-0.5 bg-gray-300"></div>
                            </div>
                            <div>
                              <Label>ターゲットフィールド</Label>
                              <Select defaultValue="energy_type">
                                <SelectTrigger>
                                  <SelectValue placeholder="ターゲットフィールドを選択" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="energy_type">エネルギータイプ</SelectItem>
                                  <SelectItem value="source">ソース</SelectItem>
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
                        <Input id="schedule-time" type="time" defaultValue="02:00" />
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
                      <Input id="custom-cron" placeholder="例: 0 2 * * 1" />
                      <p className="text-xs text-gray-500">
                        カスタムスケジュールを設定する場合は、Cron式を入力してください。例: 毎週月曜日午前2時 = 0 2 * *
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
