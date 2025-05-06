"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye } from "lucide-react"

type RecentActivityProps = {
  data:
    | {
        id: string
        user_email: string
        location_name: string
        department_name: string
        emission_factor_name: string
        activity_date: string
        activity_data: number
        emissions: number
        status: "pending" | "approved" | "rejected"
        created_at: string
        emission_factor_unit: string
        notes?: string
        rejection_reason?: string
      }[]
    | null
  isLoading: boolean
}

export function RecentActivity({ data, isLoading }: RecentActivityProps) {
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">最近のアクティビティはありません</p>
      </div>
    )
  }

  // ステータスに応じたバッジの表示
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50">
            承認待ち
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50">
            承認済み
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50">
            却下
          </Badge>
        )
      default:
        return <Badge variant="outline">不明</Badge>
    }
  }

  // 詳細ダイアログを開く
  const openDialog = (entry: any) => {
    setSelectedEntry(entry)
    setIsDialogOpen(true)
  }

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ステータス</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead>登録者</TableHead>
              <TableHead>拠点</TableHead>
              <TableHead>部門</TableHead>
              <TableHead>排出係数</TableHead>
              <TableHead>活動日</TableHead>
              <TableHead>排出量</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{getStatusBadge(entry.status)}</TableCell>
                <TableCell>{new Date(entry.created_at).toLocaleDateString("ja-JP")}</TableCell>
                <TableCell>{entry.user_email}</TableCell>
                <TableCell>{entry.location_name}</TableCell>
                <TableCell>{entry.department_name}</TableCell>
                <TableCell>{entry.emission_factor_name}</TableCell>
                <TableCell>{new Date(entry.activity_date).toLocaleDateString("ja-JP")}</TableCell>
                <TableCell>
                  {entry.emissions.toFixed(2)} {entry.emission_factor_unit?.split("/")[0] || ""}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(entry)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 詳細ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>データ詳細</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">ステータス</p>
                  <p>{getStatusBadge(selectedEntry.status)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">登録日</p>
                  <p>{new Date(selectedEntry.created_at).toLocaleDateString("ja-JP")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">登録者</p>
                  <p>{selectedEntry.user_email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">活動日</p>
                  <p>{new Date(selectedEntry.activity_date).toLocaleDateString("ja-JP")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">拠点</p>
                  <p>{selectedEntry.location_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">部門</p>
                  <p>{selectedEntry.department_name}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">排出係数</p>
                <p>{selectedEntry.emission_factor_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">活動量</p>
                  <p>
                    {selectedEntry.activity_data} {selectedEntry.emission_factor_unit?.split("/")[1] || ""}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">排出量</p>
                  <p>
                    {selectedEntry.emissions.toFixed(2)} {selectedEntry.emission_factor_unit?.split("/")[0] || ""}
                  </p>
                </div>
              </div>

              {selectedEntry.notes && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">備考</p>
                  <p className="text-sm">{selectedEntry.notes}</p>
                </div>
              )}

              {selectedEntry.status === "rejected" && selectedEntry.rejection_reason && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-500">却下理由</p>
                  <p className="text-sm">{selectedEntry.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
