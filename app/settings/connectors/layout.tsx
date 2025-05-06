import type React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function ConnectorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="container mx-auto py-4 px-4">
        <Tabs defaultValue="cloud" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="cloud" asChild>
              <Link href="/settings/connectors/cloud">クラウドSaaS</Link>
            </TabsTrigger>
            <TabsTrigger value="agent" asChild>
              <Link href="/settings/connectors/agent">オンプレミスエージェント</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  )
}
