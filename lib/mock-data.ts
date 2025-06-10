import type {
  ESGDataEntry,
  EmissionOverviewData,
  EmissionTrendData,
  EmissionBySourceData,
  Activity,
  Location,
  EmissionFactor,
  DashboardSummary,
  User,
  Department,
  ActivityType,
  ESGStatus
} from "./types"

// Mock Users
export const mockUsers: User[] = [
  { id: "1", name: "田中太郎", email: "tanaka@example.com", department: "admin", role: "admin" },
  { id: "2", name: "佐藤花子", email: "sato@example.com", department: "production", role: "manager" },
  { id: "3", name: "鈴木一郎", email: "suzuki@example.com", department: "sales", role: "user" },
]

// Mock Locations
export const mockLocations: Location[] = [
  { id: "1", name: "本社", code: "HQ001", address: "東京都千代田区大手町1-1-1", type: "office" },
  { id: "2", name: "大阪支社", code: "OS001", address: "大阪府大阪市中央区本町2-2-2", type: "office" },
  { id: "3", name: "名古屋工場", code: "NF001", address: "愛知県名古屋市港区3-3-3", type: "factory" },
  { id: "4", name: "福岡営業所", code: "FS001", address: "福岡県福岡市博多区4-4-4", type: "sales" },
]

// Mock Emission Factors
export const mockEmissionFactors: EmissionFactor[] = [
  { id: "1", activityType: "electricity", category: "電力", factor: 0.000495, unit: "tCO2/kWh" },
  { id: "2", activityType: "gas", category: "都市ガス", factor: 0.00224, unit: "tCO2/m³" },
  { id: "3", activityType: "fuel", category: "ガソリン", factor: 0.00232, unit: "tCO2/L" },
  { id: "4", activityType: "water", category: "上水道", factor: 0.00036, unit: "tCO2/m³" },
  { id: "5", activityType: "waste", category: "一般廃棄物", factor: 0.00034, unit: "tCO2/kg" },
]

// Mock ESG Data Entries
export const mockESGDataEntries: ESGDataEntry[] = [
  {
    id: "1",
    date: "2024-12-01",
    location: "本社",
    department: "admin",
    activityType: "electricity",
    activityAmount: 15000,
    emissionFactor: 0.000495,
    emission: 7.425,
    status: "approved",
    submitter: "田中太郎",
    submittedAt: "2024-12-02T10:00:00Z",
    notes: "12月分電力使用量"
  },
  {
    id: "2",
    date: "2024-12-05",
    location: "名古屋工場",
    department: "production",
    activityType: "gas",
    activityAmount: 3000,
    emissionFactor: 0.00224,
    emission: 6.72,
    status: "pending",
    submitter: "佐藤花子",
    submittedAt: "2024-12-06T14:30:00Z",
    notes: "製造ライン用ガス"
  },
  {
    id: "3",
    date: "2024-12-10",
    location: "大阪支社",
    department: "sales",
    activityType: "fuel",
    activityAmount: 500,
    emissionFactor: 0.00232,
    emission: 1.16,
    status: "approved",
    submitter: "鈴木一郎",
    submittedAt: "2024-12-11T09:15:00Z",
    notes: "営業車ガソリン"
  },
]

// Mock Emission Overview Data
export const mockEmissionOverviewData: EmissionOverviewData[] = [
  { name: "Scope 1", electricity: 50, gas: 80, fuel: 120, water: 20, waste: 30 },
  { name: "Scope 2", electricity: 150, gas: 40, fuel: 0, water: 10, waste: 0 },
  { name: "Scope 3", electricity: 30, gas: 20, fuel: 50, water: 5, waste: 45 },
]

// Mock Emission Trend Data
export const mockEmissionTrendData: EmissionTrendData[] = [
  { name: "7月", "Scope 1": 280, "Scope 2": 190, "Scope 3": 140 },
  { name: "8月", "Scope 1": 300, "Scope 2": 200, "Scope 3": 150 },
  { name: "9月", "Scope 1": 290, "Scope 2": 185, "Scope 3": 145 },
  { name: "10月", "Scope 1": 310, "Scope 2": 195, "Scope 3": 155 },
  { name: "11月", "Scope 1": 295, "Scope 2": 190, "Scope 3": 148 },
  { name: "12月", "Scope 1": 300, "Scope 2": 200, "Scope 3": 150 },
]

// Mock Emission by Source Data
export const mockEmissionBySourceData: EmissionBySourceData[] = [
  { name: "電力", value: 230, color: "hsl(12, 76%, 61%)" },
  { name: "ガス", value: 140, color: "hsl(173, 58%, 39%)" },
  { name: "燃料", value: 170, color: "hsl(197, 37%, 24%)" },
  { name: "水", value: 35, color: "hsl(43, 74%, 66%)" },
  { name: "廃棄物", value: 75, color: "hsl(27, 87%, 67%)" },
]

// Mock Recent Activities
export const mockRecentActivities: Activity[] = [
  {
    name: "田中太郎",
    action: "本社の12月分電力データを登録しました",
    date: "2時間前",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "佐藤花子",
    action: "名古屋工場のガスデータを承認しました",
    date: "4時間前",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "鈴木一郎",
    action: "大阪支社の燃料データを更新しました",
    date: "昨日",
    avatar: "/placeholder-user.jpg"
  },
  {
    name: "システム",
    action: "月次レポートが自動生成されました",
    date: "2日前"
  },
]

// Mock Dashboard Summary
export const mockDashboardSummary: DashboardSummary = {
  totalEmissions: 650,
  totalScope1: 300,
  totalScope2: 200,
  totalScope3: 150,
  changeFromLastMonth: 2.5,
  pendingApprovals: 3,
  recentActivities: mockRecentActivities
}

// Helper function to generate mock data for a specific date range
export function generateMockESGData(
  startDate: Date,
  endDate: Date,
  count: number = 10
): ESGDataEntry[] {
  const locations = mockLocations.map(l => l.name)
  const departments: Department[] = ["admin", "sales", "production", "rd", "it"]
  const activityTypes: ActivityType[] = ["electricity", "gas", "fuel", "water", "waste"]
  const statuses: ESGStatus[] = ["pending", "approved", "rejected"]
  const submitters = mockUsers.map(u => u.name)
  
  const entries: ESGDataEntry[] = []
  
  for (let i = 0; i < count; i++) {
    const date = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    )
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    const factor = mockEmissionFactors.find(ef => ef.activityType === activityType)?.factor || 0.001
    const amount = Math.floor(Math.random() * 10000) + 100
    
    entries.push({
      id: `gen-${i + 1}`,
      date: date.toISOString().split('T')[0],
      location: locations[Math.floor(Math.random() * locations.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      activityType,
      activityAmount: amount,
      emissionFactor: factor,
      emission: amount * factor,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      submitter: submitters[Math.floor(Math.random() * submitters.length)],
      submittedAt: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  
  return entries
}