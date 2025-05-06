"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadIcon as FileUpload, FileText, Edit } from "lucide-react"
import { ManualEntryForm } from "@/components/data-entry/manual-entry-form"
import { CsvUploadForm } from "@/components/data-entry/csv-upload-form"
import { PdfUploadForm } from "@/components/data-entry/pdf-upload-form"

export default function DataEntryPage() {
  const [activeTab, setActiveTab] = useState("manual")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">データ登録</h1>

      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span>手動入力</span>
          </TabsTrigger>
          <TabsTrigger value="csv" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>CSVアップロード</span>
          </TabsTrigger>
          <TabsTrigger value="pdf" className="flex items-center gap-2">
            <FileUpload className="h-4 w-4" />
            <span>PDF/OCRアップロード</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>手動データ入力</CardTitle>
                <CardDescription>排出量データを手動で入力します</CardDescription>
              </CardHeader>
              <CardContent>
                <ManualEntryForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv">
            <Card>
              <CardHeader>
                <CardTitle>CSVファイルアップロード</CardTitle>
                <CardDescription>CSVファイルから排出量データを一括登録します</CardDescription>
              </CardHeader>
              <CardContent>
                <CsvUploadForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdf">
            <Card>
              <CardHeader>
                <CardTitle>PDF/OCRアップロード</CardTitle>
                <CardDescription>PDFファイルから排出量データを抽出して登録します</CardDescription>
              </CardHeader>
              <CardContent>
                <PdfUploadForm />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
