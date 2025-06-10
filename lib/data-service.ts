import {
  mockESGDataEntries,
  mockEmissionOverviewData,
  mockEmissionTrendData,
  mockEmissionBySourceData,
  mockRecentActivities,
  mockDashboardSummary,
  mockLocations,
  mockEmissionFactors,
  generateMockESGData
} from "./mock-data"
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  let data = [...mockESGDataEntries]
  
  if (filters) {
    if (filters.location) {
      data = data.filter(entry => entry.location === filters.location)
    }
    if (filters.department) {
      data = data.filter(entry => entry.department === filters.department)
    }
    if (filters.status) {
      data = data.filter(entry => entry.status === filters.status)
    }
    if (filters.startDate) {
      data = data.filter(entry => entry.date >= filters.startDate)
    }
    if (filters.endDate) {
      data = data.filter(entry => entry.date <= filters.endDate)
    }
  }
  
  return data
}

export async function getESGDataEntry(id: string): Promise<ESGDataEntry | null> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockESGDataEntries.find(entry => entry.id === id) || null
}

export async function updateESGDataStatus(
  id: string,
  status: ESGStatus
): Promise<ESGDataEntry | null> {
  await new Promise(resolve => setTimeout(resolve, 200))
  const entry = mockESGDataEntries.find(e => e.id === id)
  if (entry) {
    entry.status = status
    return entry
  }
  return null
}

// Dashboard Services
export async function getDashboardSummary(): Promise<DashboardSummary> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockDashboardSummary
}

export async function getEmissionOverviewData(): Promise<EmissionOverviewData[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockEmissionOverviewData
}

export async function getEmissionTrendData(): Promise<EmissionTrendData[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockEmissionTrendData
}

export async function getEmissionBySourceData(): Promise<EmissionBySourceData[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockEmissionBySourceData
}

export async function getRecentActivities(): Promise<Activity[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockRecentActivities
}

// Settings Services
export async function getLocations(): Promise<Location[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockLocations
}

export async function getEmissionFactors(): Promise<EmissionFactor[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockEmissionFactors
}

export async function updateEmissionFactor(
  id: string,
  updates: Partial<EmissionFactor>
): Promise<EmissionFactor | null> {
  await new Promise(resolve => setTimeout(resolve, 200))
  const factor = mockEmissionFactors.find(f => f.id === id)
  if (factor) {
    Object.assign(factor, updates)
    return factor
  }
  return null
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
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const newEntry: ESGDataEntry = {
    ...data,
    id: `entry-${Date.now()}`,
    emission: data.activityAmount * data.emissionFactor,
    submittedAt: new Date().toISOString()
  }
  
  mockESGDataEntries.push(newEntry)
  return newEntry
}