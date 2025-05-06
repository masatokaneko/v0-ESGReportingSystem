import { DataApprovalTable } from "@/components/approval/data-approval-table"
import { DataApprovalFilters } from "@/components/approval/data-approval-filters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DataApprovalPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">データ承認</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>承認待ちデータ一覧</CardTitle>
          <CardDescription>登録されたESGデータを確認し、承認または差戻しを行います。</CardDescription>
        </CardHeader>
        <CardContent>
          <DataApprovalFilters />
          <div className="mt-6">
            <DataApprovalTable />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
