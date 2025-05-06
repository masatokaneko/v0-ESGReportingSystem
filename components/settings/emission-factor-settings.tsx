"use client"

import { useState } from "react"
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
  id: string
  activityType: string
  category: string
  factor: number
  unit: string
}

const initialFactors: EmissionFactor[] = [
  {
    id: "ef-001",
    activityType: "電力使用量",
    category: "Scope 2",
    factor: 0.423,
    unit: "kg-CO2/kWh",
  },
  {
    id: "ef-002",
    activityType: "ガス使用量",
    category: "Scope 1",
    factor: 2.23,
    unit: "kg-CO2/m³",
  },
  {
    id: "ef-003",
    activityType: "ガソリン",
    category: "Scope 1",
    factor: 2.32,
    unit: "kg-CO2/L",
  },
  {
    id: "ef-004",
    activityType: "軽油",
    category: "Scope 1",
    factor: 2.58,
    unit: "kg-CO2/L",
  },
  {
    id: "ef-005",
    activityType: "水使用量",
    category: "Scope 3",
    factor: 0.23,
    unit: "kg-CO2/m³",
  },
  {
    id: "ef-006",
    activityType: "廃棄物(一般)",
    category: "Scope 3",
    factor: 4.15,
    unit: "kg-CO2/kg",
  },
]

export function EmissionFactorSettings() {
  const [factors, setFactors] = useState<EmissionFactor[]>(initialFactors)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedFactor, setSelectedFactor] = useState<EmissionFactor | null>(null)
  const [newFactor, setNewFactor] = useState<Partial<EmissionFactor>>({
    activityType: "",
    category: "",
    factor: 0,
    unit: "",
  })

  const handleAddFactor = () => {
    if (!newFactor.activityType || !newFactor.category || !newFactor.factor || !newFactor.unit) {
      toast({
        title: "入力エラー",
        description: "すべての項目を入力してください。",
        variant: "destructive",
      })
      return
    }

    const newId = `ef-${String(factors.length + 1).padStart(3, "0")}`
    setFactors([
      ...factors,
      {
        id: newId,
        activityType: newFactor.activityType,
        category: newFactor.category,
        factor: Number(newFactor.factor),
        unit: newFactor.unit,
      },
    ])
    setNewFactor({
      activityType: "",
      category: "",
      factor: 0,
      unit: "",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "原単位を追加しました",
      description: `${newFactor.activityType}の原単位を追加しました。`,
    })
  }

  const handleEditFactor = () => {
    if (!selectedFactor) return

    setFactors(factors.map((factor) => (factor.id === selectedFactor.id ? selectedFactor : factor)))
    setIsEditDialogOpen(false)
    toast({
      title: "原単位を更新しました",
      description: `${selectedFactor.activityType}の原単位を更新しました。`,
    })
  }

  const handleDeleteFactor = () => {
    if (!selectedFactor) return

    setFactors(factors.filter((factor) => factor.id !== selectedFactor.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "原単位を削除しました",
      description: `${selectedFactor.activityType}の原単位を削除しました。`,
    })
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
                <Label htmlFor="activityType" className="text-right">
                  活動種類
                </Label>
                <Input
                  id="activityType"
                  value={newFactor.activityType}
                  onChange={(e) => setNewFactor({ ...newFactor, activityType: e.target.value })}
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleAddFactor}>追加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>活動種類</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead className="text-right">排出係数</TableHead>
              <TableHead>単位</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factors.map((factor) => (
              <TableRow key={factor.id}>
                <TableCell className="font-medium">{factor.activityType}</TableCell>
                <TableCell>{factor.category}</TableCell>
                <TableCell className="text-right">{factor.factor}</TableCell>
                <TableCell>{factor.unit}</TableCell>
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
                              <Label htmlFor="edit-activityType" className="text-right">
                                活動種類
                              </Label>
                              <Input
                                id="edit-activityType"
                                value={selectedFactor.activityType}
                                onChange={(e) =>
                                  setSelectedFactor({
                                    ...selectedFactor,
                                    activityType: e.target.value,
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
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            キャンセル
                          </Button>
                          <Button onClick={handleEditFactor}>更新</Button>
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
                              <span className="font-medium">{selectedFactor.activityType}</span> (
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
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            キャンセル
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteFactor}>
                            削除
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
