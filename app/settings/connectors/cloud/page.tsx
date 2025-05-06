import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConnectorsTable } from "@/components/connectors/connectors-table"
import { ConnectionHistory } from "@/components/connectors/connection-history"
import { DEFAULT_CONNECTORS } from "@/lib/connectors/connector-catalog"
import { CsvTemplateDownload } from "@/components/connectors/csv-template-download"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function CloudConnectorsPage() {
  // 実際のアプリケーションでは、ここでAPIからデータを取得
  const cloudConnectors = DEFAULT_CONNECTORS.map((connector) => ({
    ...connector,
    status:
      connector.name === "SAP S/4HANA Cloud" || connector.name === "Salesforce" || connector.name === "Workday"
        ? "connected"
        : "disconnected",
  }))

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">コネクタ設定</h1>
        <div className="flex gap-2">
          <CsvTemplateDownload />
          <Link href="/settings/connectors/cloud/new">
            <Button className="flex items-center bg-blue-900 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              新規接続
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">SaaSコネクタ</CardTitle>
          <CardDescription>主要なSaaSサービスとの接続状態</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Link href="/settings/connectors/cloud/salesforce" className="block">
              <Card className="hover:bg-gray-50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <img src="/salesforce-concept.png" alt="Salesforce" className="w-10 h-10 mr-3 rounded-md" />
                    <div>
                      <h3 className="font-medium">Salesforce</h3>
                      <p className="text-sm text-green-600">接続済み</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/settings/connectors/cloud/workday" className="block">
              <Card className="hover:bg-gray-50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <img src="/placeholder.svg?key=2vdf7" alt="Workday" className="w-10 h-10 mr-3 rounded-md" />
                    <div>
                      <h3 className="font-medium">Workday</h3>
                      <p className="text-sm text-green-600">接続済み</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/settings/connectors/cloud/sap" className="block">
              <Card className="hover:bg-gray-50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <img src="/sap-logo.png" alt="SAP" className="w-10 h-10 mr-3 rounded-md" />
                    <div>
                      <h3 className="font-medium">SAP S/4HANA Cloud</h3>
                      <p className="text-sm text-green-600">接続済み</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <ConnectorsTable connectors={cloudConnectors} type="cloud" />
        </CardContent>
      </Card>

      <ConnectionHistory />
    </main>
  )
}
