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

type Department = {
  id: string
  name: string
  description: string
  location_id: string
  created_at: string
  location_name?: string
}

type Location = {
  id: string
  name: string
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location_id: "",
  })

  const supabase = createClientSupabaseClient()
  const { toast } = useToast()

  // 部門一覧の取得
  const fetchDepartments = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("departments")
        .select(`
          id,
          name,
          description,
          location_id,
          created_at,
          locations(name)
        `)
        .order("name")

      if (error) throw error

      // データの整形
      const formattedDepartments = data.map((dept: any) => ({
        ...dept,
        location_name: dept.locations?.name || "-",
      }))

      setDepartments(formattedDepartments)
    } catch (error) {
      console.error("Error fetching departments:", error)
      toast({
        title: "エラー",
        description: "部門情報の取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 拠点一覧の取得
  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase.from("locations").select("id, name").order("name")

      if (error) throw error
      setLocations(data || [])
    } catch (error) {
      console.error("Error fetching locations:", error)
      toast({
        title: "エラー",
        description: "拠点情報の取得に失敗しました",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchDepartments()
    fetchLocations()
  }, [])

  // 部門追加/編集ダイアログを開く
  const openDepartmentDialog = (department: Department | null = null) => {
    if (department) {
      setCurrentDepartment(department)
      setFormData({
        name: department.name,
        description: department.description,
        location_id: department.location_id,
      })
    } else {
      setCurrentDepartment(null)
      setFormData({
        name: "",
        description: "",
        location_id: locations.length > 0 ? locations[0].id : "",
      })
    }
    setIsDialogOpen(true)
  }

  // 部門削除ダイアログを開く
  const openDeleteDialog = (department: Department) => {
    setCurrentDepartment(department)
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

  // 部門追加/編集の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (currentDepartment) {
        // 部門編集
        const { error } = await supabase
          .from("departments")
          .update({
            name: formData.name,
            description: formData.description,
            location_id: formData.location_id,
          })
          .eq("id", currentDepartment.id)

        if (error) throw error

        toast({
          title: "更新完了",
          description: "部門情報を更新しました",
        })
      } else {
        // 部門追加
        const { error } = await supabase.from("departments").insert({
          name: formData.name,
          description: formData.description,
          location_id: formData.location_id,
        })

        if (error) throw error

        toast({
          title: "登録完了",
          description: "部門を追加しました",
        })
      }

      setIsDialogOpen(false)
      fetchDepartments() // 部門一覧を再取得
    } catch (error: any) {
      console.error("Error saving department:", error)
      toast({
        title: "エラー",
        description: error.message || "部門情報の保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 部門削除の処理
  const handleDeleteDepartment = async () => {
    if (!currentDepartment) return

    setIsLoading(true)
    try {
      // 関連データの確認
      const { data: users, error: userError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("department_id", currentDepartment.id)
        .limit(1)

      if (userError) throw userError

      if (users && users.length > 0) {
        toast({
          title: "削除できません",
          description: "この部門に所属するユーザーが存在します。先にユーザーの部門を変更してください。",
          variant: "destructive",
        })
        setIsDeleteDialogOpen(false)
        setIsLoading(false)
        return
      }

      // 部門の削除
      const { error } = await supabase.from("departments").delete().eq("id", currentDepartment.id)

      if (error) throw error

      toast({
        title: "削除完了",
        description: "部門を削除しました",
      })

      setIsDeleteDialogOpen(false)
      fetchDepartments() // 部門一覧を再取得
    } catch (error: any) {
      console.error("Error deleting department:", error)
      toast({
        title: "エラー",
        description: error.message || "部門の削除に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">部門管理</h1>
        <Button onClick={() => openDepartmentDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          部門追加
        </Button>
      </div>

      {/* 部門一覧テーブル */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>部門名</TableHead>
              <TableHead>説明</TableHead>
              <TableHead>拠点</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  読み込み中...
                </TableCell>
              </TableRow>
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  部門が登録されていません
                </TableCell>
              </TableRow>
            ) : (
              departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>{department.location_name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDepartmentDialog(department)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(department)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 部門追加/編集ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentDepartment ? "部門編集" : "部門追加"}</DialogTitle>
            <DialogDescription>
              {currentDepartment ? "部門情報を編集します" : "新しい部門を追加します"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  部門名
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
                <Label htmlFor="description" className="text-right">
                  説明
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  拠点
                </Label>
                <Select
                  value={formData.location_id}
                  onValueChange={(value) => handleSelectChange("location_id", value)}
                >
                  <SelectTrigger className="col-span-3">
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading || locations.length === 0}>
                {isLoading ? "処理中..." : currentDepartment ? "更新" : "追加"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 部門削除確認ダイアログ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>部門削除</DialogTitle>
            <DialogDescription>{currentDepartment?.name} を削除しますか？この操作は元に戻せません。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteDepartment} disabled={isLoading}>
              {isLoading ? "処理中..." : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
