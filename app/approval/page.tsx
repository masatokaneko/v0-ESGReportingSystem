import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

export default function ApprovalPage() {
  // モックデータ
  const pendingData = [
    {
      id: "1",
      date: "2023-04-01",
      department: "営業部",
      location: "東京本社",
      category: "電気使用量",
      value: "1,200 kWh",
      submitter: "山田太郎",
      status: "pending",
    },
    {
      id: "2",
      date: "2023-04-05",
      department: "人事部",
      location: "大阪支店",
      category: "ガス使用量",
      value: "450 m³",
      submitter: "佐藤花子",
      status: "pending",
    },
    {
      id: "3",
      date: "2023-04-10",
      department: "経理部",
      location: "福岡営業所",
      category: "出張（飛行機）",
      value: "東京-大阪 2名",
      submitter: "鈴木一郎",
      status: "pending",
    },
  ]

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">データ承認</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>承認待ちデータ</CardTitle>
          <CardDescription>承認が必要なデータの一覧です</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>部門</TableHead>
                <TableHead>拠点</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>値</TableHead>
                <TableHead>登録者</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>{item.submitter}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      承認待ち
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>承認履歴</CardTitle>
          <CardDescription>過去に承認されたデータの履歴です</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>部門</TableHead>
                <TableHead>拠点</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>値</TableHead>
                <TableHead>登録者</TableHead>
                <TableHead>承認者</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-03-15</TableCell>
                <TableCell>営業部</TableCell>
                <TableCell>東京本社</TableCell>
                <TableCell>電気使用量</TableCell>
                <TableCell>980 kWh</TableCell>
                <TableCell>山田太郎</TableCell>
                <TableCell>鈴木部長</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    承認済み
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-03-20</TableCell>
                <TableCell>人事部</TableCell>
                <TableCell>大阪支店</TableCell>
                <TableCell>ガス使用量</TableCell>
                <TableCell>320 m³</TableCell>
                <TableCell>佐藤花子</TableCell>
                <TableCell>田中部長</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    却下
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
