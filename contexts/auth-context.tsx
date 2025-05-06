"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { mockAuth } from "@/lib/auth/mock"

type User = {
  id: string
  email: string
  full_name: string
  role: string
}

type Session = {
  user: User
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

  useEffect(() => {
    // セッションの初期化
    const initializeSession = async () => {
      try {
        const { session } = await mockAuth.getSession()
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
    const subscription = mockAuth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { user, error } = await mockAuth.signIn(email, password)

      if (user) {
        setUser(user)
        setSession({
          user,
          expires_at: Date.now() + 3600000,
        })
      }

      return { error }
    } catch (err) {
      console.error("Error signing in:", err)
      return { error: { message: "ログイン処理中にエラーが発生しました。" } }
    }
  }

  const signOut = async () => {
    try {
      await mockAuth.signOut()
      setUser(null)
      setSession(null)
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
