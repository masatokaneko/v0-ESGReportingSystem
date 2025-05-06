"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { ja } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CalendarDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 11, 31),
  })

  const [selectedPreset, setSelectedPreset] = React.useState<string>("2023")

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset)

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    switch (preset) {
      case "today":
        setDate({ from: currentDate, to: currentDate })
        break
      case "yesterday":
        const yesterday = addDays(currentDate, -1)
        setDate({ from: yesterday, to: yesterday })
        break
      case "7days":
        setDate({ from: addDays(currentDate, -7), to: currentDate })
        break
      case "30days":
        setDate({ from: addDays(currentDate, -30), to: currentDate })
        break
      case "thismonth":
        setDate({
          from: new Date(currentYear, currentMonth, 1),
          to: new Date(currentYear, currentMonth + 1, 0),
        })
        break
      case "lastmonth":
        setDate({
          from: new Date(currentYear, currentMonth - 1, 1),
          to: new Date(currentYear, currentMonth, 0),
        })
        break
      case "2023":
        setDate({
          from: new Date(2023, 0, 1),
          to: new Date(2023, 11, 31),
        })
        break
      case "2022":
        setDate({
          from: new Date(2022, 0, 1),
          to: new Date(2022, 11, 31),
        })
        break
      case "2021":
        setDate({
          from: new Date(2021, 0, 1),
          to: new Date(2021, 11, 31),
        })
        break
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn("w-[260px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy年MM月dd日", { locale: ja })} -{" "}
                  {format(date.to, "yyyy年MM月dd日", { locale: ja })}
                </>
              ) : (
                format(date.from, "yyyy年MM月dd日", { locale: ja })
              )
            ) : (
              <span>日付を選択</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex flex-col space-y-2 p-2">
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="期間を選択" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="today">今日</SelectItem>
                <SelectItem value="yesterday">昨日</SelectItem>
                <SelectItem value="7days">過去7日間</SelectItem>
                <SelectItem value="30days">過去30日間</SelectItem>
                <SelectItem value="thismonth">今月</SelectItem>
                <SelectItem value="lastmonth">先月</SelectItem>
                <SelectItem value="2023">2023年</SelectItem>
                <SelectItem value="2022">2022年</SelectItem>
                <SelectItem value="2021">2021年</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-md border">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={ja}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
