"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Copy, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function YamlUpload() {
  const [yamlContent, setYamlContent] = useState<string>("")
  const [agentToken, setAgentToken] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const handleUpload = () => {
    // 実際の実装ではAPIにYAMLを送信し、トークンを取得
    const mockToken = "agent_" + Math.random().toString(36).substring(2, 15)
    setAgentToken(mockToken)
    toast({
      title: "YAMLが正常に登録されました",
      description: "エージェントトークンが生成されました。",
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(agentToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>YAMLコネクタ設定のアップロード</CardTitle>
        <CardDescription>
          オンプレミスエージェント用のYAML設定ファイルをアップロードして接続を設定します
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">YAML設定</label>
            <Textarea
              placeholder="YAML設定を入力またはペーストしてください"
              className="font-mono h-64"
              value={yamlContent}
              onChange={(e) => setYamlContent(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              例: connection_name: "SCADA_FuelFlow", connection_type: opcua, endpoint_url: "opc.tcp://10.0.0.15:4840"...
            </p>
          </div>

          {!agentToken ? (
            <Button className="w-full" onClick={handleUpload} disabled={!yamlContent}>
              <Upload className="mr-2 h-4 w-4" />
              YAMLをアップロード
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">エージェントトークン</label>
                <div className="flex">
                  <Input value={agentToken} readOnly className="font-mono" />
                  <Button variant="outline" className="ml-2" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  このトークンをエージェント設定に追加して、システムに接続してください。
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
