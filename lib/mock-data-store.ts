// モックユーザーデータ
export const mockUsers = [
  {
    id: "00000000-0000-0000-0000-000000000000",
    email: "admin@example.com",
    password: "password",
    full_name: "管理者ユーザー",
    role: "admin",
    department_id: "dept-001",
    created_at: new Date().toISOString(),
  },
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "user@example.com",
    password: "password",
    full_name: "一般ユーザー",
    role: "user",
    department_id: "dept-002",
    created_at: new Date().toISOString(),
  },
]

// モック拠点データ
export const mockLocations = [
  {
    id: "loc-001",
    name: "東京本社",
    address: "東京都千代田区1-1-1",
    country: "日本",
    region: "アジア",
    created_at: new Date().toISOString(),
  },
  {
    id: "loc-002",
    name: "大阪支社",
    address: "大阪府大阪市中央区2-2-2",
    country: "日本",
    region: "アジア",
    created_at: new Date().toISOString(),
  },
]

// モック部門データ
export const mockDepartments = [
  {
    id: "dept-001",
    name: "営業部",
    description: "営業活動を担当",
    location_id: "loc-001",
    created_at: new Date().toISOString(),
  },
  {
    id: "dept-002",
    name: "管理部",
    description: "総務・人事を担当",
    location_id: "loc-001",
    created_at: new Date().toISOString(),
  },
  {
    id: "dept-003",
    name: "開発部",
    description: "製品開発を担当",
    location_id: "loc-002",
    created_at: new Date().toISOString(),
  },
]

