import type React from "react"
import { Providers } from "./providers"
import { Sidebar } from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata = {
  title: "ESGレポーティングシステム",
  description: "企業のESG情報を効率的に収集・分析・レポーティングするためのシステム",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1">{children}</main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
