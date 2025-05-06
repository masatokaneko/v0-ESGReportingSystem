"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type SaasConnector = {
  id: string
  name: string
  category: string
  logo: string
  popular?: boolean
}

const SAAS_CONNECTORS: SaasConnector[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    logo: "/salesforce-concept.png",
    popular: true,
  },
  {
    id: "workday",
    name: "Workday",
    category: "HR",
    logo: "/placeholder.svg?key=m8xyv",
    popular: true,
  },
  {
    id: "sap",
    name: "SAP S/4HANA Cloud",
    category: "ERP",
    logo: "/sap-logo.png",
    popular: true,
  },
  {
    id: "oracle",
    name: "Oracle Fusion ERP",
    category: "ERP",
    logo: "/mystical-oracle.png",
    popular: true,
  },
  {
    id: "dynamics",
    name: "Microsoft Dynamics 365",
    category: "ERP",
    logo: "/microsoft-campus.png",
  },
  {
    id: "netsuite",
    name: "NetSuite",
    category: "ERP",
    logo: "/placeholder.svg?key=ob3nt",
  },
  {
    id: "freee",
    name: "Freee",
    category: "Accounting",
    logo: "/placeholder.svg?key=hjk2n",
  },
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    category: "Accounting",
    logo: "/quickbooks-interface.png",
  },
  {
    id: "xero",
    name: "Xero",
    category: "Accounting",
    logo: "/placeholder.svg?key=bw9qj",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    logo: "/hubspot-logo.png",
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    category: "ITSM",
    logo: "/placeholder.svg?key=5i6bb",
  },
  {
    id: "ariba",
    name: "SAP Ariba",
    category: "SCM",
    logo: "/placeholder.svg?height=40&width=40&query=SAP Ariba",
  },
  {
    id: "coupa",
    name: "Coupa",
    category: "SCM",
    logo: "/placeholder.svg?height=40&width=40&query=Coupa",
  },
  {
    id: "energycap",
    name: "EnergyCAP",
    category: "Energy",
    logo: "/placeholder.svg?height=40&width=40&query=EnergyCAP",
  },
  {
    id: "ecostruxure",
    name: "EcoStruxure",
    category: "Energy",
    logo: "/placeholder.svg?height=40&width=40&query=EcoStruxure",
  },
  {
    id: "watershed",
    name: "Watershed",
    category: "Sustainability",
    logo: "/placeholder.svg?height=40&width=40&query=Watershed",
  },
  {
    id: "persefoni",
    name: "Persefoni",
    category: "Sustainability",
    logo: "/placeholder.svg?height=40&width=40&query=Persefoni",
  },
]

export function SaasConnectorList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredConnectors = SAAS_CONNECTORS.filter((connector) => {
    const matchesSearch = connector.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? connector.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(SAAS_CONNECTORS.map((connector) => connector.category)))

  const popularConnectors = filteredConnectors.filter((connector) => connector.popular)
  const otherConnectors = filteredConnectors.filter((connector) => !connector.popular)

  return (
    <Card>
      <CardHeader>
        <CardTitle>SaaSサービス</CardTitle>
        <CardDescription>接続するSaaSサービスを選択してください</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="サービスを検索..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 text-xs rounded-full ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              すべて
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 text-xs rounded-full ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              >
                {category}
              </button>
            ))}
          </div>

          {popularConnectors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">人気のサービス</h3>
              <div className="space-y-2">
                {popularConnectors.map((connector) => (
                  <button
                    key={connector.id}
                    className="flex items-center w-full p-2 rounded-md hover:bg-accent"
                    onClick={() => {
                      // コネクタ選択処理
                    }}
                  >
                    <img
                      src={connector.logo || "/placeholder.svg"}
                      alt={connector.name}
                      className="w-8 h-8 mr-3 rounded-md"
                    />
                    <div className="text-left">
                      <div className="font-medium">{connector.name}</div>
                      <div className="text-xs text-muted-foreground">{connector.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {otherConnectors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">その他のサービス</h3>
              <div className="space-y-2">
                {otherConnectors.map((connector) => (
                  <button
                    key={connector.id}
                    className="flex items-center w-full p-2 rounded-md hover:bg-accent"
                    onClick={() => {
                      // コネクタ選択処理
                    }}
                  >
                    <img
                      src={connector.logo || "/placeholder.svg"}
                      alt={connector.name}
                      className="w-8 h-8 mr-3 rounded-md"
                    />
                    <div className="text-left">
                      <div className="font-medium">{connector.name}</div>
                      <div className="text-xs text-muted-foreground">{connector.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredConnectors.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">検索条件に一致するサービスがありません</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
