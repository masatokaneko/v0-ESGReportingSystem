"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"
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

interface EmissionFactor {
  id: number
  activity_type: string
}

interface DataSearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
}

export interface SearchFilters {
  keyword?: string
  location_id?: number
  department_id?: number
  activity_type?: string
  start_date?: string
  end_date?: string
}

export function DataSearchFilters({ onSearch }: DataSearchFiltersProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [keyword, setKeyword] = useState("")
  const [locationId, setLocationId] = useState<string>("")
  const [departmentId, setDepartmentId] = useState<string>("")
  const [activityType, setActivityType] = useState<string>("")

  const [locations, setLocations] = useState<Location[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [activityTypes, setActivityTypes] = useState<string[]>([])
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

        // 排出係数データの取得（活動種類のリストを作成）
        const emissionFactorsResponse = await fetch("/api/emission-factors")
        if (!emissionFactorsResponse.ok) {
          throw new Error("Failed to fetch emission factors")
        }
        const emissionFactorsData = await emissionFactorsResponse.json()
        const uniqueActivityTypes = Array.from(
          new Set(emissionFactorsData.map((factor: EmissionFactor) => factor.activity_type)),
        )
        setActivityTypes(uniqueActivityTypes)
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

  const handleSearch = () => {
    const filters: SearchFilters = {}

    if (keyword) filters.keyword = keyword
    if (locationId) filters.location_id = Number.parseInt(locationId)
    if (departmentId) filters.department_id = Number.parseInt(departmentId)
    if (activityType) filters.activity_type = activityType
    if (startDate) filters.start_date = format(startDate, "yyyy-MM-dd")
    if (endDate) filters.end_date = format(endDate, "yyyy-MM-dd")

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
    <div className="space-y-4">
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
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="活動種類" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {activityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="grid grid-cols-2 gap-2 md:flex">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal md:w-[200px]",
                  !startDate && "text-muted-foreground",
                )}
              >
                {startDate ? format(startDate, "yyyy年MM月dd日", { locale: ja }) : <span>開始日</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal md:w-[200px]",
                  !endDate && "text-muted-foreground",
                )}
              >
                {endDate ? format(endDate, "yyyy年MM月dd日", { locale: ja }) : <span>終了日</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <Button className="md:ml-auto" onClick={handleSearch}>
          検索
        </Button>
      </div>
    </div>
  )
}
