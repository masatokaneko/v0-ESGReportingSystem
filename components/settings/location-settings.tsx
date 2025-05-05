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

interface Location {
  id: number
  code: string
  name: string
  address: string | null
  type: string | null
}

export function LocationSettings() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 拠点データの取得
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations")
        if (!response.ok) {
          throw new Error("Failed to fetch locations")
        }
        const data = await response.json()
        setLocations(data)
      } catch (error) {
        console.error("Error fetching locations:", error)
        toast({
          title: "エラー",
          description: "拠点データの取得に失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

  const handleAddLocation = async () => {
    if (!newLocation.name || !newLocation.code) {
      toast({
        title: "入力エラー",
        description: "拠点名とコードは必須項目です。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLocation),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add location")
      }

      const addedLocation = await response.json()
      setLocations([...locations, addedLocation])
      setNewLocation({
        name: "",
        code: "",
        address: "",
        type: "",
      })
      setIsAddDialogOpen(false)
      toast({
        title: "拠点を追加しました",
        description: `${addedLocation.name}を拠点として追加しました。`,
      })
    } catch (error) {
      console.error("Error adding location:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "拠点の追加に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditLocation = async () => {
    if (!selectedLocation) return
    if (!selectedLocation.name || !selectedLocation.code) {
      toast({
        title: "入力エラー",
        description: "拠点名とコードは必須項目です。",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/locations/${selectedLocation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedLocation),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update location")
      }

      const updatedLocation = await response.json()
      setLocations(locations.map((location) => (location.id === updatedLocation.id ? updatedLocation : location)))
      setIsEditDialogOpen(false)
      toast({
        title: "拠点情報を更新しました",
        description: `${updatedLocation.name}の情報を更新しました。`,
      })
    } catch (error) {
      console.error("Error updating location:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "拠点の更新に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLocation = async () => {
    if (!selectedLocation) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/locations/${selectedLocation.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete location")
      }

      setLocations(locations.filter((location) => location.id !== selectedLocation.id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "拠点を削除しました",
        description: `${selectedLocation.name}を拠点から削除しました。`,
      })
    } catch (error) {
      console.error("Error deleting location:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "拠点の削除に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
                  value={newLocation.type || ""}
                  onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                キャンセル
              </Button>
              <Button onClick={handleAddLocation} disabled={isSubmitting}>
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
                <TableHead>拠点名</TableHead>
                <TableHead>拠点コード</TableHead>
                <TableHead>住所</TableHead>
                <TableHead>拠点種別</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    拠点データがありません
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => (
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
                                    value={selectedLocation.address || ""}
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
                                    value={selectedLocation.type || ""}
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
                              <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                                disabled={isSubmitting}
                              >
                                キャンセル
                              </Button>
                              <Button onClick={handleEditLocation} disabled={isSubmitting}>
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
                              <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={isSubmitting}
                              >
                                キャンセル
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteLocation} disabled={isSubmitting}>
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
