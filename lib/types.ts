// ESG Data Entry Types
export interface ESGDataEntry {
  id: string
  date: string
  location: string
  department: Department
  activityType: ActivityType
  activityAmount: number
  emissionFactor: number
  emission: number
  status: ESGStatus
  submitter: string
  submittedAt: string
  notes?: string
  files?: string[]
}

// Dashboard Types
export interface EmissionOverviewData {
  name: string
  [key: string]: number | string
}

export interface EmissionTrendData {
  name: string
  "Scope 1": number
  "Scope 2": number
  "Scope 3": number
}

export interface EmissionBySourceData {
  name: string
  value: number
  color: string
}

export interface Activity {
  name: string
  avatar?: string
  action: string
  date: string
}

// Settings Types
export interface Location {
  id: string
  name: string
  code: string
  address: string
  type: string
}

export interface EmissionFactor {
  id: string
  activityType: ActivityType
  category: string
  factor: number
  unit: string
}

// Report Types
export interface ReportConfig {
  reportType: string
  period: string
  startDate: Date
  endDate: Date
  locations: string[]
  includeCharts: boolean
  includeComparison: boolean
}

// CSV Types
export interface CSVMapping {
  [fieldId: string]: string
}

// Enums and Constants
export type Department = "admin" | "sales" | "production" | "rd" | "it"
export type ActivityType = "electricity" | "gas" | "fuel" | "water" | "waste"
export type ESGStatus = "pending" | "approved" | "rejected"

export const DEPARTMENTS: Record<Department, string> = {
  admin: "管理部",
  sales: "営業部",
  production: "製造部",
  rd: "研究開発部",
  it: "IT部"
}

export const ACTIVITY_TYPES: Record<ActivityType, string> = {
  electricity: "電力",
  gas: "ガス",
  fuel: "燃料",
  water: "水",
  waste: "廃棄物"
}

export const ESG_STATUSES: Record<ESGStatus, string> = {
  pending: "承認待ち",
  approved: "承認済み",
  rejected: "却下"
}

// Additional Types
export interface User {
  id: string
  name: string
  email: string
  department: Department
  role: "admin" | "manager" | "user"
}

export interface Organization {
  id: string
  name: string
  code: string
  industry: string
  fiscalYearStart: number
}

export interface DashboardSummary {
  totalEmissions: number
  totalScope1: number
  totalScope2: number
  totalScope3: number
  changeFromLastMonth: number
  pendingApprovals: number
  recentActivities: Activity[]
}