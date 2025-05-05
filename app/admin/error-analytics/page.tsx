import { ErrorAnalytics } from "@/components/admin/error-analytics"

export default function ErrorAnalyticsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">エラー分析</h1>
      <ErrorAnalytics />
    </div>
  )
}
