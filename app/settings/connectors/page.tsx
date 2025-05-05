import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "コネクタ設定 - ESGレポーティングシステム",
  description: "外部システムとの接続設定を管理します。",
}

export default function ConnectorsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">コネクタ設定</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>外部システム接続</CardTitle>
          <CardDescription>外部システムとの接続設定を管理し、データを自動的に取得します。</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cloud" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cloud">クラウドSaaS</TabsTrigger>
              <TabsTrigger value="agent">オンプレミスエージェント</TabsTrigger>
            </TabsList>
            <TabsContent value="cloud">
              <iframe src="/settings/connectors/cloud" className="w-full h-[600px] border-none" />
            </TabsContent>
            <TabsContent value="agent">
              <iframe src="/settings/connectors/agent" className="w-full h-[600px] border-none" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
