"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, AlertCircle } from "lucide-react"
import { DataDetailDialog } from "../approval/data-detail-dialog"
import { getESGDataEntries } from "@/lib/data-service"
import { ESGDataEntry } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { DataSearchFilters as FiltersType } from "@/app/data-search/page"
import { ESGStatus } from "@/lib/types"

interface DataSearchTableProps {
  filters?: FiltersType
}

export function DataSearchTable({ filters }: DataSearchTableProps) {
  const [data, setData] = useState<ESGDataEntry[]>([])
  const [selectedItem, setSelectedItem] = useState<ESGDataEntry | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // マウント時の処理
  useEffect(() => {
    setMounted(true)
    console.log('[DataSearchTable] Component mounted')
    console.log('[DataSearchTable] Initial data fetch starting...')
    
    // 初回データ取得
    fetchData()
    
    return () => {
      console.log('[DataSearchTable] Component unmounted')
    }
  }, [])

  // フィルター変更時の処理
  useEffect(() => {
    if (mounted) {
      console.log('Filters changed:', filters)
      fetchData()
    }
  }, [filters, mounted])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Fetching ESG data with filters:', filters)
      
      // フィルターの準備
      const apiFilters: Parameters<typeof getESGDataEntries>[0] = {}
      
      if (filters?.location) apiFilters.location = filters.location
      if (filters?.department) apiFilters.department = filters.department
      if (filters?.startDate) apiFilters.startDate = filters.startDate.toISOString().split('T')[0]
      if (filters?.endDate) apiFilters.endDate = filters.endDate.toISOString().split('T')[0]
      
      console.log('API filters:', apiFilters)
      
      const entries = await getESGDataEntries(apiFilters)
      console.log('Received entries:', entries)
      
      // キーワード検索とアクティビティタイプのフィルタリング（クライアントサイド）
      let filteredEntries = entries
      
      if (filters?.keyword) {
        const keyword = filters.keyword.toLowerCase()
        filteredEntries = filteredEntries.filter(entry => 
          entry.id.toLowerCase().includes(keyword) ||
          entry.location.toLowerCase().includes(keyword) ||
          entry.department.toLowerCase().includes(keyword) ||
          entry.activityType.toLowerCase().includes(keyword) ||
          entry.submitter.toLowerCase().includes(keyword) ||
          (entry.notes && entry.notes.toLowerCase().includes(keyword))
        )
      }
      
      if (filters?.activityType) {
        filteredEntries = filteredEntries.filter(entry => 
          entry.activityType === filters.activityType
        )
      }
      
      setData(filteredEntries)
    } catch (err) {
      console.error('Failed to fetch ESG data:', err)
      setError('データの取得に失敗しました。再度お試しください。')
    } finally {
      setIsLoading(false)
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">データを読み込み中...</div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Button 
          onClick={() => {
            console.log('Manual fetch button clicked')
            fetchData()
          }}
          variant="outline"
        >
          データを手動で取得
        </Button>
        <div className="text-sm text-muted-foreground">
          {isLoading ? "読み込み中..." : `${data.length}件のデータ`}
        </div>
      </div>
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
                <TableCell colSpan={10} className="text-center text-muted-foreground">
                  データが見つかりませんでした
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
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

      <DataDetailDialog isOpen={isDetailOpen} setIsOpen={setIsDetailOpen} data={selectedItem} />
    </>
  )
}
