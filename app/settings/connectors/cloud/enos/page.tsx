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
  accessKey: z.string().min(1, { message: "アクセスキーを入力してください" }),
  secretKey: z.string().min(1, { message: "シークレットキーを入力してください" }),
  orgId: z.string().min(1, { message: "組織IDを入力してください" }),
  refreshRate: z.string(),
  assetIds: z.string().optional(),
})

const dataItems = [
  { id: "powerGeneration", name: "発電量データ", description: "発電設備からの発電量データ", available: true },
  { id: "fuelMix", name: "燃料構成", description: "発電に使用される燃料の構成比率", available: true },
  { id: "energyConsumption", name: "エネルギー消費量", description: "設備・施設のエネルギー消費量", available: true },
  { id: "carbonEmissions", name: "炭素排出量", description: "エネルギー使用に伴う炭素排出量", available: true },
  {
    id: "renewablePercentage",
    name: "再生可能エネルギー比率",
    description: "全体に占める再生可能エネルギーの比率",
    available: false,
  },
]

export default function EnOSPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>(["powerGeneration", "fuelMix"])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessKey: "",
      secretKey: "",
      orgId: "",
      refreshRate: "1h",
      assetIds: "",
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
    setSelectedItems(["powerGeneration", "fuelMix"])
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/settings/connectors/cloud" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">EnOS 連携設定</h1>
        <Badge className="ml-4 bg-emerald-600">エネルギー管理</Badge>
      </div>

      <div className="grid gap-6">
        {isConnected ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">接続済み</AlertTitle>
            <AlertDescription className="text-green-700">
              EnOSとの接続が確立されています。データの同期は設定された間隔で行われます。
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
                    <CardTitle>EnOS API 接続</CardTitle>
                    <CardDescription>EnOS APIに接続するための認証情報を入力してください。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="accessKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>アクセスキー</FormLabel>
                              <FormControl>
                                <Input placeholder="ak_xxxxx" {...field} disabled={isConnected} />
                              </FormControl>
                              <FormDescription>EnOS開発者ポータルで取得したアクセスキー</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="secretKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>シークレットキー</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••••••••••"
                                  {...field}
                                  disabled={isConnected}
                                />
                              </FormControl>
                              <FormDescription>EnOS開発者ポータルで取得したシークレットキー</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="orgId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>組織ID</FormLabel>
                              <FormControl>
                                <Input placeholder="org_xxxxx" {...field} disabled={isConnected} />
                              </FormControl>
                              <FormDescription>EnOSアカウントに関連付けられた組織ID</FormDescription>
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
                              <FormDescription>EnOSからデータを取得する頻度</FormDescription>
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
                    <CardDescription>EnOSから取得するデータ項目を選択してください。</CardDescription>
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
                    <CardDescription>EnOSとの連携に関する詳細設定を行います。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="space-y-4">
                        <FormField
                          control={form.control}
                          name="assetIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>アセットID（カンマ区切り）</FormLabel>
                              <FormControl>
                                <Input placeholder="asset1,asset2,asset3" {...field} disabled={!isConnected} />
                              </FormControl>
                              <FormDescription>
                                特定のアセットのみデータを取得する場合は、アセットIDをカンマ区切りで入力してください。空白の場合はすべてのアセットが対象になります。
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
                <CardTitle>EnOS</CardTitle>
                <CardDescription>エネルギーIoTプラットフォーム</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md overflow-hidden">
                    <img src="/placeholder.svg?key=u439e" alt="EnOS Platform" className="w-full object-cover" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">主な機能</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        発電設備のリアルタイムモニタリング
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        エネルギー消費の分析と最適化
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        再生可能エネルギーの統合管理
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        炭素排出量の計算と報告
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">接続情報</h3>
                    <div className="text-sm space-y-1">
                      <p className="flex items-center">
                        <Info className="h-4 w-4 mr-2 text-blue-600" />
                        API Version: v3.0
                      </p>
                      <p className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 text-blue-600" />
                        更新頻度: 最短15分ごと
                      </p>
                      <p className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-blue-600" />
                        認証: API Key
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href="https://www.envision-group.com/en/product/enos.html"
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
