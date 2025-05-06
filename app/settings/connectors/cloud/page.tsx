import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectionHistory } from "@/components/connectors/connection-history"
import { DEFAULT_CONNECTORS, getConnectorsByCategory } from "@/lib/connectors/connector-catalog"
import { CsvTemplateDownload } from "@/components/connectors/csv-template-download"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CloudConnectorsPage() {
  // 実際のアプリケーションでは、ここでAPIからデータを取得
  const connectedSystems = ["Salesforce", "Workday", "SAP S/4HANA Cloud", "Freee", "EnergyCAP", "Watershed", "Box"]

  const cloudConnectors = DEFAULT_CONNECTORS.map((connector) => ({
    ...connector,
    status: connectedSystems.includes(connector.name) ? "connected" : "disconnected",
  }))

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">外部システム連携設定</h1>
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

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="システム名で検索..." className="pl-10" />
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="Accounting">会計</TabsTrigger>
          <TabsTrigger value="CRM">CRM</TabsTrigger>
          <TabsTrigger value="SCM">SCM/調達</TabsTrigger>
          <TabsTrigger value="EnergyEMS">エネルギー</TabsTrigger>
          <TabsTrigger value="HRSafety">HR/安全</TabsTrigger>
          <TabsTrigger value="Sustainability">サステナビリティ</TabsTrigger>
          <TabsTrigger value="Document">ドキュメント</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ConnectorCategorySection
            title="会計システム"
            connectors={getConnectorsByCategory("Accounting")}
            connectedSystems={connectedSystems}
          />
          <ConnectorCategorySection
            title="CRM/契約管理"
            connectors={getConnectorsByCategory("CRM")}
            connectedSystems={connectedSystems}
          />
          <ConnectorCategorySection
            title="SCM/調達"
            connectors={getConnectorsByCategory("SCM")}
            connectedSystems={connectedSystems}
          />
          <ConnectorCategorySection
            title="エネルギー・メーター管理"
            connectors={getConnectorsByCategory("EnergyEMS")}
            connectedSystems={connectedSystems}
          />
          <ConnectorCategorySection
            title="HR/安全管理"
            connectors={getConnectorsByCategory("HRSafety")}
            connectedSystems={connectedSystems}
          />
          <ConnectorCategorySection
            title="サステナビリティプラットフォーム"
            connectors={getConnectorsByCategory("Sustainability")}
            connectedSystems={connectedSystems}
          />
          <ConnectorCategorySection
            title="ドキュメントストレージ"
            connectors={getConnectorsByCategory("Document")}
            connectedSystems={connectedSystems}
          />
        </TabsContent>

        <TabsContent value="Accounting">
          <ConnectorCategorySection
            title="会計システム"
            connectors={getConnectorsByCategory("Accounting")}
            connectedSystems={connectedSystems}
            showAll
          />
        </TabsContent>

        <TabsContent value="CRM">
          <ConnectorCategorySection
            title="CRM/契約管理"
            connectors={getConnectorsByCategory("CRM")}
            connectedSystems={connectedSystems}
            showAll
          />
        </TabsContent>

        <TabsContent value="SCM">
          <ConnectorCategorySection
            title="SCM/調達"
            connectors={getConnectorsByCategory("SCM")}
            connectedSystems={connectedSystems}
            showAll
          />
        </TabsContent>

        <TabsContent value="EnergyEMS">
          <ConnectorCategorySection
            title="エネルギー・メーター管理"
            connectors={getConnectorsByCategory("EnergyEMS")}
            connectedSystems={connectedSystems}
            showAll
          />
        </TabsContent>

        <TabsContent value="HRSafety">
          <ConnectorCategorySection
            title="HR/安全管理"
            connectors={getConnectorsByCategory("HRSafety")}
            connectedSystems={connectedSystems}
            showAll
          />
        </TabsContent>

        <TabsContent value="Sustainability">
          <ConnectorCategorySection
            title="サステナビリティプラットフォーム"
            connectors={getConnectorsByCategory("Sustainability")}
            connectedSystems={connectedSystems}
            showAll
          />
        </TabsContent>

        <TabsContent value="Document">
          <ConnectorCategorySection
            title="ドキュメントストレージ"
            connectors={getConnectorsByCategory("Document")}
            connectedSystems={connectedSystems}
            showAll
          />
        </TabsContent>
      </Tabs>

      <ConnectionHistory />
    </main>
  )
}

// カテゴリごとのコネクタセクションを表示するコンポーネント
function ConnectorCategorySection({
  title,
  connectors,
  connectedSystems,
  showAll = false,
}: {
  title: string
  connectors: any[]
  connectedSystems: string[]
  showAll?: boolean
}) {
  // デフォルトでは最大3つまで表示
  const displayConnectors = showAll ? connectors : connectors.slice(0, 3)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>
          {connectors.filter((c) => connectedSystems.includes(c.name)).length}個のシステムが接続済み
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {displayConnectors.map((connector) => {
            const slug = connector.name.toLowerCase().replace(/\s+/g, "-")
            const isConnected = connectedSystems.includes(connector.name)

            return (
              <Link href={`/settings/connectors/cloud/${slug}`} key={connector.name} className="block">
                <Card className="hover:bg-gray-50 transition-colors h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <img
                        src={`/abstract-geometric-shapes.png?height=40&width=40&query=${encodeURIComponent(connector.name)}`}
                        alt={connector.name}
                        className="w-10 h-10 mr-3 rounded-md"
                      />
                      <div>
                        <h3 className="font-medium">{connector.name}</h3>
                        <p className={`text-sm ${isConnected ? "text-green-600" : "text-gray-500"}`}>
                          {isConnected ? "接続済み" : "未接続"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}

          {!showAll && connectors.length > 3 && (
            <Link href={`?category=${connectors[0].category}`} className="block">
              <Card className="hover:bg-gray-50 transition-colors border-dashed h-full">
                <CardContent className="p-6 flex items-center justify-center h-full">
                  <Button variant="outline">すべて表示 ({connectors.length})</Button>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
