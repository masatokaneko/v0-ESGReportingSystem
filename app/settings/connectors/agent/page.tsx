import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectorsTable } from "@/components/connectors/connectors-table"
import { ConnectionHistory } from "@/components/connectors/connection-history"
import { AgentDownload } from "@/components/connectors/agent-download"
import { CsvTemplateDownload } from "@/components/connectors/csv-template-download"

export default function AgentConnectorsPage() {
  // モックデータ
  const agentConnectors = [
    {
      name: "社内ERPシステム",
      category: "FinanceERP",
      sampleData: ["JournalEntry", "FuelExpense", "Asset"],
      status: "connected",
      syncSchedule: "毎日 00:00",
    },
    {
      name: "電力管理システム",
      category: "EnergyEMS",
      sampleData: ["MeterReading", "Cost", "FuelType"],
      status: "disconnected",
      syncSchedule: "毎週月曜 09:00",
    },
  ]

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">コネクタ設定</h1>
        <CsvTemplateDownload />
      </div>

      <AgentDownload />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">外部システム接続</CardTitle>
          <CardDescription>外部システムとの接続設定を管理し、データを自動的に取得します。</CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectorsTable connectors={agentConnectors} type="agent" />
        </CardContent>
      </Card>

      <ConnectionHistory />
    </main>
  )
}
