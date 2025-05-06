"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Upload, FileType, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function PdfUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedText, setExtractedText] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("upload")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setExtractedText("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    setProgress(0)

    try {
      // 実際のアップロード処理をここに実装
      // 今回はモックとしてプログレスバーを進める
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // モックのOCR結果を設定
      setExtractedText(`電気使用量: 1,250 kWh
請求期間: 2023年4月1日 - 2023年4月30日
拠点: 東京本社
部門: 営業部
CO2排出量: 625 kg-CO2e`)

      setActiveTab("review")

      toast({
        title: "アップロード完了",
        description: "PDFファイルが正常にアップロードされ、テキストが抽出されました。",
      })
    } catch (error) {
      toast({
        title: "エラー",
        description: "ファイルのアップロード中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleConfirm = () => {
    toast({
      title: "データ登録完了",
      description: "抽出されたデータが正常に登録されました。",
    })
    setFile(null)
    setExtractedText("")
    setActiveTab("upload")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">アップロード</TabsTrigger>
        <TabsTrigger value="review" disabled={!extractedText}>
          確認・編集
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdf-file">PDFファイル</Label>
            <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} disabled={isUploading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ocr-type">OCRタイプ</Label>
            <Select defaultValue="auto">
              <SelectTrigger id="ocr-type">
                <SelectValue placeholder="OCRタイプを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">自動検出</SelectItem>
                <SelectItem value="electricity">電気使用量</SelectItem>
                <SelectItem value="gas">ガス使用量</SelectItem>
                <SelectItem value="travel">出張</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {file && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">選択されたファイル</p>
                    <p className="text-lg">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB • {file.type || "application/pdf"}
                    </p>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">アップロード中...</p>
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-gray-500">{progress}% 完了</p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUploading || !file} className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      {isUploading ? "処理中..." : "アップロードして解析"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!file && !isUploading && (
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <FileType className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                PDFファイルをドラッグ&ドロップするか、ファイル選択ボタンをクリックしてください
              </p>
            </div>
          )}
        </form>
      </TabsContent>

      <TabsContent value="review">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">抽出されたテキスト</p>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    原本を表示
                  </Button>
                </div>
                <Textarea
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-sm font-medium">抽出されたデータ</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="extracted-category">カテゴリ</Label>
                    <Select defaultValue="electricity">
                      <SelectTrigger id="extracted-category">
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electricity">電気使用量</SelectItem>
                        <SelectItem value="gas">ガス使用量</SelectItem>
                        <SelectItem value="travel">出張</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extracted-value">数値</Label>
                    <Input id="extracted-value" defaultValue="1250" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extracted-unit">単位</Label>
                    <Select defaultValue="kwh">
                      <SelectTrigger id="extracted-unit">
                        <SelectValue placeholder="単位を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kwh">kWh</SelectItem>
                        <SelectItem value="m3">m³</SelectItem>
                        <SelectItem value="l">L</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extracted-date">日付</Label>
                    <Input id="extracted-date" type="date" defaultValue="2023-04-30" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="extracted-location">拠点</Label>
                    <Select defaultValue="tokyo">
                      <SelectTrigger id="extracted-location">
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
                    <Label htmlFor="extracted-department">部門</Label>
                    <Select defaultValue="sales">
                      <SelectTrigger id="extracted-department">
                        <SelectValue placeholder="部門を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">営業部</SelectItem>
                        <SelectItem value="hr">人事部</SelectItem>
                        <SelectItem value="finance">経理部</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("upload")}
                    className="flex items-center"
                  >
                    キャンセル
                  </Button>
                  <Button type="button" onClick={handleConfirm} className="flex items-center">
                    データを登録
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
