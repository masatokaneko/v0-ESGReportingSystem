"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { mockDB } from "@/lib/mock-data-store"

type UserProfile = {
  id: string
  user_id: string
  email: string
  full_name: string
  role: string
  department_id: string | null
  department_name?: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileForm, setProfileForm] = useState({
    full_name: "",
  })
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  const { toast } = useToast()

  // プロフィール情報の取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // ユーザープロファイルの取得
        const userProfile = mockDB.getOne("users", "id", user.id)
        const department = userProfile?.department_id
          ? mockDB.getOne("departments", "id", userProfile.department_id)
          : null

        const profileData = {
          ...userProfile,
          department_name: department?.name || "-",
        }

        setProfile(profileData as UserProfile)
        setProfileForm({
          full_name: profileData?.full_name || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "エラー",
          description: "プロフィール情報の取得に失敗しました",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  // プロフィール更新の処理
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    try {
      // モックデータストアでユーザー情報を更新
      mockDB.update("users", "id", user.id, {
        full_name: profileForm.full_name,
      })

      toast({
        title: "更新完了",
        description: "プロフィール情報を更新しました",
      })

      // プロフィール情報を再取得
      const updatedProfile = mockDB.getOne("users", "id", user.id)
      setProfile(updatedProfile as UserProfile)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "エラー",
        description: error.message || "プロフィール更新に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // パスワード変更の処理
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // パスワード確認
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast({
        title: "エラー",
        description: "新しいパスワードと確認用パスワードが一致しません",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // 現在のパスワードで認証
      const userProfile = mockDB.getOne("users", "id", user.id)

      if (userProfile?.password !== passwordForm.current_password) {
        toast({
          title: "エラー",
          description: "現在のパスワードが正しくありません",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // パスワード更新
      mockDB.update("users", "id", user.id, {
        password: passwordForm.new_password,
      })

      toast({
        title: "更新完了",
        description: "パスワードを変更しました",
      })

      // フォームをリセット
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast({
        title: "エラー",
        description: error.message || "パスワード変更に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // フォーム入力の処理
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">プロフィール設定</h1>

      <Tabs defaultValue="profile" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">プロフィール情報</TabsTrigger>
          <TabsTrigger value="password">パスワード変更</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>プロフィール情報</CardTitle>
              <CardDescription>アカウント情報を確認・変更できます</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input id="email" value={profile?.email || ""} disabled />
                  <p className="text-sm text-muted-foreground">メールアドレスは変更できません</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">氏名</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={profileForm.full_name}
                    onChange={handleProfileInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">ロール</Label>
                  <Input id="role" value={profile?.role === "admin" ? "管理者" : "ユーザー"} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">部門</Label>
                  <Input id="department" value={profile?.department_name || "-"} disabled />
                  <p className="text-sm text-muted-foreground">部門は管理者が設定します</p>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} disabled={isSaving}>
                {isSaving ? "更新中..." : "プロフィールを更新"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>パスワード変更</CardTitle>
              <CardDescription>アカウントのパスワードを変更します</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">現在のパスワード</Label>
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password">新しいパスワード</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">新しいパスワード（確認）</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePasswordChange} disabled={isSaving}>
                {isSaving ? "更新中..." : "パスワードを変更"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
