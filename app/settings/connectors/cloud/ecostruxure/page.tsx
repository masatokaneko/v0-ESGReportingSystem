"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Info, RefreshCw, Shield } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  clientId: z.string().min(1, { message: "クライアントIDを入力してください" }),
  clientSecret: z.string().min(1, { message: "クライアントシークレットを入力してください" }),
  tenantId: z.string().min(1, { message: "テナントIDを入力してください" }),
  refreshRate: z.string(),
  siteIds: z.string().optional(),
})

const dataItems = [
  {
    id: "siteEnergy",
    name: "サイトエネルギー使用量",
    description: "各サイトのエネルギー使用量データ",
    available: true,
  },
  { id: "ghgFactor", name: "GHG排出係数", description: "地域・エネルギー源ごとの排出係数", available: true },
  { id: "energyCost", name: "エネルギーコスト", description: "エネルギー使用に関連するコスト情報", available: true },
  { id: "peakDemand", name: "ピーク需要", description: "電力需要のピーク値", available: true },
  { id: "renewableEnergy", name: "再生可能エネルギー", description: "再生可能エネルギーの生成と使用", available: true },
]

export default function EcoStruxurePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>(["siteEnergy", "ghgFactor"])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      clientSecret: "",
      tenantId: "",
      refreshRate: "1h",
      siteIds: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log(values)

    // 接続シミュレーション
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
    }, 1500)
  }

  function handleItemToggle(id: string) {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function handleDisconnect() {
    setIsConnected(false)
    form.reset()
    setSelectedItems(["siteEnergy", "ghgFactor"])
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/settings/connectors/cloud" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">EcoStruxure Resource Advisor 連携設定</h1>
        <Badge className="ml-4 bg-emerald-600">エネルギー管理</Badge>
      </div>

      <div className="grid gap-6">
        {isConnected ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">接続済み</AlertTitle>
            <AlertDescription className="text-green-700">
              EcoStruxure Resource Advisorとの接続が確立されています。データの同期は設定された間隔で行われます。
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="connection" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connection">接続設定</TabsTrigger>
                <TabsTrigger value="data">データ項目</TabsTrigger>
                <TabsTrigger value="advanced">詳細設定</TabsTrigger>
              </TabsList>

              <TabsContent value="connection">
                <Card>
                  <CardHeader>
                    <CardTitle>EcoStruxure Resource Advisor API 接続</CardTitle>
                    <CardDescription>
                      EcoStruxure Resource Advisor APIに接続するための認証情報を入力してください。
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="clientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>クライアントID</FormLabel>
                              <FormControl>
                                <Input placeholder="client_id_xxxxx" {...field} disabled={isConnected} />
                              </FormControl>
                              <FormDescription>
                                EcoStruxure Resource Advisor開発者ポータルで取得したクライアントID
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="clientSecret"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>クライアントシークレット</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••••••••••"
                                  {...field}
                                  disabled={isConnected}
                                />
                              </FormControl>
                              <FormDescription>
                                EcoStruxure Resource Advisor開発者ポータルで取得したクライアントシークレット
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tenantId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>テナントID</FormLabel>
                              <FormControl>
                                <Input placeholder="tenant_xxxxx" {...field} disabled={isConnected} />
                              </FormControl>
                              <FormDescription>
                                EcoStruxure Resource Advisorアカウントに関連付けられたテナントID
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="refreshRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>データ更新頻度</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isConnected}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="更新頻度を選択" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="15m">15分ごと</SelectItem>
                                  <SelectItem value="30m">30分ごと</SelectItem>
                                  <SelectItem value="1h">1時間ごと</SelectItem>
                                  <SelectItem value="6h">6時間ごと</SelectItem>
                                  <SelectItem value="12h">12時間ごと</SelectItem>
                                  <SelectItem value="24h">24時間ごと</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>EcoStruxure Resource Advisorからデータを取得する頻度</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {!isConnected ? (
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                接続中...
                              </>
                            ) : (
                              "接続"
                            )}
                          </Button>
                        ) : (
                          <Button type="button" variant="destructive" className="w-full" onClick={handleDisconnect}>
                            接続解除
                          </Button>
                        )}
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data">
                <Card>
                  <CardHeader>
                    <CardTitle>取得データ項目</CardTitle>
                    <CardDescription>
                      EcoStruxure Resource Advisorから取得するデータ項目を選択してください。
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dataItems.map((item) => (
                        <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-md">
                          <Checkbox
                            id={item.id}
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleItemToggle(item.id)}
                            disabled={!item.available || !isConnected}
                          />
                          <div className="grid gap-1.5">
                            <label
                              htmlFor={item.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item.name}
                              {item.available ? (
                                <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">利用可能</Badge>
                              ) : (
                                <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-100">準備中</Badge>
                              )}
                            </label>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button disabled={!isConnected} className="w-full">
                      データ項目設定を保存
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>詳細設定</CardTitle>
                    <CardDescription>EcoStruxure Resource Advisorとの連携に関する詳細設定を行います。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="space-y-4">
                        <FormField
                          control={form.control}
                          name="siteIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>サイトID（カンマ区切り）</FormLabel>
                              <FormControl>
                                <Input placeholder="site1,site2,site3" {...field} disabled={!isConnected} />
                              </FormControl>
                              <FormDescription>
                                特定のサイトのみデータを取得する場合は、サイトIDをカンマ区切りで入力してください。空白の場合はすべてのサイトが対象になります。
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="historical" disabled={!isConnected} />
                            <label
                              htmlFor="historical"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              過去データの一括取得
                            </label>
                          </div>
                          <p className="text-sm text-gray-500">
                            過去12ヶ月分のデータを一括取得します（初回接続時のみ）
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="notifications" disabled={!isConnected} />
                            <label
                              htmlFor="notifications"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              データ取得エラー通知
                            </label>
                          </div>
                          <p className="text-sm text-gray-500">データ取得に失敗した場合にメール通知を送信します</p>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter>
                    <Button disabled={!isConnected} className="w-full">
                      詳細設定を保存
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>EcoStruxure Resource Advisor</CardTitle>
                <CardDescription>エネルギー管理・サステナビリティデータプラットフォーム</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md overflow-hidden">
                    <img
                      src="/placeholder.svg?key=jceqz"
                      alt="EcoStruxure Resource Advisor"
                      className="w-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">主な機能</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        エネルギー使用量の監視と分析
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        GHG排出量の計算と報告
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        サステナビリティ目標の進捗管理
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        エネルギーコスト分析
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">接続情報</h3>
                    <div className="text-sm space-y-1">
                      <p className="flex items-center">
                        <Info className="h-4 w-4 mr-2 text-blue-600" />
                        API Version: v2.0
                      </p>
                      <p className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 text-blue-600" />
                        更新頻度: 最短15分ごと
                      </p>
                      <p className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-blue-600" />
                        認証: OAuth 2.0
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href="https://www.se.com/ww/en/work/services/energy-and-sustainability/energy-and-sustainability-software/resource-advisor.jsp"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        公式サイトを開く
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
