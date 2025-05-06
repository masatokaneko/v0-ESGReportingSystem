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

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">外部システム接続</CardTitle>
          <CardDescription>外部システムとの接続設定を管理し、データを自動的に取得します。</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cloud" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="cloud" className="py-3">
                クラウドSaaS
              </TabsTrigger>
              <TabsTrigger value="onpremise" className="py-3">
                オンプレミスエージェント
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cloud">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4">クラウドSaaSコネクタ</h2>
                <div className="flex justify-end">
                  <Button className="flex items-center bg-blue-900 hover:bg-blue-800">
                    <Plus className="mr-2 h-4 w-4" />
                    新規接続
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="py-3">名前</TableHead>
                      <TableHead className="py-3">カテゴリ</TableHead>
                      <TableHead className="py-3">サンプルデータ</TableHead>
                      <TableHead className="py-3">ステータス</TableHead>
                      <TableHead className="py-3">同期スケジュール</TableHead>
                      <TableHead className="py-3">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">SAP S/4HANA Cloud</TableCell>
                      <TableCell>FinanceERP</TableCell>
                      <TableCell>JournalEntry, FuelExpense, ...</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 font-normal rounded-full px-3">接続済み</Badge>
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
                        <Badge variant="outline" className="bg-gray-100 font-normal rounded-full px-3">
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
                        <Badge variant="outline" className="bg-gray-100 font-normal rounded-full px-3">
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
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-4">オンプレミスエージェント</h2>
                <div className="flex justify-end">
                  <Button className="flex items-center bg-blue-900 hover:bg-blue-800">
                    <Plus className="mr-2 h-4 w-4" />
                    新規接続
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="py-3">名前</TableHead>
                      <TableHead className="py-3">カテゴリ</TableHead>
                      <TableHead className="py-3">エージェントステータス</TableHead>
                      <TableHead className="py-3">最終同期</TableHead>
                      <TableHead className="py-3">同期スケジュール</TableHead>
                      <TableHead className="py-3">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">社内ERPシステム</TableCell>
                      <TableCell>FinanceERP</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 font-normal rounded-full px-3">オンライン</Badge>
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
                        <Badge variant="outline" className="bg-red-100 text-red-800 font-normal rounded-full px-3">
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
    </main>
  )
}
