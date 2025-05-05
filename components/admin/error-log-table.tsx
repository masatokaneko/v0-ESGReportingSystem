"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
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
  resolved_at?: string
  resolution_notes?: string
  context?: any
  request_data?: any
}

interface ErrorLogTableProps {
  errorLogs: ErrorLog[]
}

export function ErrorLogTable({ errorLogs }: ErrorLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<ErrorStatus>("open")
  const [resolutionNotes, setResolutionNotes] = useState("")

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

  const handleUpdateStatus = async () => {
    if (!selectedLog) return

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/error-logs/${selectedLog.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          resolution_notes: resolutionNotes,
          resolved_at: newStatus === "resolved" ? new Date().toISOString() : null,
        }),
      })

      if (!response.ok) {
        throw new Error("ステータスの更新に失敗しました")
      }

      toast({
        title: "ステータスを更新しました",
        description: `エラーログのステータスを「${newStatus}」に更新しました`,
      })

      // ダイアログを閉じる
      setSelectedLog(null)

      // ページをリロード
      window.location.reload()
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "ステータスの更新に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedLog(log)
                        setNewStatus(log.status)
                        setResolutionNotes(log.resolution_notes || "")
                      }}
                    >
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

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">ステータス更新</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">新しいステータス</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">未対応</SelectItem>
                        <SelectItem value="in_progress">対応中</SelectItem>
                        <SelectItem value="resolved">解決済み</SelectItem>
                        <SelectItem value="ignored">無視</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">解決メモ</label>
                    <Textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="エラーの解決方法や対応内容を記録"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                キャンセル
              </Button>
              <Button onClick={handleUpdateStatus} disabled={isUpdating}>
                {isUpdating ? "更新中..." : "ステータスを更新"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
