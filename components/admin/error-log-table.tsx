"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ErrorSeverity, ErrorStatus } from "@/lib/error-logger"

interface ErrorLog {
  id: string
  error_type: string
  message: string
  stack_trace?: string
  component?: string
  route?: string
  severity: ErrorSeverity
  status: ErrorStatus
  created_at: string
  context?: any
  request_data?: any
}

interface ErrorLogTableProps {
  errorLogs: ErrorLog[]
}

export function ErrorLogTable({ errorLogs }: ErrorLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null)

  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case "info":
        return "bg-blue-100 text-blue-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "critical":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: ErrorStatus) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "ignored":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>発生日時</TableHead>
              <TableHead>エラータイプ</TableHead>
              <TableHead>メッセージ</TableHead>
              <TableHead>重要度</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>場所</TableHead>
              <TableHead>アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errorLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  エラーログがありません
                </TableCell>
              </TableRow>
            ) : (
              errorLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono">
                    {format(new Date(log.created_at), "yyyy/MM/dd HH:mm:ss", { locale: ja })}
                  </TableCell>
                  <TableCell className="font-mono">{log.error_type}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.message}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.route || log.component || "-"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                      詳細
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        {selectedLog && (
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>エラー詳細</DialogTitle>
              <DialogDescription>
                {format(new Date(selectedLog.created_at), "yyyy年MM月dd日 HH:mm:ss", { locale: ja })}に発生
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">エラータイプ</h3>
                <p className="font-mono bg-muted p-2 rounded-md">{selectedLog.error_type}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">メッセージ</h3>
                <p className="font-mono bg-muted p-2 rounded-md">{selectedLog.message}</p>
              </div>

              {selectedLog.stack_trace && (
                <div>
                  <h3 className="text-sm font-medium">スタックトレース</h3>
                  <pre className="font-mono text-xs bg-muted p-2 rounded-md overflow-x-auto">
                    {selectedLog.stack_trace}
                  </pre>
                </div>
              )}

              {selectedLog.context && (
                <div>
                  <h3 className="text-sm font-medium">コンテキスト</h3>
                  <pre className="font-mono text-xs bg-muted p-2 rounded-md overflow-x-auto">
                    {JSON.stringify(selectedLog.context, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.request_data && (
                <div>
                  <h3 className="text-sm font-medium">リクエストデータ</h3>
                  <pre className="font-mono text-xs bg-muted p-2 rounded-md overflow-x-auto">
                    {JSON.stringify(selectedLog.request_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
