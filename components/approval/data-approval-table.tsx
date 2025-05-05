"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Check, FileText, X } from "lucide-react"
import { DataDetailDialog } from "./data-detail-dialog"
import type { ApprovalFilters } from "./data-approval-filters"

interface DataEntry {
  id: number
  entry_date: string
  location?: { id: number; name: string; code: string } | null
  department?: { id: number; name: string; code: string } | null
  activity_type: string
  activity_amount: number
  emission_factor?: { id: number; activity_type: string; factor: number; unit: string } | null
  emission: number
  status: "pending" | "approved" | "rejected"
  submitter: string
  submitted_at: string
  notes?: string
  approved_by?: string
  approved_at?: string
}

interface DataApprovalTableProps {
  filters: ApprovalFilters
}

export function DataApprovalTable({ filters }: DataApprovalTableProps) {
  const [data, setData] = useState<DataEntry[]>([])
  const [selectedItem, setSelectedItem] = useState<DataEntry | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // データの取得
  useEffect(() => {
    fetchData(filters)
  }, [filters])

  const fetchData = async (filters: ApprovalFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      // クエリパラメータの構築
      const queryParams = new URLSearchParams()
      if (filters.keyword) queryParams.append("keyword", filters.keyword)
      if (filters.location_id) queryParams.append("location_id", filters.location_id.toString())
      if (filters.department_id) queryParams.append("department_id", filters.department_id.toString())
      if (filters.status) queryParams.append("status", filters.status)

      const url = `/api/data-entries${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch data entries")
      }

      const fetchedData = await response.json()

      // データの整合性チェックと修正
      const sanitizedData = fetchedData.map((item: any) => ({
        ...item,
        // locationとdepartmentがnullの場合のフォールバック
        location: item.location || { id: 0, name: "未設定", code: "N/A" },
        department: item.department || { id: 0, name: "未設定", code: "N/A" },
        emission_factor: item.emission_factor || { id: 0, activity_type: item.activity_type, factor: 0, unit: "N/A" },
      }))

      setData(sanitizedData)
    } catch (error) {
      console.error("Error fetching data entries:", error)
      setError(error instanceof Error ? error.message : "データの取得に失敗しました")
      toast({
        title: "エラー",
        description: "データの取得に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedItem) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/data-entries/${selectedItem.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approved_by: "現在のユーザー", // 実際の実装ではログインユーザー情報を使用
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to approve data entry")
      }

      const updatedEntry = await response.json()
      setData(data.map((item) => (item.id === updatedEntry.id ? updatedEntry : item)))
      setIsApproveDialogOpen(false)
      toast({
        title: "承認完了",
        description: `ESG-${selectedItem.id}のデータが承認されました。`,
      })
    } catch (error) {
      console.error("Error approving data entry:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "データの承認に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!selectedItem) return
    if (!rejectReason.trim()) {
      toast({
        title: "入力エラー",
        description: "差戻し理由を入力してください。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/data-entries/${selectedItem.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: rejectReason,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reject data entry")
      }

      const updatedEntry = await response.json()
      setData(data.map((item) => (item.id === updatedEntry.id ? updatedEntry : item)))
      setIsRejectDialogOpen(false)
      setRejectReason("")
      toast({
        title: "差戻し完了",
        description: `ESG-${selectedItem.id}のデータが差戻されました。`,
      })
    } catch (error) {
      console.error("Error rejecting data entry:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "データの差戻しに失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            承認待ち
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            承認済み
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            差戻し
          </Badge>
        )
      default:
        return null
    }
  }

  // DataDetailDialogに渡すためのデータ変換
  const convertToDialogData = (item: DataEntry) => {
    return {
      id: `ESG-${item.id}`,
      date: item.entry_date,
      location: item.location?.name || "未設定",
      department: item.department?.name || "未設定",
      activityType: item.activity_type,
      activityAmount: item.activity_amount,
      emissionFactor: item.emission_factor?.factor || 0,
      emission: item.emission,
      status: item.status,
      submitter: item.submitter,
      submittedAt: item.submitted_at,
      notes: item.notes,
      approvedBy: item.approved_by,
      approvedAt: item.approved_at,
    }
  }

  // エラー発生時のリトライボタン
  const handleRetry = () => {
    fetchData(filters)
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={handleRetry}>再試行</Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>日付</TableHead>
                <TableHead>拠点</TableHead>
                <TableHead>部門</TableHead>
                <TableHead>活動種類</TableHead>
                <TableHead className="text-right">排出量(kg-CO2)</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>登録者</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                    データがありません
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">ESG-{item.id}</TableCell>
                    <TableCell>{item.entry_date}</TableCell>
                    <TableCell>{item.location?.name || "未設定"}</TableCell>
                    <TableCell>{item.department?.name || "未設定"}</TableCell>
                    <TableCell>{item.activity_type}</TableCell>
                    <TableCell className="text-right">{item.emission.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.submitter}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsDetailOpen(true)
                          }}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">詳細</span>
                        </Button>
                        {item.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => {
                                setSelectedItem(item)
                                setIsApproveDialogOpen(true)
                              }}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">承認</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setSelectedItem(item)
                                setIsRejectDialogOpen(true)
                              }}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">差戻し</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedItem && (
        <DataDetailDialog
          isOpen={isDetailOpen}
          setIsOpen={setIsDetailOpen}
          data={convertToDialogData(selectedItem)}
          showActions={false}
        />
      )}

      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>データ承認の確認</DialogTitle>
            <DialogDescription>以下のデータを承認してよろしいですか？</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-2 py-4">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">ID:</div>
                <div className="text-sm">ESG-{selectedItem.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">拠点:</div>
                <div className="text-sm">{selectedItem.location?.name || "未設定"}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">活動種類:</div>
                <div className="text-sm">{selectedItem.activity_type}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">排出量:</div>
                <div className="text-sm">{selectedItem.emission.toLocaleString()} kg-CO2</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button onClick={handleApprove} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  処理中...
                </>
              ) : (
                "承認する"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>データ差戻しの確認</DialogTitle>
            <DialogDescription>以下のデータを差戻す理由を入力してください。</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">ID:</div>
                <div className="text-sm">ESG-{selectedItem.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">拠点:</div>
                <div className="text-sm">{selectedItem.location?.name || "未設定"}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">活動種類:</div>
                <div className="text-sm">{selectedItem.activity_type}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">排出量:</div>
                <div className="text-sm">{selectedItem.emission.toLocaleString()} kg-CO2</div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium">差戻し理由:</div>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="差戻しの理由を入力してください"
                  className="resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isSubmitting || !rejectReason.trim()}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  処理中...
                </>
              ) : (
                "差戻す"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
