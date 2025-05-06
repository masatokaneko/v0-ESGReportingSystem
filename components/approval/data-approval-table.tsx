"use client"

import { useState } from "react"
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

interface DataItem {
  id: string
  date: string
  location: string
  department: string
  activityType: string
  activityAmount: number
  emissionFactor: number
  emission: number
  status: "pending" | "approved" | "rejected"
  submitter: string
  submittedAt: string
}

const initialData: DataItem[] = [
  {
    id: "ESG-2023-001",
    date: "2023-04-01",
    location: "東京本社",
    department: "総務部",
    activityType: "電力使用量",
    activityAmount: 12500,
    emissionFactor: 0.423,
    emission: 5287.5,
    status: "pending",
    submitter: "山田太郎",
    submittedAt: "2023-05-10",
  },
  {
    id: "ESG-2023-002",
    date: "2023-04-01",
    location: "大阪支社",
    department: "営業部",
    activityType: "ガス使用量",
    activityAmount: 450,
    emissionFactor: 2.23,
    emission: 1003.5,
    status: "pending",
    submitter: "佐藤花子",
    submittedAt: "2023-05-11",
  },
  {
    id: "ESG-2023-003",
    date: "2023-04-01",
    location: "名古屋支社",
    department: "製造部",
    activityType: "燃料消費量",
    activityAmount: 320,
    emissionFactor: 2.58,
    emission: 825.6,
    status: "pending",
    submitter: "鈴木一郎",
    submittedAt: "2023-05-12",
  },
  {
    id: "ESG-2023-004",
    date: "2023-04-01",
    location: "福岡支社",
    department: "研究開発部",
    activityType: "水使用量",
    activityAmount: 780,
    emissionFactor: 0.23,
    emission: 179.4,
    status: "approved",
    submitter: "田中誠",
    submittedAt: "2023-05-09",
  },
  {
    id: "ESG-2023-005",
    date: "2023-04-01",
    location: "札幌支社",
    department: "情報システム部",
    activityType: "廃棄物排出量",
    activityAmount: 120,
    emissionFactor: 4.15,
    emission: 498,
    status: "rejected",
    submitter: "高橋健太",
    submittedAt: "2023-05-08",
  },
]

export function DataApprovalTable() {
  const [data, setData] = useState<DataItem[]>(initialData)
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const handleApprove = () => {
    if (selectedItem) {
      setData(data.map((item) => (item.id === selectedItem.id ? { ...item, status: "approved" } : item)))
      toast({
        title: "承認完了",
        description: `${selectedItem.id}のデータが承認されました。`,
      })
      setIsApproveDialogOpen(false)
    }
  }

  const handleReject = () => {
    if (selectedItem) {
      setData(data.map((item) => (item.id === selectedItem.id ? { ...item, status: "rejected" } : item)))
      toast({
        title: "差戻し完了",
        description: `${selectedItem.id}のデータが差戻されました。`,
      })
      setIsRejectDialogOpen(false)
      setRejectReason("")
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

  return (
    <>
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
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.activityType}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>

      <DataDetailDialog isOpen={isDetailOpen} setIsOpen={setIsDetailOpen} data={selectedItem} />

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
                <div className="text-sm">{selectedItem.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">拠点:</div>
                <div className="text-sm">{selectedItem.location}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">活動種類:</div>
                <div className="text-sm">{selectedItem.activityType}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">排出量:</div>
                <div className="text-sm">{selectedItem.emission.toLocaleString()} kg-CO2</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleApprove}>承認する</Button>
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
                <div className="text-sm">{selectedItem.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">拠点:</div>
                <div className="text-sm">{selectedItem.location}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">活動種類:</div>
                <div className="text-sm">{selectedItem.activityType}</div>
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
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
              差戻す
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
