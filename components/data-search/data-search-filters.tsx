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

export function DataSearchFilters() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="キーワード検索..." className="flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:w-auto">
          <Select>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="拠点" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="tokyo">東京本社</SelectItem>
              <SelectItem value="osaka">大阪支社</SelectItem>
              <SelectItem value="nagoya">名古屋支社</SelectItem>
              <SelectItem value="fukuoka">福岡支社</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="部門" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="admin">総務部</SelectItem>
              <SelectItem value="sales">営業部</SelectItem>
              <SelectItem value="production">製造部</SelectItem>
              <SelectItem value="rd">研究開発部</SelectItem>
            </SelectContent>
          </Select>
          <Select>
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
        <Button className="md:ml-auto">検索</Button>
      </div>
    </div>
  )
}
