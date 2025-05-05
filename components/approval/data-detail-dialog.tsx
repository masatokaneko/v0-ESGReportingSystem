"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText } from "lucide-react"

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
  notes?: string
  approvedBy?: string
  approvedAt?: string
}

interface DataDetailDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  data: DataItem | null
  onApprove?: (id: string) => void
  onReject?: (id: string, reason: string) => void
  showActions?: boolean
}

export function DataDetailDialog({
  isOpen,
  setIsOpen,
  data,
  onApprove,
  onReject,
  showActions = false,
}: DataDetailDialogProps) {
  if (!data) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>データ詳細</DialogTitle>
          <DialogDescription>登録されたESGデータの詳細情報</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-1">ID</div>
              <div className="text-sm">{data.id}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">日付</div>
              <div className="text-sm">{data.date}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">拠点</div>
              <div className="text-sm">{data.location || "未設定"}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">部門</div>
              <div className="text-sm">{data.department || "未設定"}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">活動種類</div>
              <div className="text-sm">{data.activityType}</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">登録者</div>
              <div className="text-sm">{data.submitter}</div>
            </div>
            {data.status === "approved" && data.approvedBy && (
              <div>
                <div className="text-sm font-medium mb-1">承認者</div>
                <div className="text-sm">{data.approvedBy}</div>
              </div>
            )}
            {data.status === "approved" && data.approvedAt && (
              <div>
                <div className="text-sm font-medium mb-1">承認日時</div>
                <div className="text-sm">{data.approvedAt}</div>
              </div>
            )}
          </div>

          <div className="rounded-md bg-muted p-4">
            <div className="font-medium mb-2">排出量計算</div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">活動量</div>
                <div>{data.activityAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">原単位</div>
                <div>{data.emissionFactor}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">排出量</div>
                <div className="font-bold text-primary">{data.emission.toLocaleString()} kg-CO2</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">活動量 × 原単位 = 排出量</div>
          </div>

          {data.notes && (
            <div>
              <div className="text-sm font-medium mb-1">備考</div>
              <div className="text-sm whitespace-pre-wrap rounded-md border p-3">{data.notes}</div>
            </div>
          )}

          <div>
            <div className="text-sm font-medium mb-2">添付ファイル</div>
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <FileText className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">証跡資料.pdf</p>
                <p className="text-xs text-muted-foreground">2.4 MB</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                表示
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          {showActions && data.status === "pending" && onApprove && onReject ? (
            <div className="flex w-full justify-between">
              <Button variant="destructive" onClick={() => onReject(data.id, "")}>
                差戻し
              </Button>
              <Button onClick={() => onApprove(data.id)}>承認</Button>
            </div>
          ) : (
            <Button onClick={() => setIsOpen(false)}>閉じる</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
