import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, CheckCircle, AlertCircle, AlertTriangle, Clock } from "lucide-react"

// モックデータ
const SYSTEM_COMPONENTS = [
  {
    id: "1",
    name: "APIサーバー",
    status: "operational",
    uptime: "99.98%",
    lastChecked: "2023-04-15 10:30:15",
  },
  {
    id: "2",
    name: "データベース",
    status: "operational",
    uptime: "99.95%",
    lastChecked: "2023-04-15 10:30:15",
  },
  {
    id: "3",
    name: "認証サービス",
    status: "operational",
    uptime: "99.99%",
    lastChecked: "2023-04-15 10:30:15",
  },
  {
    id: "4",
    name: "ファイルストレージ",
    status: "degraded",
    uptime: "98.75%",
    lastChecked: "2023-04-15 10:30:15",
    message: "パフォーマンスの低下が見られます。調査中です。",
  },
  {
    id: "5",
    name: "バックアップサービス",
    status: "operational",
    uptime: "99.90%",
    lastChecked: "2023-04-15 10:30:15",
  },
  {
    id: "6",
    name: "メールサービス",
    status: "incident",
    uptime: "95.50%",
    lastChecked: "2023-04-15 10:30:15",
    message: "一部のメール送信に遅延が発生しています。",
  },
]

const SCHEDULED_MAINTENANCE = [
  {
    id: "1",
    component: "データベース",
    scheduledStart: "2023-04-20 01:00:00",
    scheduledEnd: "2023-04-20 03:00:00",
    description: "データベースのアップグレードを実施します。この間、システムは利用できません。",
  },
  {
    id: "2",
    component: "APIサーバー",
    scheduledStart: "2023-04-25 22:00:00",
    scheduledEnd: "2023-04-25 23:00:00",
    description: "APIサーバーのセキュリティパッチを適用します。一部の機能が利用できない場合があります。",
  },
]

export default function SystemStatusPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">システムステータス</h1>
        <Button variant="outline" className="flex items-center">
          <RefreshCw className="mr-2 h-4 w-4" />
          更新
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>システム概要</CardTitle>
          <CardDescription>システム全体のステータスを表示します</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                  <h3 className="text-xl font-bold">システム稼働中</h3>
                  <p className="text-sm text-gray-500">すべての主要コンポーネントが正常に動作しています</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">システム稼働率</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">過去30日間</span>
                    <span className="text-lg font-bold">99.95%</span>
                  </div>
                  <Progress value={99.95} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">アクティブインシデント</h3>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-lg font-bold">1件</span>
                  </div>
                  <p className="text-sm text-gray-500">メールサービスに問題があります</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>コンポーネントステータス</CardTitle>
          <CardDescription>各システムコンポーネントの現在のステータスを表示します</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>コンポーネント</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>稼働率</TableHead>
                <TableHead>最終確認</TableHead>
                <TableHead>メッセージ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SYSTEM_COMPONENTS.map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">{component.name}</TableCell>
                  <TableCell>
                    {component.status === "operational" && (
                      <Badge className="bg-green-100 text-green-800 font-normal rounded-full px-3 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        正常
                      </Badge>
                    )}
                    {component.status === "degraded" && (
                      <Badge className="bg-yellow-100 text-yellow-800 font-normal rounded-full px-3 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        パフォーマンス低下
                      </Badge>
                    )}
                    {component.status === "incident" && (
                      <Badge className="bg-red-100 text-red-800 font-normal rounded-full px-3 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        インシデント発生中
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{component.uptime}</TableCell>
                  <TableCell>{component.lastChecked}</TableCell>
                  <TableCell>{component.message || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>予定されたメンテナンス</CardTitle>
          <CardDescription>今後予定されているメンテナンス情報を表示します</CardDescription>
        </CardHeader>
        <CardContent>
          {SCHEDULED_MAINTENANCE.length === 0 ? (
            <p>予定されているメンテナンスはありません。</p>
          ) : (
            <div className="space-y-4">
              {SCHEDULED_MAINTENANCE.map((maintenance) => (
                <div key={maintenance.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{maintenance.component}のメンテナンス</h3>
                      <p className="text-sm text-gray-500">{maintenance.description}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 font-normal rounded-full px-3 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      予定
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">開始時間</p>
                      <p className="text-sm font-medium">{maintenance.scheduledStart}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">終了予定時間</p>
                      <p className="text-sm font-medium">{maintenance.scheduledEnd}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
