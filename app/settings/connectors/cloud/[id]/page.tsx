import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Save, Trash, RefreshCw } from "lucide-react"
import { DEFAULT_CONNECTORS } from "@/lib/connectors/connector-catalog"
import { notFound } from "next/navigation"

export default function ConnectorDetailPage({ params }: { params: { id: string } }) {
  // 実際のアプリケーションではAPIからデータを取得
  const connector = DEFAULT_CONNECTORS.find((c) => c.name.toLowerCase().replace(/\s+/g, "-") === params.id)

  if (!connector) {
    notFound()
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{connector.name} コネクタ設定</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            テスト接続
          </Button>
          <Button variant="destructive" className="flex items-center">
            <Trash className="mr-2 h-4 w-4" />
            削除
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="general">基本設定</TabsTrigger>
          <TabsTrigger value="authentication">認証設定</TabsTrigger>
          <TabsTrigger value="mapping">データマッピング</TabsTrigger>
          <TabsTrigger value="schedule">スケジュール</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>基本設定</CardTitle>
              <CardDescription>コネクタの基本的な設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="connector-name">コネクタ名</Label>
                    <Input id="connector-name" defaultValue={connector.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="connector-category">カテゴリ</Label>
                    <Input id="connector-category" defaultValue={connector.category} readOnly />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="connector-description">説明</Label>
                  <Textarea
                    id="connector-description"
                    placeholder="コネクタの説明を入力してください"
                    defaultValue={`${connector.name}からデータを取得するためのコネクタです。`}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="connector-enabled" defaultChecked />
                  <Label htmlFor="connector-enabled">コネクタを有効にする</Label>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>認証設定</CardTitle>
              <CardDescription>外部システムへの接続に必要な認証情報を設定します</CardDescription>
            </CardHeader>
            <CardContent>
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
                      <SelectItem value="jwt">JWT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-id">クライアントID</Label>
                  <Input id="client-id" type="text" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-secret">クライアントシークレット</Label>
                  <Input id="client-secret" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auth-url">認証URL</Label>
                  <Input id="auth-url" type="url" placeholder="https://example.com/oauth/token" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="redirect-url">リダイレクトURL</Label>
                  <Input id="redirect-url" type="url" value="https://your-app.com/auth/callback" readOnly />
                  <p className="text-xs text-gray-500">
                    このURLを外部システムの認証設定のリダイレクトURLとして設定してください。
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <CardTitle>データマッピング</CardTitle>
              <CardDescription>
                外部システムのデータフィールドとESGレポートのフィールドをマッピングします
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">利用可能なデータフィールド</h3>
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {connector.sampleData.map((field, index) => (
                        <div key={index} className="p-2 bg-gray-100 rounded-md">
                          {field}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">フィールドマッピング</h3>
                  <div className="space-y-4">
                    {connector.sampleData.map((field, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div>
                          <Label>ソースフィールド</Label>
                          <div className="p-2 bg-gray-100 rounded-md mt-1">{field}</div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-0.5 bg-gray-300"></div>
                        </div>
                        <div>
                          <Label htmlFor={`target-field-${index}`}>ターゲットフィールド</Label>
                          <Select>
                            <SelectTrigger id={`target-field-${index}`}>
                              <SelectValue placeholder="ターゲットフィールドを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="company_code">会社コード</SelectItem>
                              <SelectItem value="site_code">拠点コード</SelectItem>
                              <SelectItem value="fiscal_year">会計年度</SelectItem>
                              <SelectItem value="kpi_category">KPIカテゴリ</SelectItem>
                              <SelectItem value="kpi_name">KPI名</SelectItem>
                              <SelectItem value="value">値</SelectItem>
                              <SelectItem value="unit">単位</SelectItem>
                              <SelectItem value="source">ソース</SelectItem>
                              <SelectItem value="note">備考</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>スケジュール設定</CardTitle>
              <CardDescription>データ取得のスケジュールを設定します</CardDescription>
            </CardHeader>
            <CardContent>
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
                    <Input id="schedule-time" type="time" defaultValue="00:00" />
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
                  <Input id="custom-cron" placeholder="*/10 * * * *" />
                  <p className="text-xs text-gray-500">
                    カスタムスケジュールを設定する場合は、Cron式を入力してください。例: 毎日午前3時 = 0 3 * * *
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="retry-enabled" defaultChecked />
                  <Label htmlFor="retry-enabled">エラー時に自動再試行する</Label>
                </div>

                <div className="flex justify-end">
                  <Button className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
