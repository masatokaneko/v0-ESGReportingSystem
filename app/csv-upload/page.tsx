import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileType, Download } from "lucide-react"

export default function CsvUploadPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">CSVアップロード</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>CSVファイルアップロード</CardTitle>
          <CardDescription>CSVファイルを使用してデータを一括登録します</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="data-type">データタイプ</Label>
                <Select>
                  <SelectTrigger id="data-type">
                    <SelectValue placeholder="データタイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emissions">排出量データ</SelectItem>
                    <SelectItem value="factors">排出係数データ</SelectItem>
                    <SelectItem value="locations">拠点データ</SelectItem>
                    <SelectItem value="departments">部門データ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">対象期間</Label>
                <Select>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="対象期間を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-q1">2023年 第1四半期</SelectItem>
                    <SelectItem value="2023-q2">2023年 第2四半期</SelectItem>
                    <SelectItem value="2023-q3">2023年 第3四半期</SelectItem>
                    <SelectItem value="2023-q4">2023年 第4四半期</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csv-file">CSVファイル</Label>
              <div className="flex items-center gap-4">
                <Input id="csv-file" type="file" accept=".csv" />
                <Button variant="outline" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  テンプレートダウンロード
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                アップロード
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>アップロード履歴</CardTitle>
          <CardDescription>過去のCSVアップロード履歴です</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-medium">排出量データ - 2023年 第1四半期</h3>
                  <p className="text-sm text-gray-500">2023-04-15 10:30 アップロード</p>
                  <p className="text-sm text-green-600">成功: 150件</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FileType className="mr-2 h-4 w-4" />
                    ログ確認
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-medium">排出係数データ - 2023年</h3>
                  <p className="text-sm text-gray-500">2023-03-20 14:45 アップロード</p>
                  <p className="text-sm text-yellow-600">成功: 45件, エラー: 5件</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FileType className="mr-2 h-4 w-4" />
                    ログ確認
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
