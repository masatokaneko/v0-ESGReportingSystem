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
import { PlusCircle, Pencil, Trash2 } from "lucide-react"

type Location = {
  id: string
  name: string
  address: string
  country: string
  region: string
  created_at: string
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    country: "日本",
    region: "アジア",
  })

  const supabase = createClientSupabaseClient()
  const { toast } = useToast()

  // 拠点一覧の取得
  const fetchLocations = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("locations").select("*").order("name")

      if (error) throw error
      setLocations(data || [])
    } catch (error) {
      console.error("Error fetching locations:", error)
      toast({
        title: "エラー",
        description: "拠点情報の取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  // 拠点追加/編集ダイアログを開く
  const openLocationDialog = (location: Location | null = null) => {
    if (location) {
      setCurrentLocation(location)
      setFormData({
        name: location.name,
        address: location.address,
        country: location.country,
        region: location.region,
      })
    } else {
      setCurrentLocation(null)
      setFormData({
        name: "",
        address: "",
        country: "日本",
        region: "アジア",
      })
    }
    setIsDialogOpen(true)
  }

  // 拠点削除ダイアログを開く
  const openDeleteDialog = (location: Location) => {
    setCurrentLocation(location)
    setIsDeleteDialogOpen(true)
  }

  // フォーム入力の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // セレクト入力の処理
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 拠点追加/編集の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (currentLocation) {
        // 拠点編集
        const { error } = await supabase
          .from("locations")
          .update({
            name: formData.name,
            address: formData.address,
            country: formData.country,
            region: formData.region,
          })
          .eq("id", currentLocation.id)

        if (error) throw error

        toast({
          title: "更新完了",
          description: "拠点情報を更新しました",
        })
      } else {
        // 拠点追加
        const { error } = await supabase.from("locations").insert({
          name: formData.name,
          address: formData.address,
          country: formData.country,
          region: formData.region,
        })

        if (error) throw error

        toast({
          title: "登録完了",
          description: "拠点を追加しました",
        })
      }

      setIsDialogOpen(false)
      fetchLocations() // 拠点一覧を再取得
    } catch (error: any) {
      console.error("Error saving location:", error)
      toast({
        title: "エラー",
        description: error.message || "拠点情報の保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 拠点削除の処理
  const handleDeleteLocation = async () => {
    if (!currentLocation) return

    setIsLoading(true)
    try {
      // 関連データの確認
      const { data: departments, error: deptError } = await supabase
        .from("departments")
        .select("id")
        .eq("location_id", currentLocation.id)
        .limit(1)

      if (deptError) throw deptError

      if (departments && departments.length > 0) {
        toast({
          title: "削除できません",
          description: "この拠点に関連付けられた部門が存在します。先に部門を削除してください。",
          variant: "destructive",
        })
        setIsDeleteDialogOpen(false)
        setIsLoading(false)
        return
      }

      // 拠点の削除
      const { error } = await supabase.from("locations").delete().eq("id", currentLocation.id)

      if (error) throw error

      toast({
        title: "削除完了",
        description: "拠点を削除しました",
      })

      setIsDeleteDialogOpen(false)
      fetchLocations() // 拠点一覧を再取得
    } catch (error: any) {
      console.error("Error deleting location:", error)
      toast({
        title: "エラー",
        description: error.message || "拠点の削除に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">拠点管理</h1>
        <Button onClick={() => openLocationDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          拠点追加
        </Button>
      </div>

      {/* 拠点一覧テーブル */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>拠点名</TableHead>
              <TableHead>住所</TableHead>
              <TableHead>国</TableHead>
              <TableHead>地域</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  読み込み中...
                </TableCell>
              </TableRow>
            ) : locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  拠点が登録されていません
                </TableCell>
              </TableRow>
            ) : (
              locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.country}</TableCell>
                  <TableCell>{location.region}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openLocationDialog(location)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(location)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 拠点追加/編集ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentLocation ? "拠点編集" : "拠点追加"}</DialogTitle>
            <DialogDescription>{currentLocation ? "拠点情報を編集します" : "新しい拠点を追加します"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  拠点名
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  住所
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  国
                </Label>
                <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="国を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="日本">日本</SelectItem>
                    <SelectItem value="中国">中国</SelectItem>
                    <SelectItem value="アメリカ">アメリカ</SelectItem>
                    <SelectItem value="イギリス">イギリス</SelectItem>
                    <SelectItem value="ドイツ">ドイツ</SelectItem>
                    <SelectItem value="フランス">フランス</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="アジア">アジア</SelectItem>
                    <SelectItem value="ヨーロッパ">ヨーロッパ</SelectItem>
                    <SelectItem value="北米">北米</SelectItem>
                    <SelectItem value="南米">南米</SelectItem>
                    <SelectItem value="アフリカ">アフリカ</SelectItem>
                    <SelectItem value="オセアニア">オセアニア</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "処理中..." : currentLocation ? "更新" : "追加"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 拠点削除確認ダイアログ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>拠点削除</DialogTitle>
            <DialogDescription>{currentLocation?.name} を削除しますか？この操作は元に戻せません。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteLocation} disabled={isLoading}>
              {isLoading ? "処理中..." : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
