"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Download, Upload, FileType } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CsvUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<{
    success: number
    error: number
    warnings: string[]
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadResult(null)
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

      // モックの結果を設定
      setUploadResult({
        success: 45,
        error: 2,
        warnings: ["行15: 日付フォーマットが不正です", "行23: 数値が範囲外です"],
      })

      toast({
        title: "アップロード完了",
        description: "CSVファイルが正常にアップロードされました。",
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

  const handleDownloadTemplate = () => {
    // テンプレートのダウンロード処理
    toast({
      title: "テンプレートダウンロード",
      description: "CSVテンプレートのダウンロードを開始しました。",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="csv-file">CSVファイル</Label>
        <div className="flex items-center gap-4">
          <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} disabled={isUploading} />
          <Button
            type="button"
            variant="outline"
            className="flex items-center"
            onClick={handleDownloadTemplate}
            disabled={isUploading}
          >
            <Download className="mr-2 h-4 w-4" />
            テンプレートダウンロード
          </Button>
        </div>
      </div>

      {file && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">選択されたファイル</p>
                <p className="text-lg">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB • {file.type || "text/csv"}
                </p>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">アップロード中...</p>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-500">{progress}% 完了</p>
                </div>
              )}

              {uploadResult && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">アップロード結果</p>
                  <div className="flex gap-4">
                    <div className="text-green-600">
                      <p className="text-sm">成功</p>
                      <p className="text-lg font-bold">{uploadResult.success}件</p>
                    </div>
                    <div className="text-red-600">
                      <p className="text-sm">エラー</p>
                      <p className="text-lg font-bold">{uploadResult.error}件</p>
                    </div>
                  </div>

                  {uploadResult.warnings.length > 0 && (
                    <Alert variant="warning" className="mt-4">
                      <AlertTitle>警告</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-4 mt-2">
                          {uploadResult.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={isUploading || !file} className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "アップロード中..." : "アップロード"}
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
            CSVファイルをドラッグ&ドロップするか、ファイル選択ボタンをクリックしてください
          </p>
        </div>
      )}
    </form>
  )
}
