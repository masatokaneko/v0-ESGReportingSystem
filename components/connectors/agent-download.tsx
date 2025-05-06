"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"

export function AgentDownload() {
  const [os, setOs] = useState<string>("windows")

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>DataGatewayAgentのダウンロード</CardTitle>
        <CardDescription>
          オンプレミスシステムに接続するためのデータゲートウェイエージェントをダウンロードします
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">OSを選択</label>
            <Select value={os} onValueChange={setOs}>
              <SelectTrigger>
                <SelectValue placeholder="OSを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="linux">Linux</SelectItem>
                <SelectItem value="macos">macOS</SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            エージェントをダウンロード
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
