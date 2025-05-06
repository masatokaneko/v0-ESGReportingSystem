// モックユーザーデータ
export const mockUsers = [
  {
    id: "00000000-0000-0000-0000-000000000000",
    email: "admin@example.com",
    password: "password",
    user_metadata: {
      full_name: "管理者ユーザー",
    },
  },
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "user@example.com",
    password: "password",
    user_metadata: {
      full_name: "一般ユーザー",
    },
  },
]

// モックユーザープロファイル
export const mockUserProfiles = [
  {
    id: "00000000-0000-0000-0000-000000000000",
    user_id: "00000000-0000-0000-0000-000000000000",
    email: "admin@example.com",
    full_name: "管理者ユーザー",
    role: "admin",
    department_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "11111111-1111-1111-1111-111111111111",
    user_id: "11111111-1111-1111-1111-111111111111",
    email: "user@example.com",
    full_name: "一般ユーザー",
    role: "user",
    department_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// モックSupabaseクライアント
export const createMockSupabaseClient = () => {
  let currentSession = null
  let currentUser = null

  return {
    auth: {
      getSession: async () => {
        return {
          data: { session: currentSession },
          error: null,
        }
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const user = mockUsers.find((u) => u.email === email && u.password === password)
        if (user) {
          currentUser = user
          currentSession = {
            user,
            access_token: "mock-token",
            refresh_token: "mock-refresh-token",
            expires_at: Date.now() + 3600000,
          }
          return { data: { user, session: currentSession }, error: null }
        }
        return { data: { user: null, session: null }, error: { message: "Invalid login credentials" } }
      },
      signOut: async () => {
        currentUser = null
        currentSession = null
        return { error: null }
      },
      onAuthStateChange: (callback: any) => {
        // 初期状態を通知
        callback("INITIAL_SESSION", currentSession)
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }
      },
    },
    from: (table: string) => {
      return {
        select: (columns = "*") => {
          return {
            eq: (column: string, value: any) => {
              return {
                single: () => {
                  if (table === "user_profiles") {
                    const profile = mockUserProfiles.find((p) => p[column as keyof typeof p] === value)
                    return { data: profile, error: null }
                  }
                  return { data: null, error: null }
                },
                limit: (limit: number) => {
                  if (table === "user_profiles") {
                    const profiles = mockUserProfiles
                      .filter((p) => p[column as keyof typeof p] === value)
                      .slice(0, limit)
                    return { data: profiles, error: null }
                  }
                  return { data: [], error: null }
                },
              }
            },
            order: (column: string, { ascending = true } = {}) => {
              if (table === "user_profiles") {
                return { data: [...mockUserProfiles], error: null }
              }
              return { data: [], error: null }
            },
          }
        },
        insert: (data: any) => {
          return { data, error: null }
        },
        update: (data: any) => {
          return {
            eq: (column: string, value: any) => {
              return { data, error: null }
            },
          }
        },
        delete: () => {
          return {
            eq: (column: string, value: any) => {
              return { data: null, error: null }
            },
          }
        },
      }
    },
  }
}
