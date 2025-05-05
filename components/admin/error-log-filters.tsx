"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import type { ErrorSeverity, ErrorStatus } from "@/lib/error-logger"

export function ErrorLogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    errorType: searchParams.get("errorType") || "",
    severity: (searchParams.get("severity") as ErrorSeverity) || "",
    status: (searchParams.get("status") as ErrorStatus) || "",
    startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
    endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.errorType) params.set("errorType", filters.errorType)
    if (filters.severity) params.set("severity", filters.severity)
    if (filters.status) params.set("status", filters.status)
    if (filters.startDate) params.set("startDate", filters.startDate.toISOString().split("T")[0])
    if (filters.endDate) params.set("endDate", filters.endDate.toISOString().split("T")[0])

    router.push(`/admin/error-logs?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({
      errorType: "",
      severity: "",
      status: "",
      startDate: undefined,
      endDate: undefined,
    })
    router.push("/admin/error-logs")
  }

  return (
    <div className="bg-muted/40 p-4 rounded-md mb-6 space-y-4">
      <h2 className="font-medium">フィルター</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm">エラータイプ</label>
          <Input
            placeholder="エラータイプで検索"
            value={filters.errorType}
            onChange={(e) => handleFilterChange("errorType", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">重要度</label>
          <Select value={filters.severity} onValueChange={(value) => handleFilterChange("severity", value)}>
            <SelectTrigger>
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="info">情報</SelectItem>
              <SelectItem value="warning">警告</SelectItem>
              <SelectItem value="error">エラー</SelectItem>
              <SelectItem value="critical">重大</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm">ステータス</label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="open">未対応</SelectItem>
              <SelectItem value="in_progress">対応中</SelectItem>
              <SelectItem value="resolved">解決済み</SelectItem>
              <SelectItem value="ignored">無視</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm">開始日</label>
          <DatePicker
            date={filters.startDate}
            setDate={(date) => handleFilterChange("startDate", date)}
            placeholder="開始日"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">終了日</label>
          <DatePicker
            date={filters.endDate}
            setDate={(date) => handleFilterChange("endDate", date)}
            placeholder="終了日"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={resetFilters}>
          リセット
        </Button>
        <Button onClick={applyFilters}>フィルター適用</Button>
      </div>
    </div>
  )
}
