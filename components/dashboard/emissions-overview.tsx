"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

type EmissionsOverviewProps = {
  data: {
    scope1: number
    scope2: number
    scope3: number
    total: number
    previousPeriod: {
      scope1: number
      scope2: number
      scope3: number
      total: number
    }
  } | null
  isLoading: boolean
}

export function EmissionsOverview({ data, isLoading }: EmissionsOverviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">データがありません</p>
      </div>
    )
  }

  // 前期比の計算
  const getPercentChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const scope1Change = getPercentChange(data.scope1, data.previousPeriod.scope1)
  const scope2Change = getPercentChange(data.scope2, data.previousPeriod.scope2)
  const scope3Change = getPercentChange(data.scope3, data.previousPeriod.scope3)
  const totalChange = getPercentChange(data.total, data.previousPeriod.total)

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Scope 1</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold">{data.scope1.toLocaleString()} t-CO2e</p>
              {scope1Change !== 0 && (
                <div className={`flex items-center ${scope1Change > 0 ? "text-red-500" : "text-green-500"}`}>
                  {scope1Change > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs font-medium">{Math.abs(scope1Change).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Scope 2</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold">{data.scope2.toLocaleString()} t-CO2e</p>
              {scope2Change !== 0 && (
                <div className={`flex items-center ${scope2Change > 0 ? "text-red-500" : "text-green-500"}`}>
                  {scope2Change > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs font-medium">{Math.abs(scope2Change).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Scope 3</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold">{data.scope3.toLocaleString()} t-CO2e</p>
              {scope3Change !== 0 && (
                <div className={`flex items-center ${scope3Change > 0 ? "text-red-500" : "text-green-500"}`}>
                  {scope3Change > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs font-medium">{Math.abs(scope3Change).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">合計排出量</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold">{data.total.toLocaleString()} t-CO2e</p>
              {totalChange !== 0 && (
                <div className={`flex items-center ${totalChange > 0 ? "text-red-500" : "text-green-500"}`}>
                  {totalChange > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs font-medium">{Math.abs(totalChange).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
