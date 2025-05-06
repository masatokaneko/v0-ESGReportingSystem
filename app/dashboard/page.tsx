import EmissionsOverview from "@/components/dashboard/emissions-overview"
import EmissionsBySource from "@/components/dashboard/emissions-by-source"
import EmissionsTrend from "@/components/dashboard/emissions-trend"

export default function DashboardPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">ESGレポーティングダッシュボード</h1>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <EmissionsOverview />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmissionsBySource />
        <EmissionsTrend />
      </div>
    </main>
  )
}
