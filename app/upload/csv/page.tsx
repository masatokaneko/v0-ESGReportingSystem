"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CsvTemplateDownload } from "@/components/connectors/csv-template-download"
import { MappingWizard } from "@/components/connectors/mapping-wizard"
import { Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// システムのターゲットフィールド
const TARGET_FIELDS = [
  { id: "company_code", name: "会社コード" },
  { id: "site_code", name: "拠点コード" },
  { id: "fiscal_year", name: "会計年度" },
  { id: "kpi_category", name: "KPIカテゴリ" },
  { id: "kpi_name", name: "KPI名" },
  { id: "value", name: "値" },
  { id: "unit", name: "単位" },
  { id: "source", name: "ソース" },
  { id: "note", name: "備考" },
]

export default function CsvUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [showMappingWizard, setShowMappingWizard] = useState(false)
  const [sourceFields, setSourceFields] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // CSVファイルのヘッダーを読み取る
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          const csvContent = event.target.result
          const lines = csvContent.split("\n")
          if (lines.length > 0) {
            const headers = lines[0].split(",").map((header) => header.trim())
            setSourceFields(headers)
            setShowMappingWizard(true)
          }
        }
      }
      reader.readAsText(selectedFile)
    }
  }

  const handleMappingComplete = (mapping: Record<string, string>) => {
    console.log("Mapping completed:", mapping)
    setShowMappingWizard(false)
    toast({
      title: "マッピングが完了しました",
      description: "CSVファイルのアップロードを続行できます。",
    })
  }

  const handleMappingCancel = () => {
    setShowMappingWizard(false)
    setFile(null)
  }

  const handleUpload = () => {
    if (!file) return

    toast({
      title: "アップロード完了",
      description: "CSVファイルが正常にアップロードされました。",
    })
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">CSVアップロード</h1>

      {showMappingWizard ? (
        <MappingWizard
          sourceFields={sourceFields}
          targetFields={TARGET_FIELDS}
          onComplete={handleMappingComplete}
          onCancel={handleMappingCancel}
        />
      ) : (
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
                  <Input type="file" accept=".csv" onChange={handleFileChange} />
                  <CsvTemplateDownload />
                </div>
                <p className="text-xs text-gray-500">
                  UTF-8エンコードのCSVファイルをアップロードしてください。ヘッダー行が必要です。
                </p>
              </div>

              <div className="flex justify-end">
                <Button className="flex items-center" onClick={handleUpload} disabled={!file}>
                  <Upload className="mr-2 h-4 w-4" />
                  アップロード
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
