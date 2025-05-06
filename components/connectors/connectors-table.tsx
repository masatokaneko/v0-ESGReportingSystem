"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus } from "lucide-react"
import type { ConnectorType } from "@/lib/connectors/connector-catalog"
import { useRouter } from "next/navigation"

interface ConnectorsTableProps {
  connectors: ConnectorType[]
  type: "cloud" | "agent"
}

export function ConnectorsTable({ connectors, type }: ConnectorsTableProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<string | null>(null)

  const filteredConnectors = filter ? connectors.filter((connector) => connector.category === filter) : connectors

  const handleNewConnection = () => {
    if (type === "cloud") {
      router.push("/settings/connectors/cloud/new")
    } else {
      router.push("/settings/connectors/agent/new-yaml")
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">
          {type === "cloud" ? "クラウドSaaSコネクタ" : "オンプレミスエージェント"}
        </h2>
        <div className="flex justify-end">
          <Button className="flex items-center bg-blue-900 hover:bg-blue-800" onClick={handleNewConnection}>
            <Plus className="mr-2 h-4 w-4" />
            {type === "cloud" ? "新規接続" : "YAMLアップロード"}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="py-3">名前</TableHead>
              <TableHead className="py-3">カテゴリ</TableHead>
              <TableHead className="py-3">サンプルデータ</TableHead>
              <TableHead className="py-3">ステータス</TableHead>
              <TableHead className="py-3">同期スケジュール</TableHead>
              <TableHead className="py-3">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConnectors.map((connector, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{connector.name}</TableCell>
                <TableCell>{connector.category}</TableCell>
                <TableCell>{connector.sampleData.join(", ")}</TableCell>
                <TableCell>
                  {connector.status === "connected" ? (
                    <Badge className="bg-green-100 text-green-800 font-normal rounded-full px-3">接続済み</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 font-normal rounded-full px-3">
                      未接続
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{connector.syncSchedule || "未設定"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
