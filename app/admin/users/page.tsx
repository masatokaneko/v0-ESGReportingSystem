"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

type UserProfile = {
  id: string
  user_id: string
  email: string
  full_name: string
  role: string
  department_id: string | null
  created_at: string
  department_name?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "user",
    department_id: "",
  })

  const supabase = createClientSupabaseClient()
  const { toast } = useToast()
  const router = useRouter()

  // ユーザー一覧の取得
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // ユーザープロファイルの取得
      const { data: profiles, error } = await supabase.from("user_profiles").select(`
          id,
          user_id,
          email,
          full_name,
          role,
          department_id,
          created_at,
          departments(name)
        `)

      if (error) throw error

      // データの整形
      const formattedUsers = (profiles || []).map((profile: any) => ({
        ...profile,
        department_name: profile.departments?.name || "-",
      }))

      setUsers(formattedUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "エラー",
        description: "ユーザー情報の取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 部門一覧の取得
  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase.from("departments").select("id, name")

      if (error) throw error
      setDepartments(data || [])
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchDepartments()
  }, [])

  // ユーザー追加/編集ダイアログを開く
  const openUserDialog = (user: UserProfile | null = null) => {
    if (user) {
      setCurrentUser(user)
      setFormData({
        email: user.email,
        password: "", // 編集時はパスワード欄を空にする
        full_name: user.full_name,
        role: user.role,
        department_id: user.department_id || "",
      })
    } else {
      setCurrentUser(null)
      setFormData({
        email: "",
        password: "",
        full_name: "",
        role: "user",
        department_id: "",
      })
    }
    setIsDialogOpen(true)
  }

  // ユーザー削除ダイアログを開く
  const openDeleteDialog = (user: UserProfile) => {
    setCurrentUser(user)
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

  // ユーザー追加/編集の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (currentUser) {
        // ユーザー編集
        const { error: profileError } = await supabase
          .from("user_profiles")
          .update({
            full_name: formData.full_name,
            role: formData.role,
            department_id: formData.department_id || null,
          })
          .eq("user_id", currentUser.user_id)

        if (profileError) throw profileError

        // パスワード変更（入力されている場合のみ）
        if (formData.password) {
          // 管理者によるパスワード変更のAPIエンドポイントを呼び出す
          // 注: 実際の実装ではサーバーサイドAPIを使用する必要があります
        }

        toast({
          title: "更新完了",
          description: "ユーザー情報を更新しました",
        })
      } else {
        // ユーザー追加
        // 1. 認証ユーザーの作成
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          email_confirm: true,
        })

        if (authError) throw authError

        // 2. ユーザープロファイルの作成
        const { error: profileError } = await supabase.from("user_profiles").insert({
          user_id: authData.user.id,
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          department_id: formData.department_id || null,
        })

        if (profileError) throw profileError

        toast({
          title: "登録完了",
          description: "ユーザーを追加しました",
        })
      }

      setIsDialogOpen(false)
      fetchUsers() // ユーザー一覧を再取得
    } catch (error: any) {
      console.error("Error saving user:", error)
      toast({
        title: "エラー",
        description: error.message || "ユーザー情報の保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ユーザー削除の処理
  const handleDeleteUser = async () => {
    if (!currentUser) return

    setIsLoading(true)
    try {
      // 1. ユーザープロファイルの削除
      const { error: profileError } = await supabase.from("user_profiles").delete().eq("user_id", currentUser.user_id)

      if (profileError) throw profileError

      // 2. 認証ユーザーの削除
      const { error: authError } = await supabase.auth.admin.deleteUser(currentUser.user_id)

      if (authError) throw authError

      toast({
        title: "削除完了",
        description: "ユーザーを削除しました",
      })

      setIsDeleteDialogOpen(false)
      fetchUsers() // ユーザー一覧を再取得
    } catch (error: any) {
      console.error("Error deleting user:", error)
      toast({
        title: "エラー",
        description: error.message || "ユーザーの削除に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ユーザー管理</h1>
        <Button onClick={() => openUserDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          ユーザー追加
        </Button>
      </div>

      {/* ユーザー一覧テーブル */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>ロール</TableHead>
              <TableHead>部門</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  読み込み中...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  ユーザーが登録されていません
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role === "admin" ? "管理者" : "ユーザー"}</TableCell>
                  <TableCell>{user.department_name}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString("ja-JP")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openUserDialog(user)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(user)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ユーザー追加/編集ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentUser ? "ユーザー編集" : "ユーザー追加"}</DialogTitle>
            <DialogDescription>
              {currentUser ? "ユーザー情報を編集します" : "新しいユーザーを追加します"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!!currentUser}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  パスワード
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!currentUser}
                  className="col-span-3"
                  placeholder={currentUser ? "変更する場合のみ入力" : ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="full_name" className="text-right">
                  氏名
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  ロール
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="ロールを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">ユーザー</SelectItem>
                    <SelectItem value="admin">管理者</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  部門
                </Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => handleSelectChange("department_id", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="部門を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">未選択</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "処理中..." : currentUser ? "更新" : "追加"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ユーザー削除確認ダイアログ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ユーザー削除</DialogTitle>
            <DialogDescription>{currentUser?.full_name} を削除しますか？この操作は元に戻せません。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteUser} disabled={isLoading}>
              {isLoading ? "処理中..." : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
