"use client"

import type React from "react"

import { useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, FileWarning } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type CsvRow = {
  location_name: string
  department_name: string
  emission_factor_name: string
  activity_date: string
  activity_data: number
  notes?: string
  status: "valid" | "invalid"
  error?: string
  location_id?: string
  department_id?: string
  emission_factor_id?: string
}

export function CsvUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previewData, setPreviewData] = useState<CsvRow[]>([])
  const [validRows, setValidRows] = useState(0)
  const [invalidRows, setInvalidRows] = useState(0)
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload")
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClientSupabaseClient()

  // ファイル選択処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
    } else {
      toast({
        title: "エラー",
        description: "CSVファイルを選択してください",
        variant: "destructive",
      })
      setFile(null)
      e.target.value = ""
    }
  }

  // CSVファイルの検証
  const validateCsv = async () => {
    if (!file || !user) return

    setIsUploading(true)
    setProgress(10)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const csvText = event.target?.result as string
        const rows = csvText.split("\n")
        const headers = rows[0].split(",").map((h) => h.trim())

        // ヘッダーの検証
        const requiredHeaders = [
          "location_name",
          "department_name",
          "emission_factor_name",
          "activity_date",
          "activity_data",
        ]
        const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

        if (missingHeaders.length > 0) {
          toast({
            title: "CSVフォーマットエラー",
            description: `必須ヘッダーが不足しています: ${missingHeaders.join(", ")}`,
            variant: "destructive",
          })
          setIsUploading(false)
          return
        }

        setProgress(30)

        // マスターデータの取得
        const { data: locations, error: locationsError } = await supabase.from("locations").select("id, name")
        if (locationsError) throw locationsError

        const { data: departments, error: departmentsError } = await supabase
          .from("departments")
          .select("id, name, location_id")
        if (departmentsError) throw departmentsError

        const { data: emissionFactors, error: factorsError } = await supabase
          .from("emission_factors")
          .select("id, name, value")
          .eq("is_active", true)
        if (factorsError) throw factorsError

        setProgress(50)

        // データ行の検証
        const parsedRows: CsvRow[] = []
        let validCount = 0
        let invalidCount = 0

        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue // 空行をスキップ

          const values = rows[i].split(",").map((v) => v.trim())
          const rowData: any = {}

          // ヘッダーと値のマッピング
          headers.forEach((header, index) => {
            rowData[header] = values[index] || ""
          })

          // 行データの検証
          let isValid = true
          let errorMessage = ""

          // 拠点の検証
          const location = locations.find((loc) => loc.name === rowData.location_name)
          if (!location) {
            isValid = false
            errorMessage = "拠点が見つかりません"
          } else {
            rowData.location_id = location.id
          }

          // 部門の検証
          if (isValid) {
            const department = departments.find(
              (dept) => dept.name === rowData.department_name && dept.location_id === rowData.location_id,
            )
            if (!department) {
              isValid = false
              errorMessage = "部門が見つかりません"
            } else {
              rowData.department_id = department.id
            }
          }

          // 排出係数の検証
          if (isValid) {
            const emissionFactor = emissionFactors.find((factor) => factor.name === rowData.emission_factor_name)
            if (!emissionFactor) {
              isValid = false
              errorMessage = "排出係数が見つかりません"
            } else {
              rowData.emission_factor_id = emissionFactor.id
              rowData.emission_factor_value = emissionFactor.value
            }
          }

          // 日付の検証
          if (isValid) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/
            if (!dateRegex.test(rowData.activity_date)) {
              isValid = false
              errorMessage = "日付形式が不正です (YYYY-MM-DD)"
            }
          }

          // 活動量の検証
          if (isValid) {
            const activityData = Number.parseFloat(rowData.activity_data)
            if (isNaN(activityData) || activityData < 0) {
              isValid = false
              errorMessage = "活動量が不正です"
            } else {
              rowData.activity_data = activityData
            }
          }

          // 検証結果の追加
          parsedRows.push({
            ...rowData,
            status: isValid ? "valid" : "invalid",
            error: isValid ? undefined : errorMessage,
          })

          if (isValid) {
            validCount++
          } else {
            invalidCount++
          }
        }

        setProgress(80)
        setPreviewData(parsedRows)
        setValidRows(validCount)
        setInvalidRows(invalidCount)
        setStep("preview")
        setProgress(100)
      }

      reader.readAsText(file)
    } catch (error) {
      console.error("Error validating CSV:", error)
      toast({
        title: "エラー",
        description: "CSVファイルの検証中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // データの登録処理
  const handleSubmit = async () => {
    if (!user) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const validData = previewData.filter((row) => row.status === "valid")
      let successCount = 0

      for (let i = 0; i < validData.length; i++) {
        const row = validData[i]
        const progress = Math.round(((i + 1) / validData.length) * 100)
        setProgress(progress)

        // 排出量の計算
        const { data: factor, error: factorError } = await supabase
          .from("emission_factors")
          .select("value")
          .eq("id", row.emission_factor_id)
          .single()

        if (factorError) throw factorError

        const emissions = row.activity_data * factor.value

        // データエントリの登録
        const { error } = await supabase.from("data_entries").insert({
          user_id: user.id,
          location_id: row.location_id,
          department_id: row.department_id,
          emission_factor_id: row.emission_factor_id,
          activity_date: row.activity_date,
          activity_data: row.activity_data,
          emissions: emissions,
          notes: row.notes || "",
          status: "pending", // 承認待ち状態
        })

        if (error) throw error
        successCount++
      }

      toast({
        title: "登録完了",
        description: `${successCount}件のデータが正常に登録されました。承認待ち状態です。`,
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

  // アップロードフォームのリセット
  const resetForm = () => {
    setFile(null)
    setPreviewData([])
    setValidRows(0)
    setInvalidRows(0)
    setProgress(0)
    setStep("upload")
  }

  return (
    <div className="space-y-6">
      {step === "upload" && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSVファイルを選択</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
            </div>

            <Alert>
              <FileWarning className="h-4 w-4" />
              <AlertTitle>CSVファイル形式</AlertTitle>
              <AlertDescription>
                <p>以下のヘッダーを含むCSVファイルをアップロードしてください：</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>location_name - 拠点名（マスターに登録されている名前）</li>
                  <li>department_name - 部門名（マスターに登録されている名前）</li>
                  <li>emission_factor_name - 排出係数名（マスターに登録されている名前）</li>
                  <li>activity_date - 活動日（YYYY-MM-DD形式）</li>
                  <li>activity_data - 活動量（数値）</li>
                  <li>notes - 備考（オプション）</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button onClick={validateCsv} disabled={!file || isUploading}>
                {isUploading ? (
                  <>
                    <span className="mr-2">検証中...</span>
                    <Progress value={progress} className="w-20" />
                  </>
                ) : (
                  "CSVを検証"
                )}
              </Button>
            </div>
          </div>
        </>
      )}

      {step === "preview" && (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">CSVプレビュー</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>有効: {validRows}行</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span>無効: {invalidRows}行</span>
                </div>
              </div>
            </div>

            <Alert variant={invalidRows > 0 ? "destructive" : "default"}>
              {invalidRows > 0 ? (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>エラーがあります</AlertTitle>
                  <AlertDescription>
                    {invalidRows}行のデータにエラーがあります。エラー内容を確認し、CSVファイルを修正してください。
                  </AlertDescription>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>検証成功</AlertTitle>
                  <AlertDescription>すべてのデータが有効です。登録を続行できます。</AlertDescription>
                </>
              )}
            </Alert>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>状態</TableHead>
                    <TableHead>拠点</TableHead>
                    <TableHead>部門</TableHead>
                    <TableHead>排出係数</TableHead>
                    <TableHead>活動日</TableHead>
                    <TableHead>活動量</TableHead>
                    <TableHead>備考</TableHead>
                    <TableHead>エラー</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index} className={row.status === "invalid" ? "bg-red-50" : ""}>
                      <TableCell>
                        {row.status === "valid" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>{row.location_name}</TableCell>
                      <TableCell>{row.department_name}</TableCell>
                      <TableCell>{row.emission_factor_name}</TableCell>
                      <TableCell>{row.activity_date}</TableCell>
                      <TableCell>{row.activity_data}</TableCell>
                      <TableCell>{row.notes || "-"}</TableCell>
                      <TableCell className="text-red-500">{row.error || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                キャンセル
              </Button>
              <Button onClick={handleSubmit} disabled={invalidRows > 0 || validRows === 0 || isProcessing}>
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
          </div>
        </>
      )}

      {step === "complete" && (
        <>
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>登録完了</AlertTitle>
            <AlertDescription>{validRows}件のデータが正常に登録されました。承認待ち状態です。</AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button onClick={resetForm}>新しいCSVをアップロード</Button>
          </div>
        </>
      )}
    </div>
  )
}
