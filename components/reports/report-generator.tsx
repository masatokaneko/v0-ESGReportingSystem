"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, FileDown, FileText } from "lucide-react"
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
  reportType: z.string({
    required_error: "レポートタイプを選択してください。",
  }),
  period: z.string({
    required_error: "期間を選択してください。",
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
  includeCharts: z.boolean().default(true),
  includeComparison: z.boolean().default(true),
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

export function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      includeCharts: true,
      includeComparison: true,
      locations: ["tokyo", "osaka", "nagoya", "fukuoka", "sapporo"],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)

    // レポート生成処理をシミュレート
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "レポート生成完了",
        description: "ESGレポートが正常に生成されました。",
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
            name="reportType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>レポートタイプ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="レポートタイプを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="summary">サマリーレポート</SelectItem>
                    <SelectItem value="detailed">詳細レポート</SelectItem>
                    <SelectItem value="executive">役員向けレポート</SelectItem>
                    <SelectItem value="regulatory">規制対応レポート</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>生成するレポートの種類を選択してください。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>期間</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="期間を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">月次</SelectItem>
                    <SelectItem value="quarterly">四半期</SelectItem>
                    <SelectItem value="biannual">半期</SelectItem>
                    <SelectItem value="annual">年次</SelectItem>
                    <SelectItem value="custom">カスタム期間</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>レポートの対象期間を選択してください。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                        {field.value ? format(field.value, "yyyy年MM月dd日", { locale: ja }) : <span>日付を選択</span>}
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
                        {field.value ? format(field.value, "yyyy年MM月dd日", { locale: ja }) : <span>日付を選択</span>}
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

        <FormField
          control={form.control}
          name="locations"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>対象拠点</FormLabel>
                <FormDescription>レポートに含める拠点を選択してください。</FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="includeCharts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>グラフを含める</FormLabel>
                  <FormDescription>排出量の推移や内訳を視覚的に表示するグラフを含めます。</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="includeComparison"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>前年比較を含める</FormLabel>
                  <FormDescription>前年同期間との比較データを含めます。</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="text-sm font-medium">レポートプレビュー</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center border-dashed">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium">サマリーレポート</div>
              <div className="text-xs text-muted-foreground mt-1">PDF形式</div>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center border-dashed">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium">詳細レポート</div>
              <div className="text-xs text-muted-foreground mt-1">PDF形式</div>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center border-dashed">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-medium">役員向けレポート</div>
              <div className="text-xs text-muted-foreground mt-1">PDF形式</div>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            キャンセル
          </Button>
          <Button type="submit" disabled={isGenerating} className="gap-2">
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                生成中...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                レポート生成
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
