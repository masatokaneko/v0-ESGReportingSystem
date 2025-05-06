"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, Eye, AlertCircle, CheckCircle2, XCircleIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { mockDB } from "@/lib/mock-data-store"

type DataEntry = {
  id: string
  user_id: string
  location_id: string
  department_id: string
  emission_factor_id: string
  activity_date: string
  activity_data: number
  emissions: number
  notes: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
  rejection_reason?: string
  user_email?: string
  location_name?: string
  department_name?: string
  emission_factor_name?: string
  emission_factor_unit?: string
}

export default function ApprovalPage() {
  const [entries, setEntries] = useState<DataEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<DataEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedEntry, setSelectedEntry] = useState<DataEntry | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  // データエントリの取得
  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      // モックデータストアからデータを取得
      const dataEntries = mockDB.getAll("data_entries")

      // 関連データを結合
      const formattedEntries = dataEntries.map((entry) => {
        const userProfile = mockDB.getOne("users", "id", entry.user_id)
        const location = mockDB.getOne("locations", "id", entry.location_id)
        const department = mockDB.getOne("departments", "id", entry.department_id)
        const emissionFactor = mockDB.getOne("emission_factors", "id", entry.emission_factor_id)

        return {
          ...entry,
          user_email: userProfile?.email || "-",
          location_name: location?.name || "-",
          department_name: department?.name || "-",
          emission_factor_name: emissionFactor?.name || "-",
          emission_factor_unit: emissionFactor?.unit || "-",
        }
      })

      setEntries(formattedEntries)
      filterEntries(formattedEntries, activeTab)
    } catch (error) {
      console.error("Error fetching entries:", error)
      toast({
        title: "エラー",
        description: "データの取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  // タブ切り替え時のフィルタリング
  const filterEntries = (entries: DataEntry[], status: string) => {
    if (status === "all") {
      setFilteredEntries(entries)
    } else {
      setFilteredEntries(entries.filter((entry) => entry.status === status))
    }
  }

  useEffect(() => {
    filterEntries(entries, activeTab)
  }, [activeTab, entries])

  // 詳細ダイアログを開く
  const openViewDialog = (entry: DataEntry) => {
    setSelectedEntry(entry)
    setIsViewDialogOpen(true)
  }

  // 承認ダイアログを開く
  const openApproveDialog = (entry: DataEntry) => {
    setSelectedEntry(entry)
    setIsApproveDialogOpen(true)
  }

  // 却下ダイアログを開く
  const openRejectDialog = (entry: DataEntry) => {
    setSelectedEntry(entry)
    setRejectionReason("")
    setIsRejectDialogOpen(true)
  }

  // 承認処理
  const handleApprove = async () => {
    if (!selectedEntry || !user) return

    setIsProcessing(true)
    try {
      // モックデータストアでデータを更新
      mockDB.update("data_entries", "id", selectedEntry.id, {
        status: "approved",
        updated_at: new Date().toISOString(),
      })

      toast({
        title: "承認完了",
        description: "データエントリを承認しました",
      })

      setIsApproveDialogOpen(false)
      fetchEntries() // データを再取得
    } catch (error) {
      console.error("Error approving entry:", error)
      toast({
        title: "エラー",
        description: "承認処理に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // 却下処理
  const handleReject = async () => {
    if (!selectedEntry || !user) return

    if (!rejectionReason.trim()) {
      toast({
        title: "エラー",
        description: "却下理由を入力してください",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // モックデータストアでデータを更新
      mockDB.update("data_entries", "id", selectedEntry.id, {
        status: "rejected",
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString(),
      })

      toast({
        title: "却下完了",
        description: "データエントリを却下しました",
      })

      setIsRejectDialogOpen(false)
      fetchEntries() // データを再取得
    } catch (error) {
      console.error("Error rejecting entry:", error)
      toast({
        title: "エラー",
        description: "却下処理に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">承認管理</h1>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>承認待ち</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>承認済み</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircleIcon className="h-4 w-4" />
            <span>却下</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "pending" && "承認待ちデータ"}
                {activeTab === "approved" && "承認済みデータ"}
                {activeTab === "rejected" && "却下データ"}
              </CardTitle>
              <CardDescription>
                {activeTab === "pending" && "承認または却下が必要なデータエントリの一覧です"}
                {activeTab === "approved" && "承認済みのデータエントリの一覧です"}
                {activeTab === "rejected" && "却下されたデータエントリの一覧です"}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                      <TableHead>活動量</TableHead>
                      <TableHead>排出量</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">
                          読み込み中...
                        </TableCell>
                      </TableRow>
                    ) : filteredEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">
                          {activeTab === "pending" && "承認待ちのデータはありません"}
                          {activeTab === "approved" && "承認済みのデータはありません"}
                          {activeTab === "rejected" && "却下されたデータはありません"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{getStatusBadge(entry.status)}</TableCell>
                          <TableCell>{new Date(entry.created_at).toLocaleDateString("ja-JP")}</TableCell>
                          <TableCell>{entry.user_email}</TableCell>
                          <TableCell>{entry.location_name}</TableCell>
                          <TableCell>{entry.department_name}</TableCell>
                          <TableCell>{entry.emission_factor_name}</TableCell>
                          <TableCell>{new Date(entry.activity_date).toLocaleDateString("ja-JP")}</TableCell>
                          <TableCell>
                            {entry.activity_data} {entry.emission_factor_unit?.split("/")[1] || ""}
                          </TableCell>
                          <TableCell>
                            {entry.emissions.toFixed(2)} {entry.emission_factor_unit?.split("/")[0] || ""}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openViewDialog(entry)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {entry.status === "pending" && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => openApproveDialog(entry)}>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openRejectDialog(entry)}>
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>

      {/* 詳細ダイアログ */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
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
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 承認ダイアログ */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>データ承認</DialogTitle>
            <DialogDescription>このデータエントリを承認しますか？</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
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
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">排出係数</p>
                  <p>{selectedEntry.emission_factor_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">活動日</p>
                  <p>{new Date(selectedEntry.activity_date).toLocaleDateString("ja-JP")}</p>
                </div>
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing}>
              {isProcessing ? "処理中..." : "承認する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 却下ダイアログ */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>データ却下</DialogTitle>
            <DialogDescription>このデータエントリを却下しますか？</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
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
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">排出係数</p>
                  <p>{selectedEntry.emission_factor_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">活動日</p>
                  <p>{new Date(selectedEntry.activity_date).toLocaleDateString("ja-JP")}</p>
                </div>
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
              <div className="space-y-2">
                <Label htmlFor="rejection_reason" className="text-sm font-medium">
                  却下理由 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="rejection_reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="却下理由を入力してください"
                  required
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
              {isProcessing ? "処理中..." : "却下する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
