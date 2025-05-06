"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { useAuth } from "@/contexts/auth-context"

type Location = {
  id: string
  name: string
}

type Department = {
  id: string
  name: string
  location_id: string
}

type EmissionFactor = {
  id: string
  name: string
  category: string
  scope: string
  unit: string
  value: number
}

export function ManualEntryForm() {
  const [locations, setLocations] = useState<Location[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([])
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClientSupabaseClient()

  const [formData, setFormData] = useState({
    location_id: "",
    department_id: "",
    emission_factor_id: "",
    activity_date: new Date(),
    activity_data: 0,
    notes: "",
  })

  // マスターデータの取得
  useEffect(() => {
    const fetchMasterData = async () => {
      setIsLoading(true)
      try {
        // 拠点データの取得
        const { data: locationsData, error: locationsError } = await supabase
          .from("locations")
          .select("id, name")
          .order("name")

        if (locationsError) throw locationsError
        setLocations(locationsData || [])

        // 部門データの取得
        const { data: departmentsData, error: departmentsError } = await supabase
          .from("departments")
          .select("id, name, location_id")
          .order("name")

        if (departmentsError) throw departmentsError
        setDepartments(departmentsData || [])

        // 排出係数データの取得
        const { data: factorsData, error: factorsError } = await supabase
          .from("emission_factors")
          .select("id, name, category, scope, unit, value")
          .eq("is_active", true)
          .order("name")

        if (factorsError) throw factorsError
        setEmissionFactors(factorsData || [])

        // 初期値の設定
        if (locationsData && locationsData.length > 0) {
          setFormData((prev) => ({ ...prev, location_id: locationsData[0].id }))
          const depts = departmentsData.filter((dept) => dept.location_id === locationsData[0].id)
          setFilteredDepartments(depts)
          if (depts.length > 0) {
            setFormData((prev) => ({ ...prev, department_id: depts[0].id }))
          }
        }

        if (factorsData && factorsData.length > 0) {
          setFormData((prev) => ({ ...prev, emission_factor_id: factorsData[0].id }))
        }
      } catch (error) {
        console.error("Error fetching master data:", error)
        toast({
          title: "エラー",
          description: "マスターデータの取得に失敗しました",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMasterData()
  }, [])

  // 拠点変更時の部門フィルタリング
  useEffect(() => {
    if (formData.location_id) {
      const depts = departments.filter((dept) => dept.location_id === formData.location_id)
      setFilteredDepartments(depts)
      if (depts.length > 0 && !depts.find((dept) => dept.id === formData.department_id)) {
        setFormData((prev) => ({ ...prev, department_id: depts[0].id }))
      } else if (depts.length === 0) {
        setFormData((prev) => ({ ...prev, department_id: "" }))
      }
    }
  }, [formData.location_id, departments])

  // 入力処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 数値入力処理
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  // セレクト入力処理
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 日付入力処理
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, activity_date: date }))
    }
  }

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "エラー",
        description: "ログインが必要です",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // 選択された排出係数の取得
      const selectedFactor = emissionFactors.find((factor) => factor.id === formData.emission_factor_id)
      if (!selectedFactor) {
        throw new Error("排出係数が選択されていません")
      }

      // 排出量の計算
      const emissions = formData.activity_data * selectedFactor.value

      // データエントリの登録
      const { error } = await supabase.from("data_entries").insert({
        user_id: user.id,
        location_id: formData.location_id,
        department_id: formData.department_id,
        emission_factor_id: formData.emission_factor_id,
        activity_date: formData.activity_date.toISOString(),
        activity_data: formData.activity_data,
        emissions: emissions,
        notes: formData.notes,
        status: "pending", // 承認待ち状態
      })

      if (error) throw error

      toast({
        title: "登録完了",
        description: "データが正常に登録されました。承認待ち状態です。",
      })

      // フォームのリセット（拠点と部門はそのまま）
      setFormData((prev) => ({
        ...prev,
        activity_date: new Date(),
        activity_data: 0,
        notes: "",
      }))
    } catch (error: any) {
      console.error("Error submitting data:", error)
      toast({
        title: "エラー",
        description: error.message || "データの登録に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 選択された排出係数の情報
  const selectedFactor = emissionFactors.find((factor) => factor.id === formData.emission_factor_id)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 拠点選択 */}
        <div className="space-y-2">
          <Label htmlFor="location">拠点</Label>
          <Select
            value={formData.location_id}
            onValueChange={(value) => handleSelectChange("location_id", value)}
            disabled={isLoading || locations.length === 0}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="拠点を選択" />
            </SelectTrigger>
            <SelectContent>
              {locations.length === 0 ? (
                <SelectItem value="none" disabled>
                  拠点が登録されていません
                </SelectItem>
              ) : (
                locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* 部門選択 */}
        <div className="space-y-2">
          <Label htmlFor="department">部門</Label>
          <Select
            value={formData.department_id}
            onValueChange={(value) => handleSelectChange("department_id", value)}
            disabled={isLoading || filteredDepartments.length === 0}
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="部門を選択" />
            </SelectTrigger>
            <SelectContent>
              {filteredDepartments.length === 0 ? (
                <SelectItem value="none" disabled>
                  部門が登録されていません
                </SelectItem>
              ) : (
                filteredDepartments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* 排出係数選択 */}
        <div className="space-y-2">
          <Label htmlFor="emission_factor">排出係数</Label>
          <Select
            value={formData.emission_factor_id}
            onValueChange={(value) => handleSelectChange("emission_factor_id", value)}
            disabled={isLoading || emissionFactors.length === 0}
          >
            <SelectTrigger id="emission_factor">
              <SelectValue placeholder="排出係数を選択" />
            </SelectTrigger>
            <SelectContent>
              {emissionFactors.length === 0 ? (
                <SelectItem value="none" disabled>
                  排出係数が登録されていません
                </SelectItem>
              ) : (
                emissionFactors.map((factor) => (
                  <SelectItem key={factor.id} value={factor.id}>
                    {factor.name} ({factor.category} - {factor.scope})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* 活動日 */}
        <div className="space-y-2">
          <Label htmlFor="activity_date">活動日</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.activity_date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.activity_date ? (
                  format(formData.activity_date, "yyyy年MM月dd日", { locale: ja })
                ) : (
                  <span>日付を選択</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={formData.activity_date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* 活動量 */}
        <div className="space-y-2">
          <Label htmlFor="activity_data">
            活動量 {selectedFactor ? `(${selectedFactor.unit.split("/")[1] || ""})` : ""}
          </Label>
          <Input
            id="activity_data"
            name="activity_data"
            type="number"
            step="0.01"
            value={formData.activity_data}
            onChange={handleNumberChange}
            required
          />
        </div>

        {/* 計算結果プレビュー */}
        <div className="space-y-2">
          <Label>排出量（計算結果）</Label>
          <div className="p-2 border rounded-md bg-muted">
            {selectedFactor ? (
              <div>
                <p className="font-medium">
                  {(formData.activity_data * selectedFactor.value).toFixed(2)} {selectedFactor.unit.split("/")[0] || ""}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  計算式: {formData.activity_data} × {selectedFactor.value} ={" "}
                  {(formData.activity_data * selectedFactor.value).toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">排出係数を選択してください</p>
            )}
          </div>
        </div>

        {/* 備考 */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">備考</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            placeholder="備考があれば入力してください"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? "送信中..." : "データを登録"}
        </Button>
      </div>
    </form>
  )
}