// モック排出係数データ
export const mockEmissionFactors = [
  {
    id: "ef-001",
    name: "電力（東京電力）",
    description: "東京電力の電力使用に関する排出係数",
    category: "電力",
    scope: "Scope2",
    unit: "kg-CO2e/kWh",
    value: 0.000496,
    source: "環境省",
    valid_from: "2022-01-01",
    valid_until: null,
    region: "日本",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "ef-002",
    name: "ガソリン",
    description: "ガソリン使用に関する排出係数",
    category: "燃料",
    scope: "Scope1",
    unit: "kg-CO2e/L",
    value: 2.32,
    source: "環境省",
    valid_from: "2022-01-01",
    valid_until: null,
    region: "日本",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "ef-003",
    name: "出張（飛行機）",
    description: "飛行機による出張の排出係数",
    category: "輸送",
    scope: "Scope3",
    unit: "kg-CO2e/km",
    value: 0.15,
    source: "環境省",
    valid_from: "2022-01-01",
    valid_until: null,
    region: "日本",
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

// モックデータエントリ
export const mockDataEntries = [
  {
    id: "entry-001",
    user_id: "00000000-0000-0000-0000-000000000000",
    location_id: "loc-001",
    department_id: "dept-001",
    emission_factor_id: "ef-001",
    activity_date: "2023-01-15",
    activity_data: 1000,
    emissions: 0.496,
    notes: "1月の電力使用量",
    status: "approved",
    created_at: "2023-01-20T10:00:00Z",
    updated_at: "2023-01-21T15:30:00Z",
  },
  {
    id: "entry-002",
    user_id: "11111111-1111-1111-1111-111111111111",
    location_id: "loc-001",
    department_id: "dept-002",
    emission_factor_id: "ef-002",
    activity_date: "2023-02-10",
    activity_data: 50,
    emissions: 116,
    notes: "2月のガソリン使用量",
    status: "pending",
    created_at: "2023-02-15T09:20:00Z",
    updated_at: "2023-02-15T09:20:00Z",
  },
  {
    id: "entry-003",
    user_id: "00000000-0000-0000-0000-000000000000",
    location_id: "loc-002",
    department_id: "dept-003",
    emission_factor_id: "ef-003",
    activity_date: "2023-03-05",
    activity_data: 1000,
    emissions: 150,
    notes: "3月の出張距離",
    status: "rejected",
    rejection_reason: "距離の計算に誤りがあります",
    created_at: "2023-03-10T14:15:00Z",
    updated_at: "2023-03-11T11:45:00Z",
  },
]

// モックデータストア
export const mockDataStore = {
  users: [...mockUsers],
  locations: [...mockLocations],
  departments: [...mockDepartments],
  emission_factors: [...mockEmissionFactors],
  data_entries: [...mockDataEntries],
}

// データアクセス関数
export const mockDB = {
  // データ取得
  getAll: (table: keyof typeof mockDataStore) => {
    return [...mockDataStore[table]]
  },

  // 条件付きデータ取得
  getBy: (table: keyof typeof mockDataStore, field: string, value: any) => {
    const items = mockDataStore[table] as any[]
    return items.filter((item) => item[field] === value)
  },

  // 単一データ取得
  getOne: (table: keyof typeof mockDataStore, field: string, value: any) => {
    const items = mockDataStore[table] as any[]
    return items.find((item) => item[field] === value) || null
  },

  // データ追加
  insert: (table: keyof typeof mockDataStore, data: any) => {
    const newItem = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...data,
    }
    ;(mockDataStore[table] as any[]).push(newItem)
    return newItem
  },

  // データ更新
  update: (table: keyof typeof mockDataStore, field: string, value: any, data: any) => {
    const items = mockDataStore[table] as any[]
    const index = items.findIndex((item) => item[field] === value)

    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...data,
        updated_at: new Date().toISOString(),
      }
      return items[index]
    }

    return null
  },

  // データ削除
  delete: (table: keyof typeof mockDataStore, field: string, value: any) => {
    const items = mockDataStore[table] as any[]
    const index = items.findIndex((item) => item[field] === value)

    if (index !== -1) {
      const deleted = items[index]
      items.splice(index, 1)
      return deleted
    }

    return null
  },

  // 結合クエリ
  getJoined: (table: keyof typeof mockDataStore, joinConfig: { [key: string]: any } = {}) => {
    const items = mockDataStore[table] as any[]

    return items.map((item) => {
      const result = { ...item }

      // 各結合フィールドを処理
      Object.entries(joinConfig).forEach(([field, config]) => {
        const foreignTable = config.table
        const foreignKey = config.key
        const localKey = config.localKey || "id"

        if (item[foreignKey]) {
          const foreignItem = mockDB.getOne(foreignTable as keyof typeof mockDataStore, localKey, item[foreignKey])
          if (foreignItem) {
            result[field] = foreignItem
          }
        }
      })

      return result
    })
  },

  // ダッシュボード用のサマリーデータ
  getDashboardSummary: (startDate: string, endDate: string) => {
    // 日付範囲内のデータエントリをフィルタリング
    const entries = mockDataStore.data_entries.filter((entry) => {
      const entryDate = new Date(entry.activity_date)
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate) && entry.status === "approved"
    })

    // スコープ別の排出量を計算
    const scope1Entries = entries.filter((entry) => {
      const factor = mockDB.getOne("emission_factors", "id", entry.emission_factor_id)
      return factor && factor.scope === "Scope1"
    })

    const scope2Entries = entries.filter((entry) => {
      const factor = mockDB.getOne("emission_factors", "id", entry.emission_factor_id)
      return factor && factor.scope === "Scope2"
    })

    const scope3Entries = entries.filter((entry) => {
      const factor = mockDB.getOne("emission_factors", "id", entry.emission_factor_id)
      return factor && factor.scope === "Scope3"
    })

    const scope1Total = scope1Entries.reduce((sum, entry) => sum + entry.emissions, 0)
    const scope2Total = scope2Entries.reduce((sum, entry) => sum + entry.emissions, 0)
    const scope3Total = scope3Entries.reduce((sum, entry) => sum + entry.emissions, 0)
    const total = scope1Total + scope2Total + scope3Total

    // 前期比較用のダミーデータ
    const previousPeriod = {
      scope1: scope1Total * (0.9 + Math.random() * 0.2),
      scope2: scope2Total * (0.9 + Math.random() * 0.2),
      scope3: scope3Total * (0.9 + Math.random() * 0.2),
    }
    previousPeriod.total = previousPeriod.scope1 + previousPeriod.scope2 + previousPeriod.scope3

    // 排出源別データ
    const bySource = []
    const categories = [...new Set(mockDataStore.emission_factors.map((ef) => ef.category))]

    for (const category of categories) {
      const categoryFactors = mockDataStore.emission_factors.filter((ef) => ef.category === category)

      for (const factor of categoryFactors) {
        const categoryEntries = entries.filter((entry) => entry.emission_factor_id === factor.id)
        const emissions = categoryEntries.reduce((sum, entry) => sum + entry.emissions, 0)

        if (emissions > 0) {
          bySource.push({
            scope: factor.scope,
            category: factor.category,
            emissions,
          })
        }
      }
    }

    // 月別トレンドデータ
    const trendData = []
    const months = []
    const startMonth = new Date(startDate)
    const endMonth = new Date(endDate)

    for (let d = new Date(startMonth); d <= endMonth; d.setMonth(d.getMonth() + 1)) {
      months.push(new Date(d).toISOString().split("T")[0].substring(0, 7) + "-01")
    }

    for (const month of months) {
      const monthStart = new Date(month)
      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      monthEnd.setDate(monthEnd.getDate() - 1)

      const monthEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.activity_date)
        return entryDate >= monthStart && entryDate <= monthEnd
      })

      const monthScope1 = monthEntries
        .filter((entry) => {
          const factor = mockDB.getOne("emission_factors", "id", entry.emission_factor_id)
          return factor && factor.scope === "Scope1"
        })
        .reduce((sum, entry) => sum + entry.emissions, 0)

      const monthScope2 = monthEntries
        .filter((entry) => {
          const factor = mockDB.getOne("emission_factors", "id", entry.emission_factor_id)
          return factor && factor.scope === "Scope2"
        })
        .reduce((sum, entry) => sum + entry.emissions, 0)

      const monthScope3 = monthEntries
        .filter((entry) => {
          const factor = mockDB.getOne("emission_factors", "id", entry.emission_factor_id)
          return factor && factor.scope === "Scope3"
        })
        .reduce((sum, entry) => sum + entry.emissions, 0)

      trendData.push({ scope: "Scope1", month_date: month, emissions: monthScope1 })
      trendData.push({ scope: "Scope2", month_date: month, emissions: monthScope2 })
      trendData.push({ scope: "Scope3", month_date: month, emissions: monthScope3 })
    }

    // 最近のアクティビティ
    const recentActivity = mockDataStore.data_entries
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map((entry) => {
        const user = mockDB.getOne("users", "id", entry.user_id)
        const location = mockDB.getOne("locations", "id", entry.location_id)
        const department = mockDB.getOne("departments", "id", entry.department_id)
        const emissionFactor = mockDB.getOne("emission_factors", "id", entry.emission_factor_id)

        return {
          ...entry,
          user_email: user?.email || "-",
          location_name: location?.name || "-",
          department_name: department?.name || "-",
          emission_factor_name: emissionFactor?.name || "-",
          emission_factor_unit: emissionFactor?.unit || "-",
        }
      })

    return {
      overview: {
        scope1: scope1Total,
        scope2: scope2Total,
        scope3: scope3Total,
        total,
        previousPeriod,
      },
      bySource,
      trend: {
        monthly: trendData,
        quarterly: [],
        yearly: [],
      },
      recentActivity,
    }
  },
}
