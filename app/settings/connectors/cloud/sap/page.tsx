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

export default function SapConnectorPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/settings/connectors/cloud" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center">
          <img src="/sap-logo.png" alt="SAP" className="w-10 h-10 mr-3 rounded-md" />
          <h1 className="text-3xl font-bold">SAP S/4HANA Cloud接続設定</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>接続ステータス</CardTitle>
              <CardDescription>SAP S/4HANA Cloudとの接続状態</CardDescription>
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
                  <span>2,450件</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">API使用率</span>
                  <span>35% (350/1,000)</span>
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
              <CardTitle>SAP S/4HANA Cloud接続設定</CardTitle>
              <CardDescription>SAP S/4HANA Cloudとの接続設定を管理します</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="general">基本設定</TabsTrigger>
                  <TabsTrigger value="authentication">認証設定</TabsTrigger>
                  <TabsTrigger value="entities">エンティティ設定</TabsTrigger>
                  <TabsTrigger value="schedule">スケジュール</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="connector-name">コネクタ名</Label>
                        <Input id="connector-name" defaultValue="財務部SAP S/4HANA" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sap-edition">SAPエディション</Label>
                        <Select defaultValue="cloud">
                          <SelectTrigger id="sap-edition">
                            <SelectValue placeholder="エディションを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cloud">S/4HANA Cloud</SelectItem>
                            <SelectItem value="onpremise">S/4HANA On-Premise</SelectItem>
                            <SelectItem value="private">S/4HANA Private Cloud</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instance-url">インスタンスURL</Label>
                      <Input id="instance-url" defaultValue="https://mycompany-api.s4hana.ondemand.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="connector-description">説明</Label>
                      <Textarea
                        id="connector-description"
                        defaultValue="財務部で使用しているSAP S/4HANAインスタンスからの財務データと調達データ取得用コネクタ"
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
                          <SelectItem value="apikey">APIキー</SelectItem>
                          <SelectItem value="certificate">証明書認証</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-id">クライアントID</Label>
                      <Input id="client-id" type="text" defaultValue="sb-clnt-12345-6789-abcd-efgh" />
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
                        defaultValue="https://mycompany-api.authentication.sap.hana.ondemand.com/oauth/token"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sap-client">SAPクライアント</Label>
                      <Input id="sap-client" defaultValue="100" />
                      <p className="text-xs text-gray-500">
                        SAPシステムのクライアント番号を入力してください。通常は100または200です。
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button className="flex items-center">認証情報を更新</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="entities">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>同期するエンティティ</Label>
                      <div className="rounded-md border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="entity-journal" className="rounded" defaultChecked />
                            <Label htmlFor="entity-journal">JournalEntry（仕訳）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="entity-supplier" className="rounded" defaultChecked />
                            <Label htmlFor="entity-supplier">Supplier（サプライヤー）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="entity-purchaseorder" className="rounded" defaultChecked />
                            <Label htmlFor="entity-purchaseorder">PurchaseOrder（発注）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="entity-costcenter" className="rounded" defaultChecked />
                            <Label htmlFor="entity-costcenter">CostCenter（原価センター）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="entity-businesspartner" className="rounded" />
                            <Label htmlFor="entity-businesspartner">BusinessPartner（取引先）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="odata-filter">ODataフィルター</Label>
                      <Textarea
                        id="odata-filter"
                        className="font-mono"
                        defaultValue="CreationDate ge datetime'2023-01-01T00:00:00'"
                      />
                      <p className="text-xs text-gray-500">
                        取得するレコードを絞り込むためのODataフィルター式を入力してください。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expand-relations">展開する関連エンティティ</Label>
                      <Input id="expand-relations" placeholder="例: to_BusinessPartner,to_Item" />
                      <p className="text-xs text-gray-500">
                        関連エンティティを取得する場合は、カンマ区切りで展開するナビゲーションプロパティを入力してください。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batch-size">バッチサイズ</Label>
                      <Input id="batch-size" type="number" defaultValue="100" min="1" max="1000" />
                      <p className="text-xs text-gray-500">
                        一度に取得するレコード数を指定します。大きすぎるとタイムアウトする可能性があります。
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
                        <Input id="schedule-time" type="time" defaultValue="01:00" />
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
                      <Input id="custom-cron" placeholder="例: 0 1 * * 1" />
                      <p className="text-xs text-gray-500">
                        カスタムスケジュールを設定する場合は、Cron式を入力してください。例: 毎週月曜日午前1時 = 0 1 * *
                        1
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="retry-enabled" defaultChecked />
                      <Label htmlFor="retry-enabled">エラー時に自動再試行する</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delta-sync">差分同期設定</Label>
                      <Select defaultValue="timestamp">
                        <SelectTrigger id="delta-sync">
                          <SelectValue placeholder="差分同期方法を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="timestamp">タイムスタンプベース</SelectItem>
                          <SelectItem value="token">変更トークンベース</SelectItem>
                          <SelectItem value="full">常にフル同期</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        差分同期の方法を選択します。タイムスタンプベースは最終更新日時を使用し、変更トークンベースはSAPの変更トークンを使用します。
                      </p>
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
