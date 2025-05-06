import { getTemplateById, generateCsvContent } from "@/lib/csv-templates"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { templateId: string } }) {
  const templateId = params.templateId
  const template = getTemplateById(templateId)

  if (!template) {
    return new NextResponse("Template not found", { status: 404 })
  }

  const csvContent = generateCsvContent(template)

  // CSVファイルとしてレスポンスを返す
  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${template.id}_template.csv"`,
    },
  })
}
