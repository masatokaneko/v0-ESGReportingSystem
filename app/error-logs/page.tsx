import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, RefreshCw, AlertTriangle, AlertCircle, Info } from "lucide-react"

// モックデータ
const ERROR_LOGS = [
  {
    id: "1",
    timestamp: "2023-04-15 10:30:15",
    level: "error",
    source: "SAP S/4HANA Connector",
    message: "API接続エラー: タイムアウトが発生しました。再試行してください。",
    details: "Connection timeout after 30 seconds. API endpoint: /api/v1/journalEntries",
  },
  {
    id: "2",
    timestamp: "2023-04-14 15:45:22",
    level: "warning",
    source: "CSVアップロード",
    message: "一部のデータが無効です。詳細はログを確認してください。",
    details: "Row 15: Invalid date format. Row 23: Value out of range.",
  },
  {
    id: "3",
    timestamp: "2023-04-13 09:15:33",
    level: "error",
    source: "電力管理システムコネクタ",
    message: "データ取得エラー: 認証に失敗しました。",
    details: "Authentication failed. Invalid client credentials.",
  },
  {
    id: "4",
    timestamp: "2023-04-12 14:22:10",
    level: "info",
    source: "システム",
    message: "バックアップが正常に完了しました。",
    details: "Backup completed successfully. Backup size: 256MB",
  },
  {
    id: "5",
    timestamp: "2023-04-11 11:05:45",
    level: "warning",
    source: "データ検証",
    message: "排出係数が範囲外です。デフォルト値を使用します。",
    details: "Emission factor for electricity (Tokyo) is out of range. Using default value.",
  },
]

export default function ErrorLogsPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">エラーログ管理</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ログ検索</CardTitle>
          <CardDescription>エラーログを検索します</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="log-level">ログレベル</Label>
              <Select defaultValue="all">
                <SelectTrigger id="log-level">
                  <SelectValue placeholder="ログレベルを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="error">エラー</SelectItem>
                  <SelectItem value="warning">警告</SelectItem>
                  <SelectItem value="info">情報</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="log-source">ソース</Label>
              <Select defaultValue="all">
                <SelectTrigger id="log-source">
                  <SelectValue placeholder="ソースを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="connector">コネクタ</SelectItem>
                  <SelectItem value="csv">CSVアップロード</SelectItem>
                  <SelectItem value="system">システム</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-range">期間</Label>
              <Select defaultValue="7days">
                <SelectTrigger id="date-range">
                  <SelectValue placeholder="期間を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">今日</SelectItem>
                  <SelectItem value="yesterday">昨日</SelectItem>
                  <SelectItem value="7days">過去7日間</SelectItem>
                  <SelectItem value="30days">過去30日間</SelectItem>
                  <SelectItem value="custom">カスタム</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyword">キーワード</Label>
              <div className="flex">
                <Input id="keyword" placeholder="キーワードを入力" className="rounded-r-none" />
                <Button className="rounded-l-none">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              ログをエクスポート
            </Button>
            <Button variant="outline" className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              更新
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>エラーログ一覧</CardTitle>
          <CardDescription>システムのエラーログを表示します</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>タイムスタンプ</TableHead>
                <TableHead>レベル</TableHead>
                <TableHead>ソース</TableHead>
                <TableHead className="w-[300px]">メッセージ</TableHead>
                <TableHead>詳細</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ERROR_LOGS.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>
                    {log.level === "error" && (
                      <Badge className="bg-red-100 text-red-800 font-normal rounded-full px-3 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        エラー
                      </Badge>
                    )}
                    {log.level === "warning" && (
                      <Badge className="bg-yellow-100 text-yellow-800 font-normal rounded-full px-3 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        警告
                      </Badge>
                    )}
                    {log.level === "info" && (
                      <Badge className="bg-blue-100 text-blue-800 font-normal rounded-full px-3 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        情報
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{log.source}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{log.message}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      詳細を表示
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
