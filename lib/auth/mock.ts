// モックユーザーデータ
export const mockUsers = [
  {
    id: "00000000-0000-0000-0000-000000000000",
    email: "admin@example.com",
    password: "password",
    full_name: "管理者ユーザー",
    role: "admin",
    department_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "user@example.com",
    password: "password",
    full_name: "一般ユーザー",
    role: "user",
    department_id: null,
    created_at: new Date().toISOString(),
  },
]

// モックデータストア
export const mockDataStore = {
  users: [...mockUsers],
  locations: [],
  departments: [],
  emission_factors: [],
  data_entries: [],
}

// セッション管理
let currentSession: {
  user: (typeof mockUsers)[0] | null
  expires_at: number
} | null = null

// 認証関連の関数
export const mockAuth = {
  // セッション取得
  getSession: async () => {
    // クッキーからセッション情報を取得
    const sessionCookie = document.cookie.split("; ").find((row) => row.startsWith("mock-auth-session="))

    if (sessionCookie) {
      const userEmail = sessionCookie.split("=")[1]
      const user = mockUsers.find((u) => u.email === userEmail)

      if (user) {
        currentSession = {
          user: { ...user },
          expires_at: Date.now() + 3600000,
        }
        return { session: currentSession, error: null }
      }
    }

    return { session: null, error: null }
  },

  // ログイン
  signIn: async (email: string, password: string) => {
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      // セッション情報をクッキーに保存
      document.cookie = `mock-auth-session=${user.email}; path=/; max-age=${60 * 60 * 24 * 7}`
      document.cookie = `mock-user-role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}`

      currentSession = {
        user: { ...user },
        expires_at: Date.now() + 3600000,
      }

      return { user: { ...user }, error: null }
    }

    return { user: null, error: { message: "メールアドレスまたはパスワードが正しくありません。" } }
  },

  // ログアウト
  signOut: async () => {
    // クッキーを削除
    document.cookie = "mock-auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "mock-user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    currentSession = null
    return { error: null }
  },

  // 認証状態変更監視
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // 初期状態を通知
    callback("INITIAL_SESSION", currentSession)

    // 実際のイベントリスナーは実装しない（モック用）
    return {
      unsubscribe: () => {},
    }
  },
}

// データアクセス関連の関数
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
}
