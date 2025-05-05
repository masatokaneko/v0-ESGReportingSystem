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

interface EmissionFactor {
  id: number
  activity_type: string
  category: string
  factor: number
  unit: string
  valid_from: string | null
  valid_to: string | null
}

export function EmissionFactorSettings() {
  const [factors, setFactors] = useState<EmissionFactor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedFactor, setSelectedFactor] = useState<EmissionFactor | null>(null)
  const [newFactor, setNewFactor] = useState<Partial<EmissionFactor>>({
    activity_type: "",
    category: "",
    factor: 0,
    unit: "",
    valid_from: null,
    valid_to: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 排出係数データの取得
  useEffect(() => {
    const fetchEmissionFactors = async () => {
      try {
        const response = await fetch("/api/emission-factors")
        if (!response.ok) {
          throw new Error("Failed to fetch emission factors")
        }
        const data = await response.json()
        setFactors(data)
      } catch (error) {
        console.error("Error fetching emission factors:", error)
        toast({
          title: "エラー",
          description: "排出係数データの取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmissionFactors()
  }, [])

  const handleAddFactor = async () => {
    if (!newFactor.activity_type || !newFactor.category || newFactor.factor === undefined || !newFactor.unit) {
      toast({
        title: "入力エラー",
        description: "活動種類、カテゴリ、排出係数、単位は必須項目です。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/emission-factors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFactor),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add emission factor")
      }

      const addedFactor = await response.json()
      setFactors([...factors, addedFactor])
      setNewFactor({
        activity_type: "",
        category: "",
        factor: 0,
        unit: "",
        valid_from: null,
        valid_to: null,
      })
      setIsAddDialogOpen(false)
      toast({
        title: "排出係数を追加しました",
        description: `${addedFactor.activity_type}の排出係数を追加しました。`,
      })
    } catch (error) {
      console.error("Error adding emission factor:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "排出係数の追加に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditFactor = async () => {
    if (!selectedFactor) return
    if (
      !selectedFactor.activity_type ||
      !selectedFactor.category ||
      selectedFactor.factor === undefined ||
      !selectedFactor.unit
    ) {
      toast({
        title: "入力エラー",
        description: "活動種類、カテゴリ、排出係数、単位は必須項目です。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/emission-factors/${selectedFactor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedFactor),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update emission factor")
      }

      const updatedFactor = await response.json()
      setFactors(factors.map((factor) => (factor.id === updatedFactor.id ? updatedFactor : factor)))
      setIsEditDialogOpen(false)
      toast({
        title: "排出係数を更新しました",
        description: `${updatedFactor.activity_type}の排出係数を更新しました。`,
      })
    } catch (error) {
      console.error("Error updating emission factor:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "排出係数の更新に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteFactor = async () => {
    if (!selectedFactor) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/emission-factors/${selectedFactor.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete emission factor")
      }

      setFactors(factors.filter((factor) => factor.id !== selectedFactor.id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "排出係数を削除しました",
        description: `${selectedFactor.activity_type}の排出係数を削除しました。`,
      })
    } catch (error) {
      console.error("Error deleting emission factor:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "排出係数の削除に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">原単位マスタ管理</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              原単位追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>原単位の追加</DialogTitle>
              <DialogDescription>新しい活動の原単位(排出係数)を追加します。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="activity_type" className="text-right">
                  活動種類
                </Label>
                <Input
                  id="activity_type"
                  value={newFactor.activity_type}
                  onChange={(e) => setNewFactor({ ...newFactor, activity_type: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  カテゴリ
                </Label>
                <Input
                  id="category"
                  value={newFactor.category}
                  onChange={(e) => setNewFactor({ ...newFactor, category: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="factor" className="text-right">
                  排出係数
                </Label>
                <Input
                  id="factor"
                  type="number"
                  step="0.001"
                  value={newFactor.factor}
                  onChange={(e) =>
                    setNewFactor({
                      ...newFactor,
                      factor: Number.parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  単位
                </Label>
                <Input
                  id="unit"
                  value={newFactor.unit}
                  onChange={(e) => setNewFactor({ ...newFactor, unit: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valid_from" className="text-right">
                  有効開始日
                </Label>
                <Input
                  id="valid_from"
                  type="date"
                  value={newFactor.valid_from || ""}
                  onChange={(e) => setNewFactor({ ...newFactor, valid_from: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valid_to" className="text-right">
                  有効終了日
                </Label>
                <Input
                  id="valid_to"
                  type="date"
                  value={newFactor.valid_to || ""}
                  onChange={(e) => setNewFactor({ ...newFactor, valid_to: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                キャンセル
              </Button>
              <Button onClick={handleAddFactor} disabled={isSubmitting}>
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
                <TableHead>活動種類</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead className="text-right">排出係数</TableHead>
                <TableHead>単位</TableHead>
                <TableHead>有効期間</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    排出係数データがありません
                  </TableCell>
                </TableRow>
              ) : (
                factors.map((factor) => (
                  <TableRow key={factor.id}>
                    <TableCell className="font-medium">{factor.activity_type}</TableCell>
                    <TableCell>{factor.category}</TableCell>
                    <TableCell className="text-right">{factor.factor}</TableCell>
                    <TableCell>{factor.unit}</TableCell>
                    <TableCell>
                      {factor.valid_from && factor.valid_to
                        ? `${factor.valid_from} 〜 ${factor.valid_to}`
                        : factor.valid_from
                          ? `${factor.valid_from} 〜`
                          : factor.valid_to
                            ? `〜 ${factor.valid_to}`
                            : "無期限"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={isEditDialogOpen && selectedFactor?.id === factor.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open)
                            if (!open) setSelectedFactor(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedFactor(factor)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">編集</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>原単位の編集</DialogTitle>
                              <DialogDescription>排出係数の情報を編集します。</DialogDescription>
                            </DialogHeader>
                            {selectedFactor && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-activity_type" className="text-right">
                                    活動種類
                                  </Label>
                                  <Input
                                    id="edit-activity_type"
                                    value={selectedFactor.activity_type}
                                    onChange={(e) =>
                                      setSelectedFactor({
                                        ...selectedFactor,
                                        activity_type: e.target.value,
                                      })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-category" className="text-right">
                                    カテゴリ
                                  </Label>
                                  <Input
                                    id="edit-category"
                                    value={selectedFactor.category}
                                    onChange={(e) =>
                                      setSelectedFactor({
                                        ...selectedFactor,
                                        category: e.target.value,
                                      })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-factor" className="text-right">
                                    排出係数
                                  </Label>
                                  <Input
                                    id="edit-factor"
                                    type="number"
                                    step="0.001"
                                    value={selectedFactor.factor}
                                    onChange={(e) =>
                                      setSelectedFactor({
                                        ...selectedFactor,
                                        factor: Number.parseFloat(e.target.value),
                                      })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-unit" className="text-right">
                                    単位
                                  </Label>
                                  <Input
                                    id="edit-unit"
                                    value={selectedFactor.unit}
                                    onChange={(e) =>
                                      setSelectedFactor({
                                        ...selectedFactor,
                                        unit: e.target.value,
                                      })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-valid_from" className="text-right">
                                    有効開始日
                                  </Label>
                                  <Input
                                    id="edit-valid_from"
                                    type="date"
                                    value={selectedFactor.valid_from || ""}
                                    onChange={(e) =>
                                      setSelectedFactor({
                                        ...selectedFactor,
                                        valid_from: e.target.value,
                                      })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-valid_to" className="text-right">
                                    有効終了日
                                  </Label>
                                  <Input
                                    id="edit-valid_to"
                                    type="date"
                                    value={selectedFactor.valid_to || ""}
                                    onChange={(e) =>
                                      setSelectedFactor({
                                        ...selectedFactor,
                                        valid_to: e.target.value,
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
                              <Button onClick={handleEditFactor} disabled={isSubmitting}>
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
                          open={isDeleteDialogOpen && selectedFactor?.id === factor.id}
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open)
                            if (!open) setSelectedFactor(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setSelectedFactor(factor)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">削除</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>原単位の削除</DialogTitle>
                              <DialogDescription>この原単位を削除してもよろしいですか？</DialogDescription>
                            </DialogHeader>
                            {selectedFactor && (
                              <div className="py-4">
                                <p>
                                  <span className="font-medium">{selectedFactor.activity_type}</span> (
                                  {selectedFactor.category}) の原単位{" "}
                                  <span className="font-medium">
                                    {selectedFactor.factor} {selectedFactor.unit}
                                  </span>{" "}
                                  を削除します。
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
                              <Button variant="destructive" onClick={handleDeleteFactor} disabled={isSubmitting}>
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
