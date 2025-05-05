"use client"

import type React from "react"

import { useState } from "react"
import { FileIcon, UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface FileUploaderProps {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
}

export function FileUploader({ files, setFiles }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

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
    handleFiles(droppedFiles)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (newFiles: File[]) => {
    // PDFファイルのみを許可
    const pdfFiles = newFiles.filter((file) => file.type === "application/pdf")

    if (pdfFiles.length !== newFiles.length) {
      toast({
        title: "PDFファイルのみアップロード可能です",
        description: "選択されたファイルの中にPDF以外のファイルが含まれています。",
        variant: "destructive",
      })
    }

    // 10MBを超えるファイルをチェック
    const validFiles = pdfFiles.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "ファイルサイズが大きすぎます",
          description: `${file.name} は10MBを超えています。`,
          variant: "destructive",
        })
        return false
      }
      return true
    })

    setFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
        <div className="mt-4">
          <p className="text-sm font-medium">ファイルをドラッグ＆ドロップするか、クリックしてアップロード</p>
          <p className="mt-1 text-xs text-muted-foreground">PDFファイルのみ・最大10MB</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 relative"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          ファイルを選択
          <input id="file-upload" type="file" className="sr-only" accept=".pdf" multiple onChange={handleFileChange} />
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => removeFile(index)}>
                <X className="h-4 w-4" />
                <span className="sr-only">削除</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
