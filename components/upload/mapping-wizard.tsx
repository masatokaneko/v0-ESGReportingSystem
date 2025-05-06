"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { ArrowRight, Check, Save } from "lucide-react"

interface MappingWizardProps {
  csvHeaders: string[]
  onComplete: (mapping: Record<string, string>) => void
  onCancel: () => void
}

const REQUIRED_FIELDS = [
  { id: "company_code", name: "会社コード" },
  { id: "site_code", name: "拠点コード" },
  { id: "fiscal_year", name: "会計年度" },
  { id: "kpi_category", name: "KPIカテゴリ" },
  { id: "kpi_name", name: "KPI名" },
  { id: "value", name: "値" },
  { id: "unit", name: "単位" },
]

export function MappingWizard({ csvHeaders, onComplete, onCancel }: MappingWizardProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [draggedField, setDraggedField] = useState<string | null>(null)
  const [step, setStep] = useState<"mapping" | "review">("mapping")
  const [isSaving, setIsSaving] = useState(false)

  const handleDragStart = (field: string) => {
    setDraggedField(field)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, header: string) => {
    e.preventDefault()
    if (draggedField) {
      setMapping((prev) => ({
        ...prev,
        [draggedField]: header,
      }))
      setDraggedField(null)
    }
  }

  const handleRemoveMapping = (field: string) => {
    setMapping((prev) => {
      const newMapping = { ...prev }
      delete newMapping[field]
      return newMapping
    })
  }

  const isFieldMapped = (field: string) => {
    return mapping[field] !== undefined
  }

  const isHeaderMapped = (header: string) => {
    return Object.values(mapping).includes(header)
  }

  const allRequiredFieldsMapped = () => {
    return REQUIRED_FIELDS.every((field) => isFieldMapped(field.id))
  }

  const handleSaveMapping = () => {
    setIsSaving(true)

    // 実際の実装ではAPIにマッピングを保存します
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "マッピングが保存されました",
        description: "次回のアップロードから自動的に適用されます。",
      })
      onComplete(mapping)
    }, 1000)
  }

  const getFieldLabel = (fieldId: string) => {
    const field = REQUIRED_FIELDS.find((f) => f.id === fieldId)
    return field ? field.name : fieldId
  }

  return (
    <div className="space-y-6">
      {step === "mapping" ? (
        <>
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium">CSVヘッダーのマッピング</h3>
            <p className="text-sm text-muted-foreground mt-1">
              左側の必須フィールドを右側のCSVヘッダーにドラッグ＆ドロップしてマッピングしてください。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">必須フィールド</h4>
              <div className="space-y-2">
                {REQUIRED_FIELDS.map((field) => (
                  <div
                    key={field.id}
                    draggable={!isFieldMapped(field.id)}
                    onDragStart={() => handleDragStart(field.id)}
                    className={`p-2 rounded-md border ${
                      isFieldMapped(field.id) ? "bg-green-50 border-green-200" : "bg-muted cursor-move"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{field.name}</span>
                      {isFieldMapped(field.id) && (
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-sm text-muted-foreground">{mapping[field.id]}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-1"
                            onClick={() => handleRemoveMapping(field.id)}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">CSVヘッダー</h4>
              <div className="space-y-2">
                {csvHeaders.map((header) => (
                  <div
                    key={header}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, header)}
                    className={`p-2 rounded-md border ${
                      isHeaderMapped(header)
                        ? "bg-green-50 border-green-200"
                        : "border-dashed border-muted-foreground/50"
                    }`}
                  >
                    {header}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button onClick={() => setStep("review")} disabled={!allRequiredFieldsMapped()}>
              次へ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium">マッピングの確認</h3>
            <p className="text-sm text-muted-foreground mt-1">以下のマッピングで正しいか確認してください。</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {Object.entries(mapping).map(([field, header]) => (
                  <div key={field} className="flex justify-between py-1 border-b">
                    <span className="font-medium">{getFieldLabel(field)}</span>
                    <span className="text-muted-foreground">{header}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep("mapping")}>
              戻る
            </Button>
            <Button onClick={handleSaveMapping} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  マッピングを保存して続行
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
