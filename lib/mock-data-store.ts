export const mockDataStore = {
  getSummaryByScope: () => {
    return {
      scope1: 15000,
      scope2: 7500,
      scope3: 30000,
      total: 52500,
    }
  },
  getEmissionsByCategory: () => {
    return [
      { name: "電気", value: 20000 },
      { name: "ガス", value: 10000 },
      { name: "出張", value: 15000 },
      { name: "その他", value: 7500 },
    ]
  },
  getEmissionsByLocation: () => {
    return [
      { id: "location1", name: "東京本社", scope1: 5000, scope2: 2500, scope3: 10000, total: 17500 },
      { id: "location2", name: "大阪支店", scope1: 3000, scope2: 1500, scope3: 6000, total: 10500 },
      { id: "location3", name: "福岡営業所", scope1: 2000, scope2: 1000, scope3: 4000, total: 7000 },
    ]
  },
  getEmissionsByDepartment: () => {
    return [
      { id: "department1", name: "人事部", scope1: 1000, scope2: 500, scope3: 2000, total: 3500 },
      { id: "department2", name: "経理部", scope1: 800, scope2: 400, scope3: 1600, total: 2800 },
      { id: "department3", name: "営業部", scope1: 3200, scope2: 1600, scope3: 6400, total: 11200 },
    ]
  },
  getEmissionsTrend: () => {
    const startDate = new Date("2023-01-01")
    const trendData = []
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate)
      date.setMonth(startDate.getMonth() + i)
      const dateString = date.toISOString().slice(0, 7) // YYYY-MM format
      trendData.push({
        date: dateString,
        scope1: Math.floor(Math.random() * 2000) + 500,
        scope2: Math.floor(Math.random() * 1000) + 250,
        scope3: Math.floor(Math.random() * 3000) + 750,
        total: 0,
      })
      trendData[i].total = trendData[i].scope1 + trendData[i].scope2 + trendData[i].scope3
    }
    return trendData
  },
}
