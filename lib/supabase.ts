import { mockDB } from "./mock-data-store"

// クライアントサイド用のモックSupabaseクライアント
export const createClientSupabaseClient = () => {
  // モックデータストアを使用するクライアントを返す
  return {
    from: (table: string) => {
      return {
        select: (columns = "*") => {
          // テーブルに応じたモックデータを返す
          const mockData = mockDB.getAll(table as any)

          return {
            eq: (column: string, value: any) => {
              const filteredData = mockData.filter((item: any) => item[column] === value)
              return {
                single: () => {
                  return { data: filteredData[0] || null, error: null }
                },
                limit: (limit: number) => {
                  return { data: filteredData.slice(0, limit), error: null }
                },
              }
            },
            order: (column: string, { ascending = true } = {}) => {
              // 並べ替えはモックでは実装しない
              return { data: mockData, error: null }
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
              const updatedItem = mockDB.update(table as any, "id", value, data)
              return { data: updatedItem, error: null }
            },
          }
        },
        delete: () => {
          return {
            eq: (column: string, value: any) => {
              mockDB.delete(table, "id", value)
              return { data: null, error: null }
            },
          }
        },
      }
    },
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const user = mockDB.getOne("users", "email", email)
        if (user && user.password === password) {
          return { data: { user }, error: null }
        }
        return { data: { user: null }, error: { message: "Invalid login credentials" } }
      },
      updateUser: async ({ password }: { password: string }) => {
        // パスワード更新のモック
        return { data: {}, error: null }
      },
      signOut: async () => {
        return { error: null }
      },
      admin: {
        createUser: async (userData: any) => {
          const newUser = mockDB.insert("users", {
            email: userData.email,
            password: userData.password || "password",
            full_name: userData.user_metadata?.full_name || "",
            role: "user",
          })
          return { data: { user: newUser }, error: null }
        },
        deleteUser: async (userId: string) => {
          mockDB.delete("users", "id", userId)
          return { error: null }
        },
      },
    },
  }
}
