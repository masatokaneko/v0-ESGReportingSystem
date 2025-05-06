"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Pencil, Trash2, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

type EmissionFactor = {
  id: string
  name: string
  description: string
  category: string
  scope: string
  unit: string
  value: number
  source: string
  valid_from: string
  valid_until: string | null
  region: string
  is_active: boolean
  created_at: string
}

export default function EmissionFactorsPage() {
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>([])
  const [filteredFactors, setFilteredFactors] = useState<EmissionFactor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentFactor, setCurrentFactor] = useState<EmissionFactor | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [scopeFilter, setScopeFilter] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "電力",
    scope: "Scope1",
    unit: "kg-CO2e/kWh",
    value: 0,
    source: "",
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: "",
    region: "日本",
    is_active: true,
  })

  const supabase = createClientSupabaseClient()
  const { toast } = useToast()

  // 排出係数一覧の取得
  const fetchEmissionFactors = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("emission_factors").select("*").order("name")

      if (error) throw error
      setEmissionFactors(data || [])
      setFilteredFactors(data || [])
    } catch (error) {
      console.error("Error fetching emission factors:", error)
      toast({
        title: "エラー",
        description: "排出係数の取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmissionFactors()
  }, [])

  // 検索とフィルタリングの適用
  useEffect(() => {
    let result = emissionFactors

    // 検索語でフィルタリング
    if (searchTerm) {
      result = result.filter(
        (factor) =>
          factor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          factor.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // カテゴリでフィルタリング
    if (categoryFilter) {
      result = result.filter((factor) => factor.category === categoryFilter)
    }

    // スコープでフィルタリング
    if (scopeFilter) {
      result = result.filter((factor) => factor.scope === scopeFilter)
    }

    setFilteredFactors(result)
  }, [searchTerm, categoryFilter, scopeFilter, emissionFactors])

  // 排出係数追加/編集ダイアログを開く
  const openFactorDialog = (factor: EmissionFactor | null = null) => {
    if (factor) {
      setCurrentFactor(factor)
      setFormData({
        name: factor.name,
        description: factor.description,
        category: factor.category,
        scope: factor.scope,
        unit: factor.unit,
        value: factor.value,
        source: factor.source,
        valid_from: factor.valid_from.split("T")[0],
        valid_until: factor.valid_until ? factor.valid_until.split("T")[0] : "",
        region: factor.region,
        is_active: factor.is_active,
      })
    } else {
      setCurrentFactor(null)
      setFormData({
        name: "",
        description: "",
        category: "電力",
        scope: "Scope1",
        unit: "kg-CO2e/kWh",
        value: 0,
        source: "",
        valid_from: new Date().toISOString().split("T")[0],
        valid_until: "",
        region: "日本",
        is_active: true,
      })
    }
    setIsDialogOpen(true)
  }

  // 排出係数削除ダイアログを開く
  const openDeleteDialog = (factor: EmissionFactor) => {
    setCurrentFactor(factor)
    setIsDeleteDialogOpen(true)
  }

  // フォーム入力の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 数値入力の処理
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  // セレクト入力の処理
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // チェックボックス入力の処理
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // 排出係数追加/編集の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const factorData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        scope: formData.scope,
        unit: formData.unit,
        value: formData.value,
        source: formData.source,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until || null,
        region: formData.region,
        is_active: formData.is_active,
      }

      if (currentFactor) {
        // 排出係数編集
        const { error } = await supabase.from("emission_factors").update(factorData).eq("id", currentFactor.id)

        if (error) throw error

        toast({
          title: "更新完了",
          description: "排出係数を更新しました",
        })
      } else {
        // 排出係数追加
        const { error } = await supabase.from("emission_factors").insert(factorData)

        if (error) throw error

        toast({
          title: "登録完了",
          description: "排出係数を追加しました",
        })
      }

      setIsDialogOpen(false)
      fetchEmissionFactors() // 排出係数一覧を再取得
    } catch (error: any) {
      console.error("Error saving emission factor:", error)
      toast({
        title: "エラー",
        description: error.message || "排出係数の保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 排出係数削除の処理
  const handleDeleteFactor = async () => {
    if (!currentFactor) return

    setIsLoading(true)
    try {
      // 関連データの確認
      const { data: entries, error: entriesError } = await supabase
        .from("data_entries")
        .select("id")
        .eq("emission_factor_id", currentFactor.id)
        .limit(1)

      if (entriesError) throw entriesError

      if (entries && entries.length > 0) {
        toast({
          title: "削除できません",
          description: "この排出係数を使用しているデータエントリが存在します。",
          variant: "destructive",
        })
        setIsDeleteDialogOpen(false)
        setIsLoading(false)
        return
      }

      // 排出係数の削除
      const { error } = await supabase.from("emission_factors").delete().eq("id", currentFactor.id)

      if (error) throw error

      toast({
        title: "削除完了",
        description: "排出係数を削除しました",
      })

      setIsDeleteDialogOpen(false)
      fetchEmissionFactors() // 排出係数一覧を再取得
    } catch (error: any) {
      console.error("Error deleting emission factor:", error)
      toast({
        title: "エラー",
        description: error.message || "排出係数の削除に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // フィルターのリセット
  const resetFilters = () => {
    setSearchTerm("")
    setCategoryFilter(null)
    setScopeFilter(null)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">排出係数管理</h1>
        <Button onClick={() => openFactorDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          排出係数追加
        </Button>
      </div>

      {/* 検索・フィルターセクション */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="排出係数を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Select value={categoryFilter || ""} onValueChange={(value) => setCategoryFilter(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="カテゴリで絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのカテゴリ</SelectItem>
              <SelectItem value="電力">電力</SelectItem>
              <SelectItem value="燃料">燃料</SelectItem>
              <SelectItem value="輸送">輸送</SelectItem>
              <SelectItem value="廃棄物">廃棄物</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
          <Select value={scopeFilter || ""} onValueChange={(value) => setScopeFilter(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="スコープで絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのスコープ</SelectItem>
              <SelectItem value="Scope1">Scope1</SelectItem>
              <SelectItem value="Scope2">Scope2</SelectItem>
              <SelectItem value="Scope3">Scope3</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetFilters}>
            フィルターをリセット
          </Button>
        </div>
        {(searchTerm || categoryFilter || scopeFilter) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">フィルター:</span>
            {searchTerm && (
              <Badge variant="outline" className="flex items-center gap-1">
                検索: {searchTerm}
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => setSearchTerm("")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {categoryFilter && (
              <Badge variant="outline" className="flex items-center gap-1">
                カテゴリ: {categoryFilter}
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => setCategoryFilter(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {scopeFilter && (
              <Badge variant="outline" className="flex items-center gap-1">
                スコープ: {scopeFilter}
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => setScopeFilter(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* 排出係数一覧テーブル */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead>スコープ</TableHead>
              <TableHead>単位</TableHead>
              <TableHead>値</TableHead>
              <TableHead>有効期間</TableHead>
              <TableHead>地域</TableHead>
              <TableHead>状態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  読み込み中...
                </TableCell>
              </TableRow>
            ) : filteredFactors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  {emissionFactors.length === 0 ? "排出係数が登録されていません" : "条件に一致する排出係数がありません"}
                </TableCell>
              </TableRow>
            ) : (
              filteredFactors.map((factor) => (
                <TableRow key={factor.id}>
                  <TableCell className="font-medium">{factor.name}</TableCell>
                  <TableCell>{factor.category}</TableCell>
                  <TableCell>{factor.scope}</TableCell>
                  <TableCell>{factor.unit}</TableCell>
                  <TableCell>{factor.value}</TableCell>
                  <TableCell>
                    {new Date(factor.valid_from).toLocaleDateString("ja-JP")}
                    {factor.valid_until ? ` 〜 ${new Date(factor.valid_until).toLocaleDateString("ja-JP")}` : " 〜"}
                  </TableCell>
                  <TableCell>{factor.region}</TableCell>
                  <TableCell>
                    <Badge variant={factor.is_active ? "default" : "secondary"}>
                      {factor.is_active ? "有効" : "無効"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openFactorDialog(factor)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(factor)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 排出係数追加/編集ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentFactor ? "排出係数編集" : "排出係数追加"}</DialogTitle>
            <DialogDescription>
              {currentFactor ? "排出係数情報を編集します" : "新しい排出係数を追加します"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  名称
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  説明
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  カテゴリ
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="電力">電力</SelectItem>
                    <SelectItem value="燃料">燃料</SelectItem>
                    <SelectItem value="輸送">輸送</SelectItem>
                    <SelectItem value="廃棄物">廃棄物</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scope" className="text-right">
                  スコープ
                </Label>
                <Select value={formData.scope} onValueChange={(value) => handleSelectChange("scope", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="スコープを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scope1">Scope1</SelectItem>
                    <SelectItem value="Scope2">Scope2</SelectItem>
                    <SelectItem value="Scope3">Scope3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  単位
                </Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  値
                </Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step="0.000001"
                  value={formData.value}
                  onChange={handleNumberChange}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source" className="text-right">
                  出典
                </Label>
                <Input
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valid_from" className="text-right">
                  有効開始日
                </Label>
                <Input
                  id="valid_from"
                  name="valid_from"
                  type="date"
                  value={formData.valid_from}
                  onChange={handleInputChange}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valid_until" className="text-right">
                  有効終了日
                </Label>
                <Input
                  id="valid_until"
                  name="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="region" className="text-right">
                  地域
                </Label>
                <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="地域を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="日本">日本</SelectItem>
                    <SelectItem value="アジア">アジア</SelectItem>
                    <SelectItem value="ヨーロッパ">ヨーロッパ</SelectItem>
                    <SelectItem value="北米">北米</SelectItem>
                    <SelectItem value="グローバル">グローバル</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_active" className="text-right">
                  状態
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleCheckboxChange("is_active", checked as boolean)}
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    有効
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "処理中..." : currentFactor ? "更新" : "追加"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 排出係数削除確認ダイアログ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>排出係数削除</DialogTitle>
            <DialogDescription>{currentFactor?.name} を削除しますか？この操作は元に戻せません。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteFactor} disabled={isLoading}>
              {isLoading ? "処理中..." : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
