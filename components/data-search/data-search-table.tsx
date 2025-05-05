"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, RefreshCw } from "lucide-react"
import { DataDetailDialog } from "../approval/data-detail-dialog"
import { toast } from "@/hooks/use-toast"
import type { SearchFilters } from "./data-search-filters"

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
}

export function DataSearchTable() {
  const [data, setData] = useState<DataEntry[]>([])
  const [selectedItem, setSelectedItem] = useState<DataEntry | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({})

  // データの取得
  useEffect(() => {
    fetchData(currentFilters)
  }, [])

  const fetchData = async (filters: SearchFilters) => {
    setIsLoading(true)
    setIsError(false)
    try {
      // クエリパラメータの構築
      const queryParams = new URLSearchParams()
      if (filters.keyword) queryParams.append("keyword", filters.keyword)
      if (filters.location_id) queryParams.append("location_id", filters.location_id.toString())
      if (filters.department_id) queryParams.append("department_id", filters.department_id.toString())
      if (filters.activity_type) queryParams.append("activity_type", filters.activity_type)
      if (filters.start_date) queryParams.append("start_date", filters.start_date)
      if (filters.end_date) queryParams.append("end_date", filters.end_date)

      const url = `/api/data-entries${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch data entries")
      }

      const fetchedData = await response.json()

      // データの整合性を確保するための処理を追加
      const processedData = fetchedData.map((item: DataEntry) => ({
        ...item,
        // locationとdepartmentがnullまたはundefinedの場合のデフォルト値を設定
        location: item.location || { id: 0, name: "未設定", code: "N/A" },
        department: item.department || { id: 0, name: "未設定", code: "N/A" },
        emission_factor: item.emission_factor || { id: 0, activity_type: item.activity_type, factor: 0, unit: "N/A" },
      }))

      setData(processedData)
    } catch (error) {
      console.error("Error fetching data entries:", error)
      setIsError(true)
      toast({
        title: "エラー",
        description: "データの取得に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (filters: SearchFilters) => {
    setCurrentFilters(filters)
    fetchData(filters)
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
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-red-500">データの取得中にエラーが発生しました。</p>
          <Button variant="outline" onClick={() => fetchData(currentFilters)} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            再試行
          </Button>
        </div>
      ) : (
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
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4 text-muted-foreground">
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
                      <TableCell className="text-right">{item.activity_amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.emission_factor?.factor || 0}</TableCell>
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
                  ))
                )}
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
        </>
      )}

      {selectedItem && (
        <DataDetailDialog isOpen={isDetailOpen} setIsOpen={setIsDetailOpen} data={convertToDialogData(selectedItem)} />
      )}
    </>
  )
}
