"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  error_type: z.string().optional(),
  severity: z.string().optional(),
  status: z.string().optional(),
  component: z.string().optional(),
  route: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ErrorLogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      error_type: searchParams.get("error_type") || "",
      severity: searchParams.get("severity") || "",
      status: searchParams.get("status") || "",
      component: searchParams.get("component") || "",
      route: searchParams.get("route") || "",
      from_date: searchParams.get("from_date") || "",
      to_date: searchParams.get("to_date") || "",
    },
  })

  const onSubmit = (values: FormValues) => {
    setIsLoading(true)

    // フィルター条件をURLクエリパラメータに変換
    const params = new URLSearchParams()

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    // URLを更新してページをリロード
    router.push(`/admin/error-logs?${params.toString()}`)

    setIsLoading(false)
  }

  const resetFilters = () => {
    form.reset({
      error_type: "",
      severity: "",
      status: "",
      component: "",
      route: "",
      from_date: "",
      to_date: "",
    })
    router.push("/admin/error-logs")
  }

  return (
    <Card className="p-4 mb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="error_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>エラータイプ</FormLabel>
                  <FormControl>
                    <Input placeholder="エラータイプで検索" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>重要度</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="すべての重要度" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="info">情報</SelectItem>
                      <SelectItem value="warning">警告</SelectItem>
                      <SelectItem value="error">エラー</SelectItem>
                      <SelectItem value="critical">重大</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ステータス</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="すべてのステータス" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="open">未対応</SelectItem>
                      <SelectItem value="in_progress">対応中</SelectItem>
                      <SelectItem value="resolved">解決済み</SelectItem>
                      <SelectItem value="ignored">無視</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="component"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>コンポーネント</FormLabel>
                  <FormControl>
                    <Input placeholder="コンポーネント名" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ルート</FormLabel>
                  <FormControl>
                    <Input placeholder="ルートパス" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="from_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>開始日</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>終了日</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={resetFilters} disabled={isLoading}>
              リセット
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "検索中..." : "検索"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
