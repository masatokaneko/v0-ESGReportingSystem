"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Settings } from "lucide-react"
import Link from "next/link"

export default function CloudConnectorsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/settings/connectors" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">クラウドコネクタ設定</h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="erp">ERP/会計</TabsTrigger>
          <TabsTrigger value="energy">エネルギー管理</TabsTrigger>
          <TabsTrigger value="hr">HR/安全管理</TabsTrigger>
          <TabsTrigger value="other">その他</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ERP/会計システム */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">SAP S/4HANA Cloud</CardTitle>
                <CardDescription>ERPシステム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-blue-600">ERP/会計</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=sap" alt="SAP S/4HANA Cloud" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  SAP S/4HANA Cloudから会計データ、購買データ、サプライチェーン情報などを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/sap" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Oracle Fusion ERP</CardTitle>
                <CardDescription>ERPシステム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-blue-600">ERP/会計</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=oracle" alt="Oracle Fusion ERP" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Oracle Fusion ERPから会計データ、購買データ、サプライチェーン情報などを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/oracle" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Microsoft Dynamics 365</CardTitle>
                <CardDescription>ERPシステム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-blue-600">ERP/会計</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img
                    src="/placeholder.svg?key=dynamics"
                    alt="Microsoft Dynamics 365"
                    className="h-16 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Microsoft Dynamics 365から会計データ、購買データ、サプライチェーン情報などを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/dynamics" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Salesforce</CardTitle>
                <CardDescription>CRMシステム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-blue-600">ERP/会計</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=salesforce" alt="Salesforce" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Salesforceから顧客データ、販売データ、製品情報などを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/salesforce" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Coupa</CardTitle>
                <CardDescription>調達管理システム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-blue-600">ERP/会計</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=coupa" alt="Coupa" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Coupaから調達データ、サプライヤー情報、支出データなどを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/coupa" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* エネルギー管理システム */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">EcoStruxure Resource Advisor</CardTitle>
                <CardDescription>エネルギー管理システム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-emerald-600">エネルギー管理</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img
                    src="/placeholder.svg?key=ecostruxure"
                    alt="EcoStruxure Resource Advisor"
                    className="h-16 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  EcoStruxure Resource
                  Advisorからエネルギー使用量、GHG排出量、エネルギーコストなどのデータを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/ecostruxure" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">EnOS</CardTitle>
                <CardDescription>エネルギーIoTプラットフォーム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-emerald-600">エネルギー管理</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=enos" alt="EnOS Platform" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  EnOSから発電量データ、エネルギー消費量、炭素排出量などのデータを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/enos" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* HR/安全管理システム */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Workday</CardTitle>
                <CardDescription>人事・財務管理システム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-purple-600">HR/安全管理</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=workday" alt="Workday" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Workdayから従業員データ、安全インシデント、出張データなどを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/workday" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">ServiceNow</CardTitle>
                <CardDescription>ITサービス管理システム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-purple-600">HR/安全管理</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=servicenow" alt="ServiceNow" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  ServiceNowからインシデント管理、資産管理、サービス管理データなどを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/servicenow" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* サステナビリティ */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Persefoni</CardTitle>
                <CardDescription>気候会計・排出量管理プラットフォーム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-teal-600">サステナビリティ</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=persefoni" alt="Persefoni" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Persefoniから排出係数、GHGインベントリ、活動データなどを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/persefoni" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* ドキュメント管理 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Google Drive</CardTitle>
                <CardDescription>ドキュメント管理システム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-orange-600">ドキュメント</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=googledrive" alt="Google Drive" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Google Driveからドキュメント、スプレッドシート、プレゼンテーションなどを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/google-drive" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* 新規コネクタ追加カード */}
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">新規コネクタ追加</CardTitle>
                <CardDescription>カスタムコネクタを設定</CardDescription>
              </CardHeader>
              <CardContent className="pb-3 flex items-center justify-center">
                <div className="h-32 flex items-center justify-center">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/new" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    新規追加
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="erp" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ERP/会計システムのカードのみ表示 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">SAP S/4HANA Cloud</CardTitle>
                <CardDescription>ERPシステム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-blue-600">ERP/会計</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=sap" alt="SAP S/4HANA Cloud" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  SAP S/4HANA Cloudから会計データ、購買データ、サプライチェーン情報などを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/sap" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Oracle Fusion ERP</CardTitle>
                <CardDescription>ERPシステム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-blue-600">ERP/会計</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=oracle" alt="Oracle Fusion ERP" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Oracle Fusion ERPから会計データ、購買データ、サプライチェーン情報などを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/oracle" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Microsoft Dynamics 365</CardTitle>
                <CardDescription>ERPシステム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-blue-600">ERP/会計</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img
                    src="/placeholder.svg?key=dynamics"
                    alt="Microsoft Dynamics 365"
                    className="h-16 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Microsoft Dynamics 365から会計データ、購買データ、サプライチェーン情報などを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/dynamics" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Salesforce</CardTitle>
                <CardDescription>CRMシステム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-blue-600">ERP/会計</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=salesforce" alt="Salesforce" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Salesforceから顧客データ、販売データ、製品情報などを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/salesforce" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Coupa</CardTitle>
                <CardDescription>調達管理システム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-blue-600">ERP/会計</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=coupa" alt="Coupa" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Coupaから調達データ、サプライヤー情報、支出データなどを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/coupa" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* エネルギー管理システムのカードのみ表示 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">EcoStruxure Resource Advisor</CardTitle>
                <CardDescription>エネルギー管理システム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-emerald-600">エネルギー管理</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img
                    src="/placeholder.svg?key=ecostruxure"
                    alt="EcoStruxure Resource Advisor"
                    className="h-16 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  EcoStruxure Resource
                  Advisorからエネルギー使用量、GHG排出量、エネルギーコストなどのデータを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/ecostruxure" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">EnOS</CardTitle>
                <CardDescription>エネルギーIoTプラットフォーム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-emerald-600">エネルギー管理</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=enos" alt="EnOS Platform" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  EnOSから発電量データ、エネルギー消費量、炭素排出量などのデータを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/enos" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hr" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* HR/安全管理システムのカードのみ表示 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Workday</CardTitle>
                <CardDescription>人事・財務管理システム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-purple-600">HR/安全管理</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=workday" alt="Workday" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Workdayから従業員データ、安全インシデント、出張データなどを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/workday" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">ServiceNow</CardTitle>
                <CardDescription>ITサービス管理システム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-purple-600">HR/安全管理</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=servicenow" alt="ServiceNow" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  ServiceNowからインシデント管理、資産管理、サービス管理データなどを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/servicenow" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="other" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* その他のカードのみ表示 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Persefoni</CardTitle>
                <CardDescription>気候会計・排出量管理プラットフォーム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-teal-600">サステナビリティ</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=persefoni" alt="Persefoni" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Persefoniから排出係数、GHGインベントリ、活動データなどを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/persefoni" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Google Drive</CardTitle>
                <CardDescription>ドキュメント管理システム</CardDescription>
                <Badge className="absolute top-4 right-4 bg-orange-600">ドキュメント</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <img src="/placeholder.svg?key=googledrive" alt="Google Drive" className="h-16 object-contain" />
                </div>
                <p className="text-sm text-gray-500">
                  Google Driveからドキュメント、スプレッドシート、プレゼンテーションなどを取得します。
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/settings/connectors/cloud/google-drive" className="w-full">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
