"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CSV_TEMPLATES, type CsvTemplate } from "@/lib/csv-templates"
import { Download, FileSpreadsheet, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"

export function TemplateGallery() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  const handleDownload = async (template: CsvTemplate) => {
    setIsDownloading(template.id)

    try {
      // APIからテンプレートをダウンロード
      const response = await fetch(`/api/templates/${template.id}`)

      if (!response.ok) {
        throw new Error("テンプレートのダウンロードに失敗しました")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${template.id}_template.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "テンプレートをダウンロードしました",
        description: `${template.name} テンプレートのダウンロードが完了しました。`,
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "ダウンロードエラー",
        description: "テンプレートのダウンロード中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(null)
    }
  }

  // テンプレートをカテゴリーでグループ化
  const templateCategories = [
    { id: "all", name: "すべて" },
    { id: "emissions", name: "排出量", templates: ["general", "ghg"] },
    { id: "resources", name: "資源利用", templates: ["water", "waste"] },
  ]

  return (
    <TooltipProvider>
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          {templateCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CSV_TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isDownloading={isDownloading === template.id}
                onDownload={() => handleDownload(template)}
              />
            ))}
          </div>
        </TabsContent>

        {templateCategories.slice(1).map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CSV_TEMPLATES.filter((template) => category.templates?.includes(template.id)).map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isDownloading={isDownloading === template.id}
                  onDownload={() => handleDownload(template)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </TooltipProvider>
  )
}

interface TemplateCardProps {
  template: CsvTemplate
  isDownloading: boolean
  onDownload: () => void
}

function TemplateCard({ template, isDownloading, onDownload }: TemplateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>{template.name}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4" />
                <span className="sr-only">詳細情報</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{template.description}</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center justify-center py-4">
          <FileSpreadsheet className="h-16 w-16 text-primary opacity-80" />
        </div>
        <div className="text-xs text-muted-foreground">
          <div className="font-medium mb-1">含まれるフィールド:</div>
          <div className="line-clamp-3">{template.headers.join(", ")}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onDownload} disabled={isDownloading}>
          {isDownloading ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ダウンロード中...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              テンプレートをダウンロード
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
