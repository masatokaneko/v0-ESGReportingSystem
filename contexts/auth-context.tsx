"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { mockUsers } from "@/lib/supabase/mock"

type User = {
  id: string
  email: string
  user_metadata: {
    full_name: string
  }
}

type Session = {
  user: User
  access_token: string
  refresh_token: string
  expires_at: number
}

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    // セッションの初期化
    const initializeSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user || null)
      } catch (error) {
        console.error("Error initializing session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeSession()

    // 認証状態の変更を監視
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user || null)
        setIsLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error("Error setting up auth state change:", error)
      setIsLoading(false)
      return () => {}
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // モック認証のためのクッキー設定
      if (!error) {
        const user = mockUsers.find((u) => u.email === email)
        if (user) {
          document.cookie = `mock-auth-session=true; path=/; max-age=${60 * 60 * 24 * 7}`
          document.cookie = `mock-user-role=${user.email === "admin@example.com" ? "admin" : "user"}; path=/; max-age=${60 * 60 * 24 * 7}`
        }
      }

      return { error }
    } catch (error) {
      console.error("Error signing in:", error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()

      // モック認証のクッキーを削除
      document.cookie = "mock-auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "mock-user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
