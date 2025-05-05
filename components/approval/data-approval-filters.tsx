"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Location {
  id: number
  code: string
  name: string
}

interface Department {
  id: number
  code: string
  name: string
}

interface DataApprovalFiltersProps {
  onSearch: (filters: ApprovalFilters) => void
}

export interface ApprovalFilters {
  keyword?: string
  location_id?: number
  department_id?: number
  status?: string
}

export function DataApprovalFilters({ onSearch }: DataApprovalFiltersProps) {
  const [keyword, setKeyword] = useState("")
  const [locationId, setLocationId] = useState<string>("")
  const [departmentId, setDepartmentId] = useState<string>("")
  const [status, setStatus] = useState<string>("pending")

  const [locations, setLocations] = useState<Location[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // マスタデータの取得
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        // 拠点データの取得
        const locationsResponse = await fetch("/api/locations")
        if (!locationsResponse.ok) {
          throw new Error("Failed to fetch locations")
        }
        const locationsData = await locationsResponse.json()
        setLocations(locationsData)

        // 部門データの取得
        const departmentsResponse = await fetch("/api/departments")
        if (!departmentsResponse.ok) {
          throw new Error("Failed to fetch departments")
        }
        const departmentsData = await departmentsResponse.json()
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching master data:", error)
        toast({
          title: "エラー",
          description: "マスタデータの取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMasterData()
  }, [])

  // 初期検索（承認待ちデータのみ）
  useEffect(() => {
    if (!isLoading) {
      handleSearch()
    }
  }, [isLoading])

  const handleSearch = () => {
    const filters: ApprovalFilters = {}

    if (keyword) filters.keyword = keyword
    if (locationId && locationId !== "all") filters.location_id = Number.parseInt(locationId)
    if (departmentId && departmentId !== "all") filters.department_id = Number.parseInt(departmentId)
    if (status && status !== "all") filters.status = status

    onSearch(filters)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex w-full items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="キーワード検索..."
          className="flex-1"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 md:flex md:w-auto">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="pending">承認待ち</SelectItem>
            <SelectItem value="approved">承認済み</SelectItem>
            <SelectItem value="rejected">差戻し</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="拠点" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id.toString()}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={departmentId} onValueChange={setDepartmentId}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="部門" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department.id} value={department.id.toString()}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="w-full md:w-auto" onClick={handleSearch}>
          フィルタ適用
        </Button>
      </div>
    </div>
  )
}
