"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Save } from "lucide-react"

export default function ManualEntryForm() {
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 実際のAPIエンドポイントに送信する処理をここに実装
      // 今回はモックとして成功したことにする
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "データ登録完了",
        description: "排出量データが正常に登録されました。",
      })

      // フォームをリセット
      e.currentTarget.reset()
      setDate(undefined)
    } catch (error) {
      toast({
        title: "エラー",
        description: "データの登録中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">日付</Label>
          <div className="flex">
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
              type="button"
              onClick={() => document.getElementById("date-picker")?.click()}
            >
              {date ? date.toLocaleDateString() : "日付を選択"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
            <input
              type="date"
              id="date-picker"
              className="sr-only"
              onChange={(e) => {
                if (e.target.value) {
                  setDate(new Date(e.target.value))
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">カテゴリ</Label>
          <Select name="category" required>
            <SelectTrigger id="category">
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electricity">電気使用量</SelectItem>
              <SelectItem value="gas">ガス使用量</SelectItem>
              <SelectItem value="fuel">燃料使用量</SelectItem>
              <SelectItem value="travel">出張</SelectItem>
              <SelectItem value="waste">廃棄物</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location">拠点</Label>
          <Select name="location" required>
            <SelectTrigger id="location">
              <SelectValue placeholder="拠点を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tokyo">東京本社</SelectItem>
              <SelectItem value="osaka">大阪支店</SelectItem>
              <SelectItem value="fukuoka">福岡営業所</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">部門</Label>
          <Select name="department" required>
            <SelectTrigger id="department">
              <SelectValue placeholder="部門を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">営業部</SelectItem>
              <SelectItem value="hr">人事部</SelectItem>
              <SelectItem value="finance">経理部</SelectItem>
              <SelectItem value="it">情報システム部</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="value">数値</Label>
          <Input id="value" name="value" type="number" step="0.01" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">単位</Label>
          <Select name="unit" required>
            <SelectTrigger id="unit">
              <SelectValue placeholder="単位を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kwh">kWh</SelectItem>
              <SelectItem value="m3">m³</SelectItem>
              <SelectItem value="l">L</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="km">km</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emission-factor">排出係数</Label>
          <Input id="emission-factor" name="emissionFactor" type="number" step="0.001" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">備考</Label>
        <Textarea id="notes" name="notes" placeholder="備考があれば入力してください" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-1">CO2排出量（自動計算）</p>
              <p className="text-2xl font-bold">0.00 kg-CO2e</p>
            </div>
            <div className="flex justify-end items-center">
              <Button type="submit" disabled={isSubmitting} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "登録中..." : "データを登録"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
