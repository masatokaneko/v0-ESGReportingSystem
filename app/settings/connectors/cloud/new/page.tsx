import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Save, ArrowLeft } from "lucide-react"
import { SaasConnectorList } from "@/components/connectors/saas-connector-list"
import Link from "next/link"

export default function NewCloudConnectorPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/settings/connectors/cloud" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">新規SaaSコネクタ設定</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SaasConnectorList />
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>コネクタ設定</CardTitle>
              <CardDescription>接続するSaaSサービスを選択し、設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="general">基本設定</TabsTrigger>
                  <TabsTrigger value="authentication">認証設定</TabsTrigger>
                  <TabsTrigger value="mapping">データマッピング</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="connector-name">コネクタ名</Label>
                        <Input id="connector-name" placeholder="例: 営業部Salesforce" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="connector-type">コネクタタイプ</Label>
                        <Select>
                          <SelectTrigger id="connector-type">
                            <SelectValue placeholder="コネクタタイプを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salesforce">Salesforce</SelectItem>
                            <SelectItem value="workday">Workday</SelectItem>
                            <SelectItem value="sap">SAP S/4HANA Cloud</SelectItem>
                            <SelectItem value="oracle">Oracle Fusion ERP</SelectItem>
                            <SelectItem value="dynamics">Microsoft Dynamics 365</SelectItem>
                            <SelectItem value="netsuite">NetSuite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="connector-description">説明</Label>
                      <Textarea
                        id="connector-description"
                        placeholder="このコネクタの用途や接続先の説明を入力してください"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data-categories">取得データカテゴリ</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="category-emissions" className="rounded" />
                          <Label htmlFor="category-emissions">排出量データ</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="category-energy" className="rounded" />
                          <Label htmlFor="category-energy">エネルギー使用量</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="category-travel" className="rounded" />
                          <Label htmlFor="category-travel">出張データ</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="category-waste" className="rounded" />
                          <Label htmlFor="category-waste">廃棄物データ</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="category-water" className="rounded" />
                          <Label htmlFor="category-water">水使用量</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="category-procurement" className="rounded" />
                          <Label htmlFor="category-procurement">調達データ</Label>
                        </div>
                      </div>
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
                          <SelectItem value="basic">Basic認証</SelectItem>
                          <SelectItem value="jwt">JWT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instance-url">インスタンスURL</Label>
                      <Input id="instance-url" placeholder="例: https://mycompany.salesforce.com" />
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
                      <Label htmlFor="redirect-url">リダイレクトURL</Label>
                      <Input
                        id="redirect-url"
                        type="url"
                        value="https://esg-reporting.example.com/auth/callback"
                        readOnly
                      />
                      <p className="text-xs text-gray-500">
                        このURLをSaaSサービスの認証設定のリダイレクトURLとして設定してください。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scopes">スコープ</Label>
                      <Input id="scopes" placeholder="例: api refresh_token" />
                      <p className="text-xs text-gray-500">
                        必要なAPIアクセス権限のスコープをスペース区切りで入力してください。
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button className="flex items-center">認証テスト</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mapping">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">データマッピング設定</h3>
                      <p className="text-sm text-gray-500">
                        SaaSサービスから取得するデータフィールドとESGレポートのフィールドをマッピングします。
                      </p>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div>
                            <Label>ソースフィールド</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="ソースフィールドを選択" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="account.name">Account.Name</SelectItem>
                                <SelectItem value="account.site">Account.Site</SelectItem>
                                <SelectItem value="opportunity.amount">Opportunity.Amount</SelectItem>
                                <SelectItem value="custom.emissions__c">Custom.Emissions__c</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="w-8 h-0.5 bg-gray-300"></div>
                          </div>
                          <div>
                            <Label>ターゲットフィールド</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="ターゲットフィールドを選択" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="company_name">会社名</SelectItem>
                                <SelectItem value="site_name">拠点名</SelectItem>
                                <SelectItem value="emission_value">排出量</SelectItem>
                                <SelectItem value="emission_unit">単位</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full">
                          + マッピングを追加
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transform-script">変換スクリプト（オプション）</Label>
                      <Textarea
                        id="transform-script"
                        className="font-mono h-32"
                        placeholder="// JavaScriptで変換ロジックを記述できます
function transform(data) {
  // データ変換処理
  return transformedData;
}"
                      />
                      <p className="text-xs text-gray-500">
                        取得したデータに対して変換処理を行う場合はJavaScriptで記述してください。
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
