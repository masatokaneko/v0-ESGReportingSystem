"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConnectorsTable } from "@/components/connectors/connectors-table"
import { type Connector, DEFAULT_CONNECTORS } from "@/lib/connectors"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CloudConnectorsPage() {
  const router = useRouter()
  const [connectors, setConnectors] = useState<Connector[]>(
    DEFAULT_CONNECTORS.map((connector, index) => ({
      ...connector,
      id: `connector-${index}`,
      status: Math.random() > 0.7 ? "connected" : "disconnected",
      syncSchedule: Math.random() > 0.5 ? "毎日 00:00" : undefined,
    })),
  )

  const handleConnect = (connector: Connector) => {
    // 実際の実装ではAPIに接続リクエストを送信します
    setConnectors(connectors.map((c) => (c.id === connector.id ? { ...c, status: "connected" } : c)))
  }

  const handleEdit = (connector: Connector) => {
    // 実際の実装では編集画面に遷移します
    console.log("Edit connector:", connector)
  }

  const handleDelete = (connector: Connector) => {
    // 実際の実装ではAPIに削除リクエストを送信します
    setConnectors(connectors.filter((c) => c.id !== connector.id))
  }

  const handleSync = (connector: Connector) => {
    // 実際の実装ではAPIに同期リクエストを送信します
    console.log("Sync connector:", connector)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">クラウドSaaSコネクタ</h3>
        <Button onClick={() => router.push("/settings/connectors/new")}>
          <Plus className="mr-2 h-4 w-4" />
          新規接続
        </Button>
      </div>

      <ConnectorsTable
        connectors={connectors}
        onConnect={handleConnect}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSync={handleSync}
      />
    </div>
  )
}
