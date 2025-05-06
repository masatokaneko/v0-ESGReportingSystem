"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Download, FileSpreadsheet, FileText } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

const formSchema = z.object({
  exportFormat: z.string({
    required_error: "エクスポート形式を選択してください。",
  }),
  startDate: z.date({
    required_error: "開始日を選択してください。",
  }),
  endDate: z.date({
    required_error: "終了日を選択してください。",
  }),
  locations: z.array(z.string()).refine((value) => value.length > 0, {
    message: "少なくとも1つの拠点を選択してください。",
  }),
  departments: z.array(z.string()).optional(),
  includeRawData: z.boolean().default(true),
  includeSummary: z.boolean().default(true),
})

const locations = [
  {
    id: "tokyo",
    label: "東京本社",
  },
  {
    id: "osaka",
    label: "大阪支社",
  },
  {
    id: "nagoya",
    label: "名古屋支社",
  },
  {
    id: "fukuoka",
    label: "福岡支社",
  },
  {
    id: "sapporo",
    label: "札幌支社",
  },
]

const departments = [
  {
    id: "admin",
    label: "総務部",
  },
  {
    id: "sales",
    label: "営業部",
  },
  {
    id: "production",
    label: "製造部",
  },
  {
    id: "rd",
    label: "研究開発部",
  },
  {
    id: "it",
    label: "情報システム部",
  },
]

export function DataExporter() {
  const [isExporting, setIsExporting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exportFormat: "excel",
      includeRawData: true,
      includeSummary: true,
      locations: ["tokyo", "osaka", "nagoya", "fukuoka", "sapporo"],
      departments: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsExporting(true)

    // エクスポート処理をシミュレート
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "エクスポート完了",
        description: `データが${values.exportFormat === "excel" ? "Excel" : "CSV"}形式でエクスポートされました。`,
      })
      console.log(values)
    }, 2000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="exportFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>エクスポート形式</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="形式を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>データのエクスポート形式を選択してください。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>開始日</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? (
                            format(field.value, "yyyy年MM月dd日", { locale: ja })
                          ) : (
                            <span>日付を選択</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>終了日</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? (
                            format(field.value, "yyyy年MM月dd日", { locale: ja })
                          ) : (
                            <span>日付を選択</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="locations"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>対象拠点</FormLabel>
                  <FormDescription>エクスポートに含める拠点を選択してください。</FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {locations.map((location) => (
                    <FormField
                      key={location.id}
                      control={form.control}
                      name="locations"
                      render={({ field }) => {
                        return (
                          <FormItem key={location.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(location.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, location.id])
                                    : field.onChange(field.value?.filter((value) => value !== location.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{location.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departments"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>対象部門</FormLabel>
                  <FormDescription>
                    エクスポートに含める部門を選択してください (未選択の場合はすべての部門)
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map((department) => (
                    <FormField
                      key={department.id}
                      control={form.control}
                      name="departments"
                      render={({ field }) => {
                        return (
                          <FormItem key={department.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(department.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, department.id])
                                    : field.onChange(field.value?.filter((value) => value !== department.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{department.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="includeRawData"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>生データを含める</FormLabel>
                  <FormDescription>各拠点・部門の詳細な活動データを含めます。</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="includeSummary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>サマリーシートを含める</FormLabel>
                  <FormDescription>集計データを含むサマリーシートを追加します。</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="text-sm font-medium">エクスポートプレビュー</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center border-dashed">
              <FileSpreadsheet className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium">Excel形式</div>
              <div className="text-xs text-muted-foreground mt-1">.xlsx</div>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center border-dashed">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium">CSV形式</div>
              <div className="text-xs text-muted-foreground mt-1">.csv</div>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            キャンセル
          </Button>
          <Button type="submit" disabled={isExporting} className="gap-2">
            {isExporting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                エクスポート中...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                データエクスポート
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
