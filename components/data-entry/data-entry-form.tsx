"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { FileUploader } from "./file-uploader"

const formSchema = z.object({
  date: z.date({
    required_error: "日付を選択してください。",
  }),
  location: z.string({
    required_error: "拠点を選択してください。",
  }),
  department: z.string({
    required_error: "部門を選択してください。",
  }),
  activityType: z.string({
    required_error: "活動種類を選択してください。",
  }),
  activityAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "活動量は0より大きい数値を入力してください。",
  }),
  emissionFactor: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "原単位は0以上の数値を入力してください。",
  }),
  notes: z.string().optional(),
})

export function DataEntryForm() {
  const [calculatedEmission, setCalculatedEmission] = useState<number | null>(null)
  const [files, setFiles] = useState<File[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  })

  const watchActivityAmount = form.watch("activityAmount")
  const watchEmissionFactor = form.watch("emissionFactor")

  // 活動量と原単位が変更されたときに排出量を計算
  const calculateEmission = () => {
    const activityAmount = Number(watchActivityAmount)
    const emissionFactor = Number(watchEmissionFactor)

    if (!isNaN(activityAmount) && !isNaN(emissionFactor)) {
      setCalculatedEmission(activityAmount * emissionFactor)
    } else {
      setCalculatedEmission(null)
    }
  }

  // 活動量または原単位が変更されたときに排出量を計算
  if (watchActivityAmount && watchEmissionFactor) {
    calculateEmission()
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // サーバーにデータを送信する処理をここに実装
    toast({
      title: "データが登録されました",
      description: "入力されたESGデータが正常に登録されました。",
    })
    console.log(values, files)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>日付</FormLabel>
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>拠点</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="拠点を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tokyo">東京本社</SelectItem>
                    <SelectItem value="osaka">大阪支社</SelectItem>
                    <SelectItem value="nagoya">名古屋支社</SelectItem>
                    <SelectItem value="fukuoka">福岡支社</SelectItem>
                    <SelectItem value="sapporo">札幌支社</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>部門</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="部門を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">総務部</SelectItem>
                    <SelectItem value="sales">営業部</SelectItem>
                    <SelectItem value="production">製造部</SelectItem>
                    <SelectItem value="rd">研究開発部</SelectItem>
                    <SelectItem value="it">情報システム部</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activityType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>活動種類</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="活動種類を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="electricity">電力使用量</SelectItem>
                    <SelectItem value="gas">ガス使用量</SelectItem>
                    <SelectItem value="fuel">燃料消費量</SelectItem>
                    <SelectItem value="water">水使用量</SelectItem>
                    <SelectItem value="waste">廃棄物排出量</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activityAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>活動量</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="例: 1000"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      calculateEmission()
                    }}
                  />
                </FormControl>
                <FormDescription>活動の量を数値で入力してください (kWh, m³, L など)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emissionFactor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>原単位 (排出係数)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="例: 0.5"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      calculateEmission()
                    }}
                  />
                </FormControl>
                <FormDescription>活動量あたりの排出係数を入力してください (kg-CO2/kWh など)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {calculatedEmission !== null && (
          <div className="rounded-md bg-muted p-4">
            <div className="font-medium">計算結果</div>
            <div className="mt-2 flex items-center text-lg">
              <span className="mr-2">排出量 =</span>
              <span className="font-bold text-primary">{calculatedEmission.toFixed(2)}</span>
              <span className="ml-2">kg-CO2</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">活動量 × 原単位 = 排出量</div>
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備考</FormLabel>
              <FormControl>
                <Textarea placeholder="補足情報があれば入力してください" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="mb-2 font-medium">証跡ファイル</div>
          <FileUploader files={files} setFiles={setFiles} />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            キャンセル
          </Button>
          <Button type="submit">登録する</Button>
        </div>
      </form>
    </Form>
  )
}
