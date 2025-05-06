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

interface Location {
  id: string
  name: string
  code: string
  address: string
  type: string
}

const initialLocations: Location[] = [
  {
    id: "loc-001",
    name: "東京本社",
    code: "TYO",
    address: "東京都千代田区丸の内1-1-1",
    type: "本社",
  },
  {
    id: "loc-002",
    name: "大阪支社",
    code: "OSA",
    address: "大阪府大阪市北区梅田2-2-2",
    type: "支社",
  },
  {
    id: "loc-003",
    name: "名古屋支社",
    code: "NGY",
    address: "愛知県名古屋市中区栄3-3-3",
    type: "支社",
  },
  {
    id: "loc-004",
    name: "福岡支社",
    code: "FUK",
    address: "福岡県福岡市博多区博多駅前4-4-4",
    type: "支社",
  },
  {
    id: "loc-005",
    name: "札幌支社",
    code: "SPR",
    address: "北海道札幌市中央区北5条西5-5-5",
    type: "支社",
  },
]

export function LocationSettings() {
  const [locations, setLocations] = useState<Location[]>(initialLocations)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: "",
    code: "",
    address: "",
    type: "",
  })

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.code || !newLocation.address || !newLocation.type) {
      toast({
        title: "入力エラー",
        description: "すべての項目を入力してください。",
        variant: "destructive",
      })
      return
    }

    const newId = `loc-${String(locations.length + 1).padStart(3, "0")}`
    setLocations([
      ...locations,
      {
        id: newId,
        name: newLocation.name,
        code: newLocation.code,
        address: newLocation.address,
        type: newLocation.type,
      },
    ])
    setNewLocation({
      name: "",
      code: "",
      address: "",
      type: "",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "拠点を追加しました",
      description: `${newLocation.name}を拠点として追加しました。`,
    })
  }

  const handleEditLocation = () => {
    if (!selectedLocation) return

    setLocations(locations.map((location) => (location.id === selectedLocation.id ? selectedLocation : location)))
    setIsEditDialogOpen(false)
    toast({
      title: "拠点情報を更新しました",
      description: `${selectedLocation.name}の情報を更新しました。`,
    })
  }

  const handleDeleteLocation = () => {
    if (!selectedLocation) return

    setLocations(locations.filter((location) => location.id !== selectedLocation.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "拠点を削除しました",
      description: `${selectedLocation.name}を拠点から削除しました。`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">拠点管理</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              拠点追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>拠点の追加</DialogTitle>
              <DialogDescription>新しい拠点を追加します。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  拠点名
                </Label>
                <Input
                  id="name"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  拠点コード
                </Label>
                <Input
                  id="code"
                  value={newLocation.code}
                  onChange={(e) => setNewLocation({ ...newLocation, code: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  住所
                </Label>
                <Input
                  id="address"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  拠点種別
                </Label>
                <Input
                  id="type"
                  value={newLocation.type}
                  onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleAddLocation}>追加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>拠点名</TableHead>
              <TableHead>拠点コード</TableHead>
              <TableHead>住所</TableHead>
              <TableHead>拠点種別</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.code}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>{location.type}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={isEditDialogOpen && selectedLocation?.id === location.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setSelectedLocation(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedLocation(location)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">編集</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>拠点の編集</DialogTitle>
                          <DialogDescription>拠点情報を編集します。</DialogDescription>
                        </DialogHeader>
                        {selectedLocation && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                拠点名
                              </Label>
                              <Input
                                id="edit-name"
                                value={selectedLocation.name}
                                onChange={(e) =>
                                  setSelectedLocation({
                                    ...selectedLocation,
                                    name: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-code" className="text-right">
                                拠点コード
                              </Label>
                              <Input
                                id="edit-code"
                                value={selectedLocation.code}
                                onChange={(e) =>
                                  setSelectedLocation({
                                    ...selectedLocation,
                                    code: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-address" className="text-right">
                                住所
                              </Label>
                              <Input
                                id="edit-address"
                                value={selectedLocation.address}
                                onChange={(e) =>
                                  setSelectedLocation({
                                    ...selectedLocation,
                                    address: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-type" className="text-right">
                                拠点種別
                              </Label>
                              <Input
                                id="edit-type"
                                value={selectedLocation.type}
                                onChange={(e) =>
                                  setSelectedLocation({
                                    ...selectedLocation,
                                    type: e.target.value,
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
                          <Button onClick={handleEditLocation}>更新</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={isDeleteDialogOpen && selectedLocation?.id === location.id}
                      onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open)
                        if (!open) setSelectedLocation(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setSelectedLocation(location)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">削除</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>拠点の削除</DialogTitle>
                          <DialogDescription>この拠点を削除してもよろしいですか？</DialogDescription>
                        </DialogHeader>
                        {selectedLocation && (
                          <div className="py-4">
                            <p>
                              <span className="font-medium">{selectedLocation.name}</span> ({selectedLocation.code})
                              を削除します。
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">この操作は元に戻せません。</p>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            キャンセル
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteLocation}>
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
