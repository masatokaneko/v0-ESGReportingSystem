import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectorsTable } from "@/components/connectors/connectors-table"
import { ConnectionHistory } from "@/components/connectors/connection-history"
import { DEFAULT_CONNECTORS } from "@/lib/connectors/connector-catalog"
import { CsvTemplateDownload } from "@/components/connectors/csv-template-download"

export default function CloudConnectorsPage() {
  // 実際のアプリケーションでは、ここでAPIからデータを取得
  const cloudConnectors = DEFAULT_CONNECTORS.map((connector) => ({
    ...connector,
    status: connector.name === "SAP S/4HANA Cloud" ? "connected" : "disconnected",
  }))

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">コネクタ設定</h1>
        <CsvTemplateDownload />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">外部システム接続</CardTitle>
          <CardDescription>外部システムとの接続設定を管理し、データを自動的に取得します。</CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectorsTable connectors={cloudConnectors} type="cloud" />
        </CardContent>
      </Card>

      <ConnectionHistory />
    </main>
  )
}
