import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Link2, Database, Cloud, Server, RefreshCw, Plus } from "lucide-react"

export default function ConnectorsPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">コネクタ設定</h1>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="active">アクティブなコネクタ</TabsTrigger>
          <TabsTrigger value="available">利用可能なコネクタ</TabsTrigger>
          <TabsTrigger value="logs">接続ログ</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">電力会社データコネクタ</CardTitle>
                  <Badge className="bg-green-100 text-green-800">アクティブ</Badge>
                </div>
                <CardDescription>電力会社からの使用量データを自動取得します</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-blue-500" />
                      <span>最終同期: 2023-04-15 10:30</span>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      今すぐ同期
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="connector-1-active" defaultChecked />
                    <Label htmlFor="connector-1-active">有効</Label>
                  </div>
                  <Button variant="outline" className="w-full">
                    設定を編集
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">ERPシステム連携</CardTitle>
                  <Badge className="bg-green-100 text-green-800">アクティブ</Badge>
                </div>
                <CardDescription>社内ERPシステムから部門・拠点データを同期します</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-5 w-5 text-purple-500" />
                      <span>最終同期: 2023-04-10 15:45</span>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      今すぐ同期
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="connector-2-active" defaultChecked />
                    <Label htmlFor="connector-2-active">有効</Label>
                  </div>
                  <Button variant="outline" className="w-full">
                    設定を編集
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">ガス会社データコネクタ</CardTitle>
                <CardDescription>ガス会社からの使用量データを自動取得します</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Cloud className="h-5 w-5 text-orange-500" />
                    <span>API連携</span>
                  </div>
                  <Button className="w-full">設定する</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">出張管理システム連携</CardTitle>
                <CardDescription>社内出張管理システムから出張データを同期します</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Link2 className="h-5 w-5 text-blue-500" />
                    <span>REST API</span>
                  </div>
                  <Button className="w-full">設定する</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">カスタムコネクタ</CardTitle>
                <CardDescription>独自のデータソースに接続するカスタムコネクタを作成します</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-gray-500" />
                    <span>カスタム開発</span>
                  </div>
                  <Button className="w-full">新規作成</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>接続ログ</CardTitle>
              <CardDescription>コネクタの接続ログを表示します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">電力会社データコネクタ</h3>
                      <p className="text-sm text-gray-500">2023-04-15 10:30:15</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">成功</Badge>
                  </div>
                  <p className="mt-2 text-sm">データ同期が正常に完了しました。取得レコード数: 45件</p>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">ERPシステム連携</h3>
                      <p className="text-sm text-gray-500">2023-04-10 15:45:22</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">成功</Badge>
                  </div>
                  <p className="mt-2 text-sm">データ同期が正常に完了しました。取得レコード数: 120件</p>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">電力会社データコネクタ</h3>
                      <p className="text-sm text-gray-500">2023-04-08 09:15:33</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">エラー</Badge>
                  </div>
                  <p className="mt-2 text-sm">API接続エラー: タイムアウトが発生しました。再試行してください。</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
