"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { AgentConnection, ConnectionType } from "@/lib/connectors"
import { Download, Plus, QrCode, RefreshCw, Settings, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

// サンプルデータ
const SAMPLE_CONNECTIONS: AgentConnection[] = [
  {
    id: "agent-001",
    connection_name: "SCADA_FuelFlow",
    connection_type: "opcua",
    status: "online",
    last_heartbeat: "2023-05-01T12:34:56Z",
    schedule: "rate(5 minutes)",
    config: {
      endpoint_url: "opc.tcp://10.0.0.15:4840",
      node_ids: ["ns=2;s=Fuel_Flow_Rate", "ns=2;s=Boiler_MW"],
    },
    agent_token: "AGENT_TOKEN_12345",
  },
  {
    id: "agent-002",
    connection_name: "Factory_EnergyMeter",
    connection_type: "modbus_tcp",
    status: "online",
    last_heartbeat: "2023-05-01T12:30:00Z",
    schedule: "rate(15 minutes)",
    config: {
      host: "192.168.1.100",
      unitId: 1,
      registers: [100, 102, 104],
    },
    agent_token: "AGENT_TOKEN_67890",
  },
  {
    id: "agent-003",
    connection_name: "WarehouseDB",
    connection_type: "jdbc",
    status: "offline",
    last_heartbeat: "2023-04-30T23:45:12Z",
    schedule: "cron(0 0 * * *)",
    config: {
      db_type: "postgresql",
      host: "warehouse-db.internal",
      port: 5432,
      database: "logistics",
      user: "reporter",
    },
    agent_token: "AGENT_TOKEN_ABCDE",
  },
]

export default function AgentConnectorsPage() {
  const router = useRouter()
  const [connections, setConnections] = useState<AgentConnection[]>(SAMPLE_CONNECTIONS)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)

    // 実際の実装ではAPIからエージェント接続の最新状態を取得します
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "エージェント状態を更新しました",
        description: "すべてのエージェント接続の状態が更新されました。",
      })
    }, 1000)
  }

  const handleDelete = (connection: AgentConnection) => {
    // 実際の実装ではAPIに削除リクエストを送信します
    setConnections(connections.filter((c) => c.id !== connection.id))
    toast({
      title: "エージェント接続を削除しました",
      description: `${connection.connection_name} の接続設定が削除されました。`,
    })
  }

  const getConnectionTypeLabel = (type: ConnectionType) => {
    const labels: Record<ConnectionType, string> = {
      jdbc: "JDBC",
      odbc: "ODBC",
      sftp: "SFTP",
      filewatch: "ファイル監視",
      mqtt: "MQTT",
      opcua: "OPC UA",
      modbus_tcp: "Modbus TCP",
      rest_pull: "REST API",
      scada_socket: "SCADA Socket",
    }
    return labels[type] || type
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            オンライン
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            オフライン
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            エラー
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            不明
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">オンプレミスエージェント接続</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                更新中...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                状態を更新
              </>
            )}
          </Button>
          <Button onClick={() => router.push("/settings/connectors/new-yaml")}>
            <Plus className="mr-2 h-4 w-4" />
            YAML設定を追加
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>接続名</TableHead>
              <TableHead>接続タイプ</TableHead>
              <TableHead>スケジュール</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>最終ハートビート</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((connection) => (
              <TableRow key={connection.id}>
                <TableCell className="font-medium">{connection.connection_name}</TableCell>
                <TableCell>{getConnectionTypeLabel(connection.connection_type)}</TableCell>
                <TableCell>{connection.schedule}</TableCell>
                <TableCell>{getStatusBadge(connection.status)}</TableCell>
                <TableCell>
                  {connection.last_heartbeat ? new Date(connection.last_heartbeat).toLocaleString("ja-JP") : "なし"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="トークンを表示">
                      <QrCode className="h-4 w-4" />
                      <span className="sr-only">トークンを表示</span>
                    </Button>
                    <Button variant="ghost" size="icon" title="設定を編集">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">設定を編集</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="削除"
                      onClick={() => handleDelete(connection)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">削除</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-medium">DataGatewayAgentのダウンロード</h4>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                エージェントをダウンロード
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Windows (64bit)</DropdownMenuItem>
              <DropdownMenuItem>Linux (64bit)</DropdownMenuItem>
              <DropdownMenuItem>Docker Image</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground">
          DataGatewayAgentはオンプレミス環境からデータを安全に取得するためのツールです。
          DockerコンテナまたはWindowsサービスとして実行できます。
        </p>
      </div>
    </div>
  )
}
