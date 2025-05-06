import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ManualEntryForm from "@/components/data-entry/manual-entry-form"
import CsvUploadForm from "@/components/data-entry/csv-upload-form"
import PdfUploadForm from "@/components/data-entry/pdf-upload-form"

export default function DataEntryPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">データ登録</h1>

      <Card>
        <CardHeader>
          <CardTitle>排出量データ登録</CardTitle>
          <CardDescription>CO2排出量データを登録します</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual">手動入力</TabsTrigger>
              <TabsTrigger value="csv">CSVアップロード</TabsTrigger>
              <TabsTrigger value="pdf">PDF/OCRアップロード</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <ManualEntryForm />
            </TabsContent>
            <TabsContent value="csv">
              <CsvUploadForm />
            </TabsContent>
            <TabsContent value="pdf">
              <PdfUploadForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
