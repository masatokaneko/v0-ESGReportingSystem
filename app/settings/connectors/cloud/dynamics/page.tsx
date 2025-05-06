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

export default function DynamicsConnectorPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/settings/connectors/cloud" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center">
          <img src="/microsoft-campus.png" alt="Microsoft" className="w-10 h-10 mr-3 rounded-md" />
          <h1 className="text-3xl font-bold">Microsoft Dynamics 365接続設定</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>接続ステータス</CardTitle>
              <CardDescription>Microsoft Dynamics 365との接続状態</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ステータス</span>
                  <Badge className="bg-green-100 text-green-800 font-normal rounded-full px-3">接続済み</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">最終同期</span>
                  <span>2023-04-10 14:20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">取得レコード数</span>
                  <span>1,350件</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">API使用率</span>
                  <span>22% (220/1,000)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">認証有効期限</span>
                  <span>2023-05-10 14:20</span>
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
              <CardTitle>Microsoft Dynamics 365接続設定</CardTitle>
              <CardDescription>Microsoft Dynamics 365との接続設定を管理します</CardDescription>
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
                        <Input id="connector-name" defaultValue="営業部Dynamics 365" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dynamics-app">Dynamicsアプリケーション</Label>
                        <Select defaultValue="finance">
                          <SelectTrigger id="dynamics-app">
                            <SelectValue placeholder="アプリケーションを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="finance">Finance and Operations</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="customerservice">Customer Service</SelectItem>
                            <SelectItem value="fieldservice">Field Service</SelectItem>
                            <SelectItem value="supplychain">Supply Chain Management</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instance-url">インスタンスURL</Label>
                      <Input id="instance-url" defaultValue="https://mycompany.crm.dynamics.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="connector-description">説明</Label>
                      <Textarea
                        id="connector-description"
                        defaultValue="営業部で使用しているMicrosoft Dynamics 365インスタンスからの顧客データと販売データ取得用コネクタ"
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
                          <SelectItem value="clientcredentials">クライアント資格情報</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tenant-id">テナントID</Label>
                      <Input id="tenant-id" type="text" defaultValue="12345678-1234-1234-1234-123456789012" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-id">クライアントID</Label>
                      <Input id="client-id" type="text" defaultValue="87654321-4321-4321-4321-210987654321" />
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
                        このURLをAzure ADのアプリケーション登録のリダイレクトURIとして設定してください。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scope">スコープ</Label>
                      <Input id="scope" defaultValue="https://mycompany.crm.dynamics.com/.default" />
                      <p className="text-xs text-gray-500">必要なAPIアクセス権限のスコープを入力してください。</p>
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
                            <input type="checkbox" id="entity-account" className="rounded" defaultChecked />
                            <Label htmlFor="entity-account">Account（取引先企業）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="entity-contact" className="rounded" defaultChecked />
                            <Label htmlFor="entity-contact">Contact（取引先担当者）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="entity-opportunity" className="rounded" defaultChecked />
                            <Label htmlFor="entity-opportunity">Opportunity（案件）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="entity-invoice" className="rounded" defaultChecked />
                            <Label htmlFor="entity-invoice">Invoice（請求書）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="entity-custom" className="rounded" />
                            <Label htmlFor="entity-custom">msdyn_ESGEmissions（カスタムエンティティ）</Label>
                          </div>
                          <Button variant="outline" size="sm">
                            フィールド設定
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fetch-xml">FetchXML</Label>
                      <Textarea
                        id="fetch-xml"
                        className="font-mono h-32"
                        defaultValue={`<fetch version="1.0" output-format="xml-platform" mapping="logical">
  <entity name="account">
    <attribute name="name" />
    <attribute name="primarycontactid" />
    <attribute name="telephone1" />
    <filter type="and">
      <condition attribute="createdon" operator="ge" value="2023-01-01" />
    </filter>
  </entity>
</fetch>`}
                      />
                      <p className="text-xs text-gray-500">
                        カスタムクエリを使用する場合は、FetchXMLを入力してください。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="page-size">ページサイズ</Label>
                      <Input id="page-size" type="number" defaultValue="50" min="1" max="5000" />
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
                        <Input id="schedule-time" type="time" defaultValue="04:00" />
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
                      <Input id="custom-cron" placeholder="例: 0 4 * * 1" />
                      <p className="text-xs text-gray-500">
                        カスタムスケジュールを設定する場合は、Cron式を入力してください。例: 毎週月曜日午前4時 = 0 4 * *
                        1
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="retry-enabled" defaultChecked />
                      <Label htmlFor="retry-enabled">エラー時に自動再試行する</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="change-tracking">変更追跡</Label>
                      <Select defaultValue="enabled">
                        <SelectTrigger id="change-tracking">
                          <SelectValue placeholder="変更追跡を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">有効（差分同期）</SelectItem>
                          <SelectItem value="disabled">無効（常にフル同期）</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        変更追跡を有効にすると、前回の同期以降に変更されたレコードのみを取得します。
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
