import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Plus } from "lucide-react"

export default function ConnectorsPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">コネクタ設定</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>外部システム接続</CardTitle>
          <CardDescription>外部システムとの接続設定を管理し、データを自動的に取得します。</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cloud" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="cloud">クラウドSaaS</TabsTrigger>
              <TabsTrigger value="onpremise">オンプレミスエージェント</TabsTrigger>
            </TabsList>

            <TabsContent value="cloud">
              <div className="flex justify-end mb-4">
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  新規接続
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名前</TableHead>
                      <TableHead>カテゴリ</TableHead>
                      <TableHead>サンプルデータ</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>同期スケジュール</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">SAP S/4HANA Cloud</TableCell>
                      <TableCell>FinanceERP</TableCell>
                      <TableCell>JournalEntry, FuelExpense, ...</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">接続済み</Badge>
                      </TableCell>
                      <TableCell>未設定</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Oracle Fusion ERP</TableCell>
                      <TableCell>FinanceERP</TableCell>
                      <TableCell>GL, PO, Inventory</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100">
                          未接続
                        </Badge>
                      </TableCell>
                      <TableCell>未設定</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Microsoft Dynamics 365 Finance</TableCell>
                      <TableCell>FinanceERP</TableCell>
                      <TableCell>Voucher, VendorInvoice</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100">
                          未接続
                        </Badge>
                      </TableCell>
                      <TableCell>未設定</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="onpremise">
              <div className="flex justify-end mb-4">
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  新規接続
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名前</TableHead>
                      <TableHead>カテゴリ</TableHead>
                      <TableHead>エージェントステータス</TableHead>
                      <TableHead>最終同期</TableHead>
                      <TableHead>同期スケジュール</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">社内ERPシステム</TableCell>
                      <TableCell>FinanceERP</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">オンライン</Badge>
                      </TableCell>
                      <TableCell>2023-04-15 10:30</TableCell>
                      <TableCell>毎日 00:00</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">電力管理システム</TableCell>
                      <TableCell>UtilitySystem</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          オフライン
                        </Badge>
                      </TableCell>
                      <TableCell>2023-04-10 15:45</TableCell>
                      <TableCell>毎週月曜 09:00</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
                  <h3 className="font-medium">SAP S/4HANA Cloud</h3>
                  <p className="text-sm text-gray-500">2023-04-15 10:30:15</p>
                </div>
                <Badge className="bg-green-100 text-green-800">成功</Badge>
              </div>
              <p className="mt-2 text-sm">データ同期が正常に完了しました。取得レコード数: 45件</p>
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">社内ERPシステム</h3>
                  <p className="text-sm text-gray-500">2023-04-10 15:45:22</p>
                </div>
                <Badge className="bg-green-100 text-green-800">成功</Badge>
              </div>
              <p className="mt-2 text-sm">データ同期が正常に完了しました。取得レコード数: 120件</p>
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">電力管理システム</h3>
                  <p className="text-sm text-gray-500">2023-04-08 09:15:33</p>
                </div>
                <Badge className="bg-red-100 text-red-800">エラー</Badge>
              </div>
              <p className="mt-2 text-sm">API接続エラー: タイムアウトが発生しました。再試行してください。</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
