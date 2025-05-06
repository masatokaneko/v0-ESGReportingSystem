"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function DataApprovalFilters() {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex w-full items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="キーワード検索..." className="flex-1" />
      </div>
      <div className="grid grid-cols-2 gap-2 md:flex md:w-auto">
        <Select defaultValue="pending">
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="pending">承認待ち</SelectItem>
            <SelectItem value="approved">承認済み</SelectItem>
            <SelectItem value="rejected">差戻し</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="拠点" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="tokyo">東京本社</SelectItem>
            <SelectItem value="osaka">大阪支社</SelectItem>
            <SelectItem value="nagoya">名古屋支社</SelectItem>
            <SelectItem value="fukuoka">福岡支社</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="部門" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="admin">総務部</SelectItem>
            <SelectItem value="sales">営業部</SelectItem>
            <SelectItem value="production">製造部</SelectItem>
            <SelectItem value="rd">研究開発部</SelectItem>
          </SelectContent>
        </Select>
        <Button className="w-full md:w-auto">フィルタ適用</Button>
      </div>
    </div>
  )
}
