import { mockAuth, mockDB } from "./auth/mock"

// サーバーサイド用のモックSupabaseクライアント
export const createServerSupabaseClient = () => {
  // モックデータベースとモック認証を組み合わせたクライアントを返す
  return {
    auth: mockAuth,
    from: (table: string) => {
      return {
        select: (columns = "*") => {
          return {
            eq: (column: string, value: any) => {
              return {
                single: () => {
                  const item = mockDB.getOne(table as any, column, value)
                  return { data: item, error: null }
                },
                limit: (limit: number) => {
                  const items = mockDB.getBy(table as any, column, value).slice(0, limit)
                  return { data: items, error: null }
                },
              }
            },
            order: (column: string, { ascending = true } = {}) => {
              const items = mockDB.getAll(table as any)
              return { data: items, error: null }
            },
          }
        },
        insert: (data: any) => {
          const newItem = mockDB.insert(table as any, data)
          return { data: newItem, error: null }
        },
        update: (data: any) => {
          return {
            eq: (column: string, value: any) => {
              const updatedItem = mockDB.update(table as any, column, value, data)
              return { data: updatedItem, error: null }
            },
          }
        },
        delete: () => {
          return {
            eq: (column: string, value: any) => {
              const deletedItem = mockDB.delete(table as any, column, value)
              return { data: deletedItem, error: null }
            },
          }
        },
      }
    },
    rpc: (functionName: string, params: any) => {
      // モックRPC関数の実装
      // ダッシュボードデータなどを返す
      if (functionName === "get_emissions_overview") {
        return {
          data: [
            {
              scope1: 1200,
              scope2: 3500,
              scope3: 5800,
              total: 10500,
              previousPeriod: {
                scope1: 1300,
                scope2: 3200,
                scope3: 6000,
                total: 10500,
              },
            },
          ],
          error: null,
        }
      }

      if (functionName === "get_emissions_by_source") {
        return {
          data: [
            { scope: "Scope1", category: "燃料", emissions: 800 },
            { scope: "Scope1", category: "輸送", emissions: 400 },
            { scope: "Scope2", category: "電力", emissions: 3500 },
            { scope: "Scope3", category: "出張", emissions: 1200 },
            { scope: "Scope3", category: "通勤", emissions: 800 },
            { scope: "Scope3", category: "廃棄物", emissions: 1800 },
            { scope: "Scope3", category: "購入した製品", emissions: 2000 },
          ],
          error: null,
        }
      }

      if (functionName === "get_emissions_trend") {
        const months = ["2023-01-01", "2023-02-01", "2023-03-01", "2023-04-01", "2023-05-01", "2023-06-01"]
        const data = []

        for (const month of months) {
          data.push({ scope: "Scope1", month_date: month, emissions: Math.floor(Math.random() * 500) + 800 })
          data.push({ scope: "Scope2", month_date: month, emissions: Math.floor(Math.random() * 500) + 2800 })
          data.push({ scope: "Scope3", month_date: month, emissions: Math.floor(Math.random() * 1000) + 4500 })
        }

        return { data, error: null }
      }

      return { data: null, error: null }
    },
  }
}

// クライアントサイド用のモックSupabaseクライアント（シングルトンパターン）
let clientSupabaseClient: ReturnType<typeof createServerSupabaseClient> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  clientSupabaseClient = createServerSupabaseClient()
  return clientSupabaseClient
}
