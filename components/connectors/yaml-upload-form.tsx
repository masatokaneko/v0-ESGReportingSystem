"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode } from "lucide-react"

const yamlFormSchema = z.object({
  yaml_content: z.string().min(1, {
    message: "YAML設定を入力してください。",
  }),
  connection_name: z.string().min(1, {
    message: "接続名を入力してください。",
  }),
})

type YamlFormValues = z.infer<typeof yamlFormSchema>

export function YamlUploadForm() {
  const [agentToken, setAgentToken] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<YamlFormValues>({
    resolver: zodResolver(yamlFormSchema),
    defaultValues: {
      yaml_content: `connection_name: "SCADA_FuelFlow"
connection_type: opcua
endpoint_url: "opc.tcp://10.0.0.15:4840"
node_ids:
  - "ns=2;s=Fuel_Flow_Rate"
  - "ns=2;s=Boiler_MW"
schedule: "rate(5 minutes)"
parser:
  mapping:
    Fuel_Flow_Rate: { kpi_category: "Fuel", kpi_name: "FuelFlow", unit: "kg/h" }
    Boiler_MW:      { kpi_category: "Energy", kpi_name: "GeneratedMW", unit: "MW" }`,
      connection_name: "",
    },
  })

  function onSubmit(data: YamlFormValues) {
    setIsSubmitting(true)

    // 実際の実装ではAPIにYAMLを送信し、トークンを取得します
    setTimeout(() => {
      setIsSubmitting(false)
      setAgentToken("AGENT_TOKEN_12345678")
      toast({
        title: "YAML設定が登録されました",
        description: "DataGatewayAgentで使用するトークンが生成されました。",
      })
    }, 1500)
  }

  function copyTokenToClipboard() {
    if (agentToken) {
      navigator.clipboard.writeText(agentToken)
      toast({
        title: "トークンをコピーしました",
        description: "クリップボードにエージェントトークンがコピーされました。",
      })
    }
  }

  return (
    <div className="space-y-6">
      {!agentToken ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="connection_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>接続名</FormLabel>
                  <FormControl>
                    <Input placeholder="例: SCADA_FuelFlow" {...field} />
                  </FormControl>
                  <FormDescription>この接続を識別するための名前を入力してください。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yaml_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YAML設定</FormLabel>
                  <FormControl>
                    <Textarea placeholder="YAML設定を入力してください" className="font-mono h-[400px]" {...field} />
                  </FormControl>
                  <FormDescription>DataGatewayAgentの設定をYAML形式で入力してください。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  処理中...
                </>
              ) : (
                "YAML設定を登録"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">YAML設定が登録されました</h3>
            <p className="text-sm text-muted-foreground mt-1">
              以下のエージェントトークンをDataGatewayAgentの設定に使用してください。
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <QrCode className="h-32 w-32" />
                </div>
                <div className="text-center">
                  <p className="font-mono bg-muted p-2 rounded text-sm">{agentToken}</p>
                  <Button variant="outline" className="mt-2" onClick={copyTokenToClipboard}>
                    トークンをコピー
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setAgentToken(null)}>
              別のYAML設定を登録
            </Button>
            <Button>エージェント設定に戻る</Button>
          </div>
        </div>
      )}
    </div>
  )
}
