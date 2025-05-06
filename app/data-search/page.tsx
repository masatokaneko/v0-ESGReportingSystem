import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DataSearchPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">データ参照/検索</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>検索条件</CardTitle>
          <CardDescription>検索条件を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="period">期間</Label>
              <Select>
                <SelectTrigger id="period">
                  <SelectValue placeholder="期間を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-q1">2023年 第1四半期</SelectItem>
                  <SelectItem value="2023-q2">2023年 第2四半期</SelectItem>
                  <SelectItem value="2023-q3">2023年 第3四半期</SelectItem>
                  <SelectItem value="2023-q4">2023年 第4四半期</SelectItem>
                  <SelectItem value="2023-full">2023年 通年</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">拠点</Label>
              <Select>
                <SelectTrigger id="location">
                  <SelectValue placeholder="拠点を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての拠点</SelectItem>
                  <SelectItem value="tokyo">東京本社</SelectItem>
                  <SelectItem value="osaka">大阪支店</SelectItem>
                  <SelectItem value="fukuoka">福岡営業所</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">部門</Label>
              <Select>
                <SelectTrigger id="department">
                  <SelectValue placeholder="部門を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての部門</SelectItem>
                  <SelectItem value="sales">営業部</SelectItem>
                  <SelectItem value="hr">人事部</SelectItem>
                  <SelectItem value="finance">経理部</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="category">カテゴリ</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのカテゴリ</SelectItem>
                  <SelectItem value="electricity">電気使用量</SelectItem>
                  <SelectItem value="gas">ガス使用量</SelectItem>
                  <SelectItem value="travel">出張</SelectItem>
                  <SelectItem value="waste">廃棄物</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyword">キーワード</Label>
              <Input id="keyword" placeholder="キーワードを入力" />
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" />
                検索
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>検索結果</CardTitle>
          <CardDescription>検索条件に一致するデータの一覧です</CardDescription>
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
                <TableHead>CO2排出量</TableHead>
                <TableHead>登録者</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-01-15</TableCell>
                <TableCell>営業部</TableCell>
                <TableCell>東京本社</TableCell>
                <TableCell>電気使用量</TableCell>
                <TableCell>1,200 kWh</TableCell>
                <TableCell>600 kg-CO2e</TableCell>
                <TableCell>山田太郎</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-02-10</TableCell>
                <TableCell>人事部</TableCell>
                <TableCell>大阪支店</TableCell>
                <TableCell>ガス使用量</TableCell>
                <TableCell>450 m³</TableCell>
                <TableCell>990 kg-CO2e</TableCell>
                <TableCell>佐藤花子</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-03-05</TableCell>
                <TableCell>経理部</TableCell>
                <TableCell>福岡営業所</TableCell>
                <TableCell>出張（飛行機）</TableCell>
                <TableCell>東京-大阪 2名</TableCell>
                <TableCell>320 kg-CO2e</TableCell>
                <TableCell>鈴木一郎</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
