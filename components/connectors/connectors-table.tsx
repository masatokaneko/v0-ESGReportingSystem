"use client"

import { useState } from "react"
import type { Connector } from "@/lib/connectors"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ConnectorStatusBadge } from "@/components/connectors/connector-status-badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock, Edit, MoreHorizontal, Play, RefreshCw, Trash2 } from "lucide-react"

interface ConnectorsTableProps {
  connectors: Connector[]
  onConnect?: (connector: Connector) => void
  onEdit?: (connector: Connector) => void
  onDelete?: (connector: Connector) => void
  onSync?: (connector: Connector) => void
}

export function ConnectorsTable({ connectors, onConnect, onEdit, onDelete, onSync }: ConnectorsTableProps) {
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = () => {
    if (selectedConnector && onDelete) {
      onDelete(selectedConnector)
      setIsDeleteDialogOpen(false)
      setSelectedConnector(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead>サンプルデータ</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>同期スケジュール</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connectors.map((connector) => (
              <TableRow key={connector.id || connector.name}>
                <TableCell className="font-medium">{connector.name}</TableCell>
                <TableCell>{connector.category}</TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">{connector.sampleData.join(", ")}</div>
                </TableCell>
                <TableCell>
                  {connector.status ? (
                    <ConnectorStatusBadge status={connector.status} />
                  ) : (
                    <ConnectorStatusBadge status="disconnected" />
                  )}
                </TableCell>
                <TableCell>
                  {connector.syncSchedule ? (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{connector.syncSchedule}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">未設定</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">操作メニュー</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {connector.status !== "connected" && onConnect && (
                        <DropdownMenuItem onClick={() => onConnect(connector)}>
                          <Play className="mr-2 h-4 w-4" />
                          <span>接続する</span>
                        </DropdownMenuItem>
                      )}
                      {connector.status === "connected" && onSync && (
                        <DropdownMenuItem onClick={() => onSync(connector)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          <span>今すぐ同期</span>
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(connector)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>設定を編集</span>
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedConnector(connector)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>削除</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>コネクタの削除</DialogTitle>
            <DialogDescription>このコネクタを削除してもよろしいですか？この操作は元に戻せません。</DialogDescription>
          </DialogHeader>
          {selectedConnector && (
            <div className="py-4">
              <p>
                <span className="font-medium">{selectedConnector.name}</span> コネクタを削除します。
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                関連するすべての接続設定とスケジュールが削除されます。
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
