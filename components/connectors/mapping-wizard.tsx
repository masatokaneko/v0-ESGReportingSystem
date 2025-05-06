"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type MappingField = {
  sourceField: string
  targetField: string | null
}

type MappingWizardProps = {
  sourceFields: string[]
  targetFields: { id: string; name: string }[]
  onComplete: (mapping: Record<string, string>) => void
  onCancel: () => void
}

export function MappingWizard({ sourceFields, targetFields, onComplete, onCancel }: MappingWizardProps) {
  const [mappings, setMappings] = useState<MappingField[]>(
    sourceFields.map((field) => ({
      sourceField: field,
      targetField: null,
    })),
  )

  const handleMappingChange = (sourceField: string, targetField: string) => {
    setMappings((prev) =>
      prev.map((mapping) => (mapping.sourceField === sourceField ? { ...mapping, targetField } : mapping)),
    )
  }

  const handleSaveMapping = () => {
    const mappingResult: Record<string, string> = {}
    mappings.forEach((mapping) => {
      if (mapping.targetField) {
        mappingResult[mapping.sourceField] = mapping.targetField
      }
    })

    onComplete(mappingResult)
    toast({
      title: "マッピングが保存されました",
      description: "フィールドマッピングが正常に保存されました。",
    })
  }

  const getMappedCount = () => {
    return mappings.filter((m) => m.targetField !== null).length
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>フィールドマッピングウィザード</CardTitle>
        <CardDescription>
          CSVファイルのフィールドとシステムのフィールドをマッピングしてください。マッピングは後で保存して再利用できます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">マッピング進捗</p>
              <p className="text-lg font-bold">
                {getMappedCount()} / {sourceFields.length} フィールド
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                キャンセル
              </Button>
              <Button onClick={handleSaveMapping} disabled={getMappedCount() === 0}>
                <Save className="mr-2 h-4 w-4" />
                マッピングを保存
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {mappings.map((mapping, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="p-2 bg-gray-100 rounded-md">{mapping.sourceField}</div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <Select
                    value={mapping.targetField || ""}
                    onValueChange={(value) => handleMappingChange(mapping.sourceField, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ターゲットフィールドを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
