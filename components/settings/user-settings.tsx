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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2 } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  department: string
  status: "active" | "inactive"
}

const initialUsers: User[] = [
  {
    id: "user-001",
    name: "山田太郎",
    email: "yamada@example.com",
    role: "admin",
    department: "総務部",
    status: "active",
  },
  {
    id: "user-002",
    name: "佐藤花子",
    email: "sato@example.com",
    role: "manager",
    department: "営業部",
    status: "active",
  },
  {
    id: "user-003",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    role: "user",
    department: "製造部",
    status: "active",
  },
  {
    id: "user-004",
    name: "田中誠",
    email: "tanaka@example.com",
    role: "user",
    department: "研究開発部",
    status: "active",
  },
  {
    id: "user-005",
    name: "高橋健太",
    email: "takahashi@example.com",
    role: "user",
    department: "情報システム部",
    status: "inactive",
  },
]

export function UserSettings() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
    department: "",
    status: "active",
  })

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.department) {
      toast({
        title: "入力エラー",
        description: "すべての項目を入力してください。",
        variant: "destructive",
      })
      return
    }

    const newId = `user-${String(users.length + 1).padStart(3, "0")}`
    setUsers([
      ...users,
      {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as "admin" | "manager" | "user",
        department: newUser.department,
        status: newUser.status as "active" | "inactive",
      },
    ])
    setNewUser({
      name: "",
      email: "",
      role: "user",
      department: "",
      status: "active",
    })
    setIsAddDialogOpen(false)
    toast({
      title: "ユーザーを追加しました",
      description: `${newUser.name}さんをユーザーとして追加しました。`,
    })
  }

  const handleEditUser = () => {
    if (!selectedUser) return

    setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)))
    setIsEditDialogOpen(false)
    toast({
      title: "ユーザー情報を更新しました",
      description: `${selectedUser.name}さんの情報を更新しました。`,
    })
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    setUsers(users.filter((user) => user.id !== selectedUser.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "ユーザーを削除しました",
      description: `${selectedUser.name}さんをユーザーから削除しました。`,
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-primary">管理者</Badge>
      case "manager":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            承認者
          </Badge>
        )
      case "user":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            一般
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            有効
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            無効
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">ユーザー管理</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              ユーザー追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ユーザーの追加</DialogTitle>
              <DialogDescription>新しいユーザーを追加します。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  氏名
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  権限
                </Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value as "admin" | "manager" | "user" })}
                >
                  <SelectTrigger id="role" className="col-span-3">
                    <SelectValue placeholder="権限を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理者</SelectItem>
                    <SelectItem value="manager">承認者</SelectItem>
                    <SelectItem value="user">一般</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  部門
                </Label>
                <Input
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  ステータス
                </Label>
                <Select
                  value={newUser.status}
                  onValueChange={(value) => setNewUser({ ...newUser, status: value as "active" | "inactive" })}
                >
                  <SelectTrigger id="status" className="col-span-3">
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">有効</SelectItem>
                    <SelectItem value="inactive">無効</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleAddUser}>追加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>氏名</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>部門</TableHead>
              <TableHead>権限</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={isEditDialogOpen && selectedUser?.id === user.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setSelectedUser(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">編集</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>ユーザーの編集</DialogTitle>
                          <DialogDescription>ユーザー情報を編集します。</DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                氏名
                              </Label>
                              <Input
                                id="edit-name"
                                value={selectedUser.name}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    name: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-email" className="text-right">
                                メールアドレス
                              </Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={selectedUser.email}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    email: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-role" className="text-right">
                                権限
                              </Label>
                              <Select
                                value={selectedUser.role}
                                onValueChange={(value) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    role: value as "admin" | "manager" | "user",
                                  })
                                }
                              >
                                <SelectTrigger id="edit-role" className="col-span-3">
                                  <SelectValue placeholder="権限を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">管理者</SelectItem>
                                  <SelectItem value="manager">承認者</SelectItem>
                                  <SelectItem value="user">一般</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-department" className="text-right">
                                部門
                              </Label>
                              <Input
                                id="edit-department"
                                value={selectedUser.department}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    department: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-status" className="text-right">
                                ステータス
                              </Label>
                              <Select
                                value={selectedUser.status}
                                onValueChange={(value) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    status: value as "active" | "inactive",
                                  })
                                }
                              >
                                <SelectTrigger id="edit-status" className="col-span-3">
                                  <SelectValue placeholder="ステータスを選択" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">有効</SelectItem>
                                  <SelectItem value="inactive">無効</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            キャンセル
                          </Button>
                          <Button onClick={handleEditUser}>更新</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={isDeleteDialogOpen && selectedUser?.id === user.id}
                      onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open)
                        if (!open) setSelectedUser(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">削除</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>ユーザーの削除</DialogTitle>
                          <DialogDescription>このユーザーを削除してもよろしいですか？</DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="py-4">
                            <p>
                              <span className="font-medium">{selectedUser.name}</span> ({selectedUser.email})
                              を削除します。
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">この操作は元に戻せません。</p>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            キャンセル
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteUser}>
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
