"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Edit, Plus, Trash2 } from "lucide-react"

interface Department {
  id: number
  code: string
  name: string
}

export function DepartmentSettings() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: "",
    code: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 部門データの取得
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments")
        if (!response.ok) {
          throw new Error("Failed to fetch departments")
        }
        const data = await response.json()
        setDepartments(data)
      } catch (error) {
        console.error("Error fetching departments:", error)
        toast({
          title: "エラー",
          description: "部門データの取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleAddDepartment = async () => {
    if (!newDepartment.name || !newDepartment.code) {
      toast({
        title: "入力エラー",
        description: "部門名とコードは必須項目です。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDepartment),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add department")
      }

      const addedDepartment = await response.json()
      setDepartments([...departments, addedDepartment])
      setNewDepartment({
        name: "",
        code: "",
      })
      setIsAddDialogOpen(false)
      toast({
        title: "部門を追加しました",
        description: `${addedDepartment.name}を部門として追加しました。`,
      })
    } catch (error) {
      console.error("Error adding department:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "部門の追加に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditDepartment = async () => {
    if (!selectedDepartment) return
    if (!selectedDepartment.name || !selectedDepartment.code) {
      toast({
        title: "入力エラー",
        description: "部門名とコードは必須項目です。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/departments/${selectedDepartment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedDepartment),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update department")
      }

      const updatedDepartment = await response.json()
      setDepartments(
        departments.map((department) => (department.id === updatedDepartment.id ? updatedDepartment : department)),
      )
      setIsEditDialogOpen(false)
      toast({
        title: "部門情報を更新しました",
        description: `${updatedDepartment.name}の情報を更新しました。`,
      })
    } catch (error) {
      console.error("Error updating department:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "部門の更新に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/departments/${selectedDepartment.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete department")
      }

      setDepartments(departments.filter((department) => department.id !== selectedDepartment.id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "部門を削除しました",
        description: `${selectedDepartment.name}を部門から削除しました。`,
      })
    } catch (error) {
      console.error("Error deleting department:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "部門の削除に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">部門管理</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              部門追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>部門の追加</DialogTitle>
              <DialogDescription>新しい部門を追加します。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  部門名
                </Label>
                <Input
                  id="name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  部門コード
                </Label>
                <Input
                  id="code"
                  value={newDepartment.code}
                  onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                キャンセル
              </Button>
              <Button onClick={handleAddDepartment} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    追加中...
                  </>
                ) : (
                  "追加"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>部門名</TableHead>
                <TableHead>部門コード</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    部門データがありません
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.code}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={isEditDialogOpen && selectedDepartment?.id === department.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open)
                            if (!open) setSelectedDepartment(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedDepartment(department)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">編集</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>部門の編集</DialogTitle>
                              <DialogDescription>部門情報を編集します。</DialogDescription>
                            </DialogHeader>
                            {selectedDepartment && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-name" className="text-right">
                                    部門名
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={selectedDepartment.name}
                                    onChange={(e) =>
                                      setSelectedDepartment({
                                        ...selectedDepartment,
                                        name: e.target.value,
                                      })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-code" className="text-right">
                                    部門コード
                                  </Label>
                                  <Input
                                    id="edit-code"
                                    value={selectedDepartment.code}
                                    onChange={(e) =>
                                      setSelectedDepartment({
                                        ...selectedDepartment,
                                        code: e.target.value,
                                      })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={isSubmitting}
                              >
                                キャンセル
                              </Button>
                              <Button onClick={handleEditDepartment} disabled={isSubmitting}>
                                {isSubmitting ? (
                                  <>
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    更新中...
                                  </>
                                ) : (
                                  "更新"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={isDeleteDialogOpen && selectedDepartment?.id === department.id}
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open)
                            if (!open) setSelectedDepartment(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setSelectedDepartment(department)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">削除</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>部門の削除</DialogTitle>
                              <DialogDescription>この部門を削除してもよろしいですか？</DialogDescription>
                            </DialogHeader>
                            {selectedDepartment && (
                              <div className="py-4">
                                <p>
                                  <span className="font-medium">{selectedDepartment.name}</span> (
                                  {selectedDepartment.code}) を削除します。
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">この操作は元に戻せません。</p>
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={isSubmitting}
                              >
                                キャンセル
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteDepartment} disabled={isSubmitting}>
                                {isSubmitting ? (
                                  <>
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    削除中...
                                  </>
                                ) : (
                                  "削除"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
