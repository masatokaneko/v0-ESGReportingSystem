"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { FileWarning, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function PdfUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [extractedText, setExtractedText] = useState<string>("")
  const [step, setStep] = useState<"upload" | "extract" | "complete">("upload")
  const [formData, setFormData] = useState({
    location_id: "",
    department_id: "",
    emission_factor_id: "",
    activity_date: "",
    activity_data: 0,
    notes: "",
  })
  const { user } = useAuth()
  const { toast } = useToast()

  // ファイル選択処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
    } else {
      toast({
        title: "エラー",
        description: "PDFファイルを選択してください",
        variant: "destructive",
      })
      setFile(null)
      e.target.value = ""
    }
  }

  // PDFファイルのアップロードと解析
  const handleUpload = async () => {
    if (!file || !user) return

    setIsUploading(true)
    setProgress(10)

    try {
      // PDFファイルのアップロード処理
      // 実際の実装では、PDFをOCR処理するAPIを呼び出す
      // ここではモック実装として、タイムアウト後にテキストを返す
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setProgress(50)

      // OCR結果のモック
      const mockExtractedText = `
請求書番号: INV-2023-001
日付: 2023-05-15
拠点: 東京本社
部門: 営業部

電力使用量: 1,500 kWh
ガス使用量: 200 m3
水道使用量: 30 m3

備考: 5月分の使用量です。
      `.trim()

      setExtractedText(mockExtractedText)
      setProgress(100)
      setStep("extract")
    } catch (error) {
      console.error("Error uploading PDF:", error)
      toast({
        title: "エラー",
        description: "PDFファイルのアップロード中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // 入力処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 数値入力処理
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  // セレクト入力処理
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // データ登録処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsProcessing(true)
    setProgress(0)

    try {
      // 実際の実装では、フォームデータを使用してデータエントリを登録する
      // ここではモック実装として、タイムアウト後に成功を返す
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setProgress(100)

      toast({
        title: "登録完了",
        description: "データが正常に登録されました。承認待ち状態です。",
      })

      setStep("complete")
    } catch (error) {
      console.error("Error submitting data:", error)
      toast({
        title: "エラー",
        description: "データの登録中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // フォームのリセット
  const resetForm = () => {
    setFile(null)
    setExtractedText("")
    setFormData({
      location_id: "",
      department_id: "",
      emission_factor_id: "",
      activity_date: "",
      activity_data: 0,
      notes: "",
    })
    setProgress(0)
    setStep("upload")
  }

  return (
    <div className="space-y-6">
      {step === "upload" && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pdf-file">PDFファイルを選択</Label>
              <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} />
            </div>

            <Alert>
              <FileWarning className="h-4 w-4" />
              <AlertTitle>PDF解析について</AlertTitle>
              <AlertDescription>
                <p>PDFファイルをアップロードすると、OCR技術を使用してテキストを抽出します。</p>
                <p className="mt-2">抽出されたテキストから必要な情報を選択し、データ登録フォームに入力してください。</p>
                <p className="mt-2 text-muted-foreground">
                  注: OCR処理の精度は文書の品質によって異なります。抽出結果を必ず確認してください。
                </p>
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button onClick={handleUpload} disabled={!file || isUploading}>
                {isUploading ? (
                  <>
                    <span className="mr-2">処理中...</span>
                    <Progress value={progress} className="w-20" />
                  </>
                ) : (
                  "PDFをアップロード"
                )}
              </Button>
            </div>
          </div>
        </>
      )}

      {step === "extract" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">抽出されたテキスト</h3>
              <Card>
                <CardContent className="p-4">
                  <pre className="whitespace-pre-wrap text-sm">{extractedText}</pre>
                </CardContent>
              </Card>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>抽出テキストの確認</AlertTitle>
                <AlertDescription>
                  抽出されたテキストから必要な情報を確認し、右側のフォームに入力してください。
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">データ入力フォーム</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location_id">拠点</Label>
                  <Select
                    value={formData.location_id}
                    onValueChange={(value) => handleSelectChange("location_id", value)}
                    required
                  >
                    <SelectTrigger id="location_id">
                      <SelectValue placeholder="拠点を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="location1">東京本社</SelectItem>
                      <SelectItem value="location2">大阪支社</SelectItem>
                      <SelectItem value="location3">名古屋支社</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department_id">部門</Label>
                  <Select
                    value={formData.department_id}
                    onValueChange={(value) => handleSelectChange("department_id", value)}
                    required
                  >
                    <SelectTrigger id="department_id">
                      <SelectValue placeholder="部門を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dept1">営業部</SelectItem>
                      <SelectItem value="dept2">管理部</SelectItem>
                      <SelectItem value="dept3">開発部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emission_factor_id">排出係数</Label>
                  <Select
                    value={formData.emission_factor_id}
                    onValueChange={(value) => handleSelectChange("emission_factor_id", value)}
                    required
                  >
                    <SelectTrigger id="emission_factor_id">
                      <SelectValue placeholder="排出係数を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="factor1">電力 (Scope2)</SelectItem>
                      <SelectItem value="factor2">ガス (Scope1)</SelectItem>
                      <SelectItem value="factor3">水道 (Scope3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_date">活動日</Label>
                  <Input
                    id="activity_date"
                    name="activity_date"
                    type="date"
                    value={formData.activity_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity_data">活動量</Label>
                  <Input
                    id="activity_data"
                    name="activity_data"
                    type="number"
                    step="0.01"
                    value={formData.activity_data}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">備考</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="備考があれば入力してください"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <span className="mr-2">登録中...</span>
                        <Progress value={progress} className="w-20" />
                      </>
                    ) : (
                      "データを登録"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {step === "complete" && (
        <>
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>登録完了</AlertTitle>
            <AlertDescription>データが正常に登録されました。承認待ち状態です。</AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button onClick={resetForm}>新しいPDFをアップロード</Button>
          </div>
        </>
      )}
    </div>
  )
}
