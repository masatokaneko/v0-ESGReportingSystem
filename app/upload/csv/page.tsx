"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadDialog } from "@/components/upload/upload-dialog"
import { MappingWizard } from "@/components/upload/mapping-wizard"
import { Download, Upload } from "lucide-react"
import Link from "next/link"

// サンプルCSVヘッダー
const SAMPLE_CSV_HEADERS = [
  "Company",
  "Site",
  "Year",
  "Category",
  "KPI",
  "Amount",
  "UnitOfMeasure",
  "Source",
  "Comments",
]

export default function CsvUploadPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [showMappingWizard, setShowMappingWizard] = useState(false)

  const handleUploadComplete = () => {
    // 実際の実装ではCSVヘッダーを解析し、必要に応じてマッピングウィザードを表示します
    setShowMappingWizard(true)
  }

  const handleMappingComplete = (mapping: Record<string, string>) => {
    console.log("Mapping complete:", mapping)
    setShowMappingWizard(false)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">CSVアップロード</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ESGデータのCSVアップロード</CardTitle>
          <CardDescription>
            CSVファイルからESGデータをインポートします。テンプレートに沿ったフォーマットを使用してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showMappingWizard ? (
            <MappingWizard
              csvHeaders={SAMPLE_CSV_HEADERS}
              onComplete={handleMappingComplete}
              onCancel={() => setShowMappingWizard(false)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Upload className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">CSVファイルをアップロード</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                CSVファイルからESGデータをインポートします。テンプレートをダウンロードして、
                フォーマットに沿ってデータを準備してください。
              </p>
              <div className="flex gap-4">
                <Button onClick={() => setIsUploadDialogOpen(true)}>CSVファイルを選択</Button>
                <Button variant="outline" asChild>
                  <Link href="/upload/csv/templates">
                    <Download className="mr-2 h-4 w-4" />
                    テンプレートを取得
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}
