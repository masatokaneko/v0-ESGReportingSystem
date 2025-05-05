"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { FileUp, FileX, Upload } from "lucide-react"
import Link from "next/link"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: () => void
}

export function UploadDialog({ open, onOpenChange, onUploadComplete }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      const csvFile = droppedFiles[0]
      if (csvFile.type === "text/csv" || csvFile.name.endsWith(".csv")) {
        setFile(csvFile)
      } else {
        toast({
          title: "CSVファイルのみアップロード可能です",
          description: "選択されたファイルはCSV形式ではありません。",
          variant: "destructive",
        })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile)
      } else {
        toast({
          title: "CSVファイルのみアップロード可能です",
          description: "選択されたファイルはCSV形式ではありません。",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = () => {
    if (!file) return

    setIsUploading(true)

    // 実際の実装ではAPIにファイルをアップロードします
    setTimeout(() => {
      setIsUploading(false)
      onOpenChange(false)
      if (onUploadComplete) onUploadComplete()

      toast({
        title: "CSVファイルがアップロードされました",
        description: `${file.name} が正常にアップロードされました。`,
      })

      setFile(null)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>CSVファイルのアップロード</DialogTitle>
          <DialogDescription>
            ESGデータをCSV形式でアップロードします。テンプレートに沿ったフォーマットを使用してください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href="/upload/csv/templates">テンプレートを表示</Link>
            </Button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex flex-col items-center">
                <FileUp className="h-10 w-10 text-primary mb-2" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => setFile(null)}>
                  <FileX className="h-4 w-4 mr-1" />
                  ファイルを削除
                </Button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <p className="text-sm font-medium">CSVファイルをドラッグ＆ドロップするか、クリックしてアップロード</p>
                  <p className="mt-1 text-xs text-muted-foreground">UTF-8エンコードのCSVファイルを使用してください</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 relative"
                  onClick={() => document.getElementById("csv-upload")?.click()}
                >
                  ファイルを選択
                  <input id="csv-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                </Button>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                アップロード中...
              </>
            ) : (
              "アップロード"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
