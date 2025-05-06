import { YamlUploadForm } from "@/components/connectors/yaml-upload-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "YAML設定アップロード - ESGレポーティングシステム",
  description: "DataGatewayAgentのYAML設定をアップロードします。",
}

export default function NewYamlPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/settings/connectors">
            <ChevronLeft className="h-4 w-4" />
            <span>戻る</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">YAML設定アップロード</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>DataGatewayAgent設定</CardTitle>
          <CardDescription>オンプレミス環境からデータを取得するためのYAML設定をアップロードします。</CardDescription>
        </CardHeader>
        <CardContent>
          <YamlUploadForm />
        </CardContent>
      </Card>
    </div>
  )
}
