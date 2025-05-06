import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TemplateGallery } from "@/components/upload/template-gallery"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CSVテンプレート - ESGレポーティングシステム",
  description: "ESGデータ用のCSVテンプレートをダウンロードします。",
}

export default function CsvTemplatesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/upload/csv">
            <ChevronLeft className="h-4 w-4" />
            <span>戻る</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">CSVテンプレート</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ESGデータ用CSVテンプレート</CardTitle>
          <CardDescription>
            ESGデータをインポートするための標準CSVテンプレートをダウンロードできます。
            目的に合ったテンプレートを選択し、データを入力してアップロードしてください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateGallery />
        </CardContent>
      </Card>
    </div>
  )
}
