"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type ConnectionHistoryItem = {
  id: string
  connectorName: string
  sourceSystem: string
  timestamp: string
  status: "success" | "error" | "warning"
  message: string
  recordCount?: number
}

const MOCK_HISTORY: ConnectionHistoryItem[] = [
  {
    id: "1",
    connectorName: "SAP S/4HANA Cloud",
    sourceSystem: "SAP S/4HANA (API)",
    timestamp: "2023-04-15 10:30:15",
    status: "success",
    message: "データ同期が正常に完了しました。",
    recordCount: 45,
  },
  {
    id: "2",
    connectorName: "社内ERPシステム",
    sourceSystem: "社内ERP (Agent)",
    timestamp: "2023-04-10 15:45:22",
    status: "success",
    message: "データ同期が正常に完了しました。",
    recordCount: 120,
  },
  {
    id: "3",
    connectorName: "電力管理システム",
    sourceSystem: "SCADA_FuelFlow (Agent)",
    timestamp: "2023-04-08 09:15:33",
    status: "error",
    message: "API接続エラー: タイムアウトが発生しました。再試行してください。",
  },
  {
    id: "4",
    connectorName: "Freee",
    sourceSystem: "Freee (API)",
    timestamp: "2023-04-05 14:22:10",
    status: "warning",
    message: "一部のデータが取得できませんでした。",
    recordCount: 67,
  },
]

export function ConnectionHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>接続履歴</CardTitle>
        <CardDescription>コネクタの接続履歴を表示します</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>コネクタ名</TableHead>
              <TableHead>ソースシステム</TableHead>
              <TableHead>タイムスタンプ</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>メッセージ</TableHead>
              <TableHead>レコード数</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_HISTORY.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.connectorName}</TableCell>
                <TableCell>{item.sourceSystem}</TableCell>
                <TableCell>{item.timestamp}</TableCell>
                <TableCell>
                  {item.status === "success" && (
                    <Badge className="bg-green-100 text-green-800 font-normal rounded-full px-3">成功</Badge>
                  )}
                  {item.status === "error" && (
                    <Badge className="bg-red-100 text-red-800 font-normal rounded-full px-3">エラー</Badge>
                  )}
                  {item.status === "warning" && (
                    <Badge className="bg-yellow-100 text-yellow-800 font-normal rounded-full px-3">警告</Badge>
                  )}
                </TableCell>
                <TableCell>{item.message}</TableCell>
                <TableCell>{item.recordCount || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
