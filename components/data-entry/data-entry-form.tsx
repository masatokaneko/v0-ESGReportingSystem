"use client"

import { useState, useEffect } from "react"
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
  category: string
  factor: number
  unit: string
}

const formSchema = z.object({
  entry_date: z.date({
    required_error: "日付を選択してください。",
  }),
  location_id: z.string({
    required_error: "拠点を選択してください。",
  }),
  department_id: z.string({
    required_error: "部門を選択してください。",
  }),
  activity_type: z.string({
    required_error: "活動種類を選択してください。",
  }),
  activity_amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "活動量は0より大きい数値を入力してください。",
  }),
  emission_factor_id: z.string().optional(),
  notes: z.string().optional(),
})

export function DataEntryForm() {
  const [calculatedEmission, setCalculatedEmission] = useState<number | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEmissionFactor, setSelectedEmissionFactor] = useState<EmissionFactor | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  })

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

        // 排出係数データの取得
        const emissionFactorsResponse = await fetch("/api/emission-factors")
        if (!emissionFactorsResponse.ok) {
          throw new Error("Failed to fetch emission factors")
        }
        const emissionFactorsData = await emissionFactorsResponse.json()
        setEmissionFactors(emissionFactorsData)
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

  const watchActivityAmount = form.watch("activity_amount")
  const watchEmissionFactorId = form.watch("emission_factor_id")

  // 排出係数が選択されたときの処理
  useEffect(() => {
    if (watchEmissionFactorId) {
      const factor = emissionFactors.find((f) => f.id.toString() === watchEmissionFactorId)
      if (factor) {
        setSelectedEmissionFactor(factor)
      }
    } else {
      setSelectedEmissionFactor(null)
    }
  }, [watchEmissionFactorId, emissionFactors])

  // 活動量と原単位が変更されたときに排出量を計算
  useEffect(() => {
    const calculateEmission = () => {
      const activityAmount = Number(watchActivityAmount)

      if (!isNaN(activityAmount) && selectedEmissionFactor) {
        setCalculatedEmission(activityAmount * selectedEmissionFactor.factor)
      } else {
        setCalculatedEmission(null)
      }
    }

    if (watchActivityAmount && selectedEmissionFactor) {
      calculateEmission()
    }
  }, [watchActivityAmount, selectedEmissionFactor])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // 排出量の計算
      const emission = calculatedEmission

      // データエントリの登録
      const response = await fetch("/api/data-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry_date: format(values.entry_date, "yyyy-MM-dd"),
          location_id: Number.parseInt(values.location_id),
          department_id: Number.parseInt(values.department_id),
          activity_type: values.activity_type,
          activity_amount: Number.parseFloat(values.activity_amount),
          emission_factor_id: values.emission_factor_id ? Number.parseInt(values.emission_factor_id) : null,
          emission: emission,
          notes: values.notes,
          submitter: "現在のユーザー", // 実際の実装ではログインユーザー情報を使用
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit data entry")
      }

      // フォームのリセット
      form.reset({
        entry_date: new Date(),
        location_id: "",
        department_id: "",
        activity_type: "",
        activity_amount: "",
        emission_factor_id: "",
        notes: "",
      })
      setFiles([])
      setCalculatedEmission(null)

      toast({
        title: "データが登録されました",
        description: "入力されたESGデータが正常に登録されました。",
      })
    } catch (error) {
      console.error("Error submitting data entry:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "データの登録に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="entry_date"
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
            name="location_id"
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
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department_id"
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
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id.toString()}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activity_type"
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
                    {Array.from(new Set(emissionFactors.map((factor) => factor.activity_type))).map((activityType) => (
                      <SelectItem key={activityType} value={activityType}>
                        {activityType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activity_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>活動量</FormLabel>
                <FormControl>
                  <Input type="text" inputMode="decimal" placeholder="例: 1000" {...field} />
                </FormControl>
                <FormDescription>活動の量を数値で入力してください (kWh, m³, L など)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emission_factor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>原単位 (排出係数)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="排出係数を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {emissionFactors
                      .filter(
                        (factor) =>
                          !form.getValues("activity_type") || factor.activity_type === form.getValues("activity_type"),
                      )
                      .map((factor) => (
                        <SelectItem key={factor.id} value={factor.id.toString()}>
                          {factor.activity_type} - {factor.factor} {factor.unit}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {selectedEmissionFactor
                    ? `${selectedEmissionFactor.factor} ${selectedEmissionFactor.unit} (${selectedEmissionFactor.category})`
                    : "活動量あたりの排出係数を選択してください"}
                </FormDescription>
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
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                登録中...
              </>
            ) : (
              "登録する"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
