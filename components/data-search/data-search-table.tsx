"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download } from "lucide-react"
import { DataDetailDialog } from "../approval/data-detail-dialog"

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
    status: "approved",
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
    status: "approved",
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
  {
    id: "ESG-2023-006",
    date: "2023-05-01",
    location: "東京本社",
    department: "総務部",
    activityType: "電力使用量",
    activityAmount: 13200,
    emissionFactor: 0.423,
    emission: 5583.6,
    status: "approved",
    submitter: "山田太郎",
    submittedAt: "2023-06-10",
  },
  {
    id: "ESG-2023-007",
    date: "2023-05-01",
    location: "大阪支社",
    department: "営業部",
    activityType: "ガス使用量",
    activityAmount: 480,
    emissionFactor: 2.23,
    emission: 1070.4,
    status: "approved",
    submitter: "佐藤花子",
    submittedAt: "2023-06-11",
  },
  {
    id: "ESG-2023-008",
    date: "2023-05-01",
    location: "名古屋支社",
    department: "製造部",
    activityType: "燃料消費量",
    activityAmount: 350,
    emissionFactor: 2.58,
    emission: 903,
    status: "approved",
    submitter: "鈴木一郎",
    submittedAt: "2023-06-12",
  },
]

export function DataSearchTable() {
  const [data] = useState<DataItem[]>(initialData)
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

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
              <TableHead className="text-right">活動量</TableHead>
              <TableHead className="text-right">原単位</TableHead>
              <TableHead className="text-right">排出量(kg-CO2)</TableHead>
              <TableHead>ステータス</TableHead>
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
                <TableCell className="text-right">{item.activityAmount.toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.emissionFactor}</TableCell>
                <TableCell className="text-right">{item.emission.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
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
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">ダウンロード</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          全 {data.length} 件中 1~{data.length} 件を表示
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            前へ
          </Button>
          <Button variant="outline" size="sm" disabled>
            次へ
          </Button>
        </div>
      </div>

      <DataDetailDialog isOpen={isDetailOpen} setIsOpen={setIsDetailOpen} data={selectedItem} />
    </>
  )
}
