import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CsvTemplateDownload } from "@/components/connectors/csv-template-download"
import { Upload } from "lucide-react"

export default function CsvUploadPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">CSVアップロード</h1>

      <Card>
        <CardHeader>
          <CardTitle>CSVファイルアップロード</CardTitle>
          <CardDescription>CSVファイルを使用してデータを一括登録します</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">CSVファイル</label>
              <div className="flex items-center gap-4">
                <Input type="file" accept=".csv" />
                <CsvTemplateDownload />
              </div>
              <p className="text-xs text-gray-500">
                UTF-8エンコードのCSVファイルをアップロードしてください。ヘッダー行が必要です。
              </p>
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
    </main>
  )
}
