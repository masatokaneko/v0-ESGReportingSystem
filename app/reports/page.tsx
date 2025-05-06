import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, FileText, FileIcon as FilePdf, FileSpreadsheet } from "lucide-react"

export default function ReportsPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">レポート出力</h1>

      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standard">標準レポート</TabsTrigger>
          <TabsTrigger value="custom">カスタムレポート</TabsTrigger>
          <TabsTrigger value="history">出力履歴</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <Card>
            <CardHeader>
              <CardTitle>標準レポート出力</CardTitle>
              <CardDescription>定型フォーマットのレポートを出力します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="report-type">レポートタイプ</Label>
                  <Select>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="レポートタイプを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">サマリーレポート</SelectItem>
                      <SelectItem value="detailed">詳細レポート</SelectItem>
                      <SelectItem value="compliance">法規制対応レポート</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">期間</Label>
                  <Select>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="期間を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-q1">2023年 第1四半期</SelectItem>
                      <SelectItem value="2023-q2">2023年 第2四半期</SelectItem>
                      <SelectItem value="2023-q3">2023年 第3四半期</SelectItem>
                      <SelectItem value="2023-q4">2023年 第4四半期</SelectItem>
                      <SelectItem value="2023-full">2023年 通年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="flex items-center">
                  <FilePdf className="mr-2 h-4 w-4" />
                  PDF形式で出力
                </Button>
                <Button className="flex items-center" variant="outline">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel形式で出力
                </Button>
                <Button className="flex items-center" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  CSV形式で出力
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>カスタムレポート出力</CardTitle>
              <CardDescription>必要な項目を選択してカスタムレポートを作成します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>カスタムレポート機能は準備中です。</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>レポート出力履歴</CardTitle>
              <CardDescription>過去に出力したレポートの履歴です</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium">サマリーレポート - 2023年 第1四半期</h3>
                      <p className="text-sm text-gray-500">2023-04-15 10:30 出力</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <FileDown className="mr-2 h-4 w-4" />
                      再ダウンロード
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium">詳細レポート - 2023年 第1四半期</h3>
                      <p className="text-sm text-gray-500">2023-04-10 14:45 出力</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <FileDown className="mr-2 h-4 w-4" />
                      再ダウンロード
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
