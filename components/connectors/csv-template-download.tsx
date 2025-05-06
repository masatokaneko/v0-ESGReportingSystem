"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, ChevronDown } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const CSV_TEMPLATES = [
  { name: "汎用", value: "generic" },
  { name: "Air", value: "air" },
  { name: "Water", value: "water" },
  { name: "Waste", value: "waste" },
  { name: "Safety", value: "safety" },
  { name: "GHG", value: "ghg" },
]

export function CsvTemplateDownload() {
  const handleDownload = (template: string) => {
    // 実際の実装ではAPIからテンプレートをダウンロード
    toast({
      title: "テンプレートのダウンロード",
      description: `${template}テンプレートのダウンロードを開始しました。`,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          テンプレートをダウンロード
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {CSV_TEMPLATES.map((template) => (
          <DropdownMenuItem key={template.value} onClick={() => handleDownload(template.name)}>
            {template.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
