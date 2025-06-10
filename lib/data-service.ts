import type {
  ESGDataEntry,
  EmissionOverviewData,
  EmissionTrendData,
  EmissionBySourceData,
  Activity,
  Location,
  EmissionFactor,
  DashboardSummary,
  ESGStatus
} from "./types"

// ESG Data Services
export async function getESGDataEntries(filters?: {
  location?: string
  department?: string
  status?: ESGStatus
  startDate?: string
  endDate?: string
}): Promise<ESGDataEntry[]> {
  const searchParams = new URLSearchParams()
  
  if (filters?.location) searchParams.set('location', filters.location)
  if (filters?.department) searchParams.set('department', filters.department)
  if (filters?.status) searchParams.set('status', filters.status)
  if (filters?.startDate) searchParams.set('startDate', filters.startDate)
  if (filters?.endDate) searchParams.set('endDate', filters.endDate)
  
  const url = `/api/esg-entries?${searchParams.toString()}`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to fetch ESG entries')
  }
  
  return response.json()
}

export async function getESGDataEntry(id: string): Promise<ESGDataEntry | null> {
  const response = await fetch(`/api/esg-entries/${id}`)
  
  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error('Failed to fetch ESG entry')
  }
  
  return response.json()
}

export async function updateESGDataStatus(
  id: string,
  status: ESGStatus,
  approvedBy?: string
): Promise<ESGDataEntry | null> {
  const response = await fetch(`/api/esg-entries/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, approvedBy }),
  })
  
  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error('Failed to update ESG entry status')
  }
  
  return response.json()
}

// Dashboard Services
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch('/api/dashboard')
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary')
  }
  
  return response.json()
}

export async function getEmissionOverviewData(): Promise<EmissionOverviewData[]> {
  const dashboard = await getDashboardSummary()
  
  // ダッシュボードデータから概要データを構築
  return [
    { 
      name: "Scope 1", 
      electricity: 0, 
      gas: dashboard.totalScope1 * 0.6, 
      fuel: dashboard.totalScope1 * 0.4, 
      water: 0, 
      waste: 0 
    },
    { 
      name: "Scope 2", 
      electricity: dashboard.totalScope2, 
      gas: 0, 
      fuel: 0, 
      water: 0, 
      waste: 0 
    },
    { 
      name: "Scope 3", 
      electricity: 0, 
      gas: 0, 
      fuel: 0, 
      water: dashboard.totalScope3 * 0.7, 
      waste: dashboard.totalScope3 * 0.3 
    },
  ]
}

export async function getEmissionTrendData(): Promise<EmissionTrendData[]> {
  const dashboard = await getDashboardSummary()
  return dashboard.trendData
}

export async function getEmissionBySourceData(): Promise<EmissionBySourceData[]> {
  const dashboard = await getDashboardSummary()
  return dashboard.sourceData
}

export async function getRecentActivities(): Promise<Activity[]> {
  const dashboard = await getDashboardSummary()
  return dashboard.recentActivities
}

// Settings Services
export async function getLocations(): Promise<Location[]> {
  const response = await fetch('/api/locations')
  
  if (!response.ok) {
    throw new Error('Failed to fetch locations')
  }
  
  return response.json()
}

export async function getEmissionFactors(): Promise<EmissionFactor[]> {
  const response = await fetch('/api/emission-factors')
  
  if (!response.ok) {
    throw new Error('Failed to fetch emission factors')
  }
  
  return response.json()
}

export async function updateEmissionFactor(
  id: string,
  updates: Partial<EmissionFactor>
): Promise<EmissionFactor | null> {
  // TODO: Implement API endpoint for updating emission factors
  throw new Error('Update emission factor not implemented yet')
}

// Report Generation Service
export async function generateReport(config: {
  startDate: Date
  endDate: Date
  locations?: string[]
  format: "pdf" | "excel" | "csv"
}): Promise<{ url: string; filename: string }> {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generate mock report data
  const reportData = generateMockESGData(
    config.startDate,
    config.endDate,
    20
  )
  
  // Filter by locations if specified
  const filteredData = config.locations?.length
    ? reportData.filter(entry => config.locations?.includes(entry.location))
    : reportData
  
  // Simulate file generation
  const filename = `esg-report-${config.startDate.toISOString().split('T')[0]}-${config.endDate.toISOString().split('T')[0]}.${config.format}`
  const url = `/api/reports/download/${filename}`
  
  return { url, filename }
}

// Data Entry Service
export async function submitESGData(data: Omit<ESGDataEntry, "id" | "emission" | "submittedAt">): Promise<ESGDataEntry> {
  const response = await fetch('/api/esg-entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error('Failed to submit ESG data')
  }
  
  return response.json()
}