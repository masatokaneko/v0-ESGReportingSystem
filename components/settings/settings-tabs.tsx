"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmissionFactorSettings } from "./emission-factor-settings"
import { UserSettings } from "./user-settings"
import { LocationSettings } from "./location-settings"
import { DepartmentSettings } from "./department-settings"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="emission-factors" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="emission-factors">原単位マスタ</TabsTrigger>
        <TabsTrigger value="users">ユーザー管理</TabsTrigger>
        <TabsTrigger value="locations">拠点管理</TabsTrigger>
        <TabsTrigger value="departments">部門管理</TabsTrigger>
      </TabsList>
      <TabsContent value="emission-factors">
        <EmissionFactorSettings />
      </TabsContent>
      <TabsContent value="users">
        <UserSettings />
      </TabsContent>
      <TabsContent value="locations">
        <LocationSettings />
      </TabsContent>
      <TabsContent value="departments">
        <DepartmentSettings />
      </TabsContent>
    </Tabs>
  )
}
