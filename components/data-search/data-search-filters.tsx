"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { DataSearchFilters as FiltersType } from "@/app/data-search/page"

interface DataSearchFiltersProps {
  onFiltersChange: (filters: FiltersType) => void
}

export function DataSearchFilters({ onFiltersChange }: DataSearchFiltersProps) {
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("all")
  const [department, setDepartment] = useState("all")
  const [activityType, setActivityType] = useState("all")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const handleSearch = () => {
    const filters: FiltersType = {}
    
    if (keyword) filters.keyword = keyword
    if (location !== "all") filters.location = location
    if (department !== "all") filters.department = department
    if (activityType !== "all") filters.activityType = activityType
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate

    onFiltersChange(filters)
  }

  const handleReset = () => {
    setKeyword("")
    setLocation("all")
    setDepartment("all")
    setActivityType("all")
    setStartDate(undefined)
    setEndDate(undefined)
    onFiltersChange({})
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            id="search-keyword"
            name="keyword"
            placeholder="キーワード検索..." 
            className="flex-1" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:w-auto">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="拠点" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="本社">本社</SelectItem>
              <SelectItem value="大阪支社">大阪支社</SelectItem>
              <SelectItem value="名古屋工場">名古屋工場</SelectItem>
              <SelectItem value="福岡営業所">福岡営業所</SelectItem>
            </SelectContent>
          </Select>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="部門" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="admin">総務部</SelectItem>
              <SelectItem value="sales">営業部</SelectItem>
              <SelectItem value="production">製造部</SelectItem>
              <SelectItem value="rd">研究開発部</SelectItem>
              <SelectItem value="it">情報システム部</SelectItem>
            </SelectContent>
          </Select>
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="活動種類" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="electricity">電力使用量</SelectItem>
              <SelectItem value="gas">ガス使用量</SelectItem>
              <SelectItem value="fuel">燃料消費量</SelectItem>
              <SelectItem value="water">水使用量</SelectItem>
              <SelectItem value="waste">廃棄物排出量</SelectItem>
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
        <div className="flex gap-2 md:ml-auto">
          <Button variant="outline" onClick={handleReset}>リセット</Button>
          <Button onClick={handleSearch}>検索</Button>
        </div>
      </div>
    </div>
  )
}