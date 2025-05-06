import { DataSearchFilters } from "@/components/data-search/data-search-filters"
import { DataSearchTable } from "@/components/data-search/data-search-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DataSearchPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">データ参照/検索</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>ESGデータ検索</CardTitle>
          <CardDescription>登録済みのESGデータを様々な条件で検索・参照できます。</CardDescription>
        </CardHeader>
        <CardContent>
          <DataSearchFilters />
          <div className="mt-6">
            <DataSearchTable />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
