export interface Connector {
  id?: string
  name: string
  category: ConnectorCategory
  sampleData: string[]
  status?: ConnectorStatus
  syncSchedule?: string
  lastSync?: string
}

export type ConnectorCategory =
  | "FinanceERP"
  | "Accounting"
  | "CRM"
  | "SCM"
  | "EnergyEMS"
  | "HRSafety"
  | "Sustainability"
  | "Document"

export type ConnectorStatus = "connected" | "disconnected" | "error" | "pending"

export const DEFAULT_CONNECTORS: Connector[] = [
  // Finance / ERP
  { name: "SAP S/4HANA Cloud", category: "FinanceERP", sampleData: ["JournalEntry", "FuelExpense", "Asset"] },
  { name: "Oracle Fusion ERP", category: "FinanceERP", sampleData: ["GL", "PO", "Inventory"] },
  { name: "Microsoft Dynamics 365 Finance", category: "FinanceERP", sampleData: ["Voucher", "VendorInvoice"] },
  { name: "NetSuite", category: "FinanceERP", sampleData: ["Transaction", "ItemFulfillment"] },

  // Accounting SaaS
  { name: "Freee", category: "Accounting", sampleData: ["勘定科目", "取引", "請求書"] },
  { name: "QuickBooks Online", category: "Accounting", sampleData: ["Journal", "Invoice", "Bill"] },
  { name: "Xero", category: "Accounting", sampleData: ["Accounts", "Payments"] },

  // CRM / Contract
  { name: "Salesforce", category: "CRM", sampleData: ["Opportunity", "Contract", "UsageQuantity"] },
  { name: "HubSpot", category: "CRM", sampleData: ["Deal", "Quote"] },
  { name: "ServiceNow", category: "CRM", sampleData: ["Asset", "WorkOrder"] },

  // SCM / Procurement
  { name: "SAP Ariba", category: "SCM", sampleData: ["PurchaseOrder", "GR/IR", "Supplier"] },
  { name: "Coupa", category: "SCM", sampleData: ["Invoice", "Spend", "Supplier"] },
  { name: "Ivalua", category: "SCM", sampleData: ["Commodity", "PO", "Contract"] },

  // Energy & Metering
  { name: "EnergyCAP", category: "EnergyEMS", sampleData: ["MeterReading", "Cost", "FuelType"] },
  { name: "EcoStruxure Resource Advisor", category: "EnergyEMS", sampleData: ["SiteEnergy", "GHGFactor"] },
  { name: "EnOS", category: "EnergyEMS", sampleData: ["PowerGeneration", "FuelMix"] },

  // HR / Safety
  { name: "Workday", category: "HRSafety", sampleData: ["Headcount", "SafetyIncident"] },
  { name: "SAP SuccessFactors", category: "HRSafety", sampleData: ["Employee", "Accident"] },

  // Sustainability Platform
  { name: "Watershed", category: "Sustainability", sampleData: ["GHGInventory", "ReductionPlan"] },
  { name: "Persefoni", category: "Sustainability", sampleData: ["EmissionFactor", "AuditLog"] },

  // Document Storage
  { name: "Box", category: "Document", sampleData: ["PDF", "CSV"] },
  { name: "Google Drive", category: "Document", sampleData: ["PDF", "Spreadsheet"] },
]

export const CATEGORY_LABELS: Record<ConnectorCategory, string> = {
  FinanceERP: "財務/ERP",
  Accounting: "会計",
  CRM: "顧客管理/契約",
  SCM: "サプライチェーン/調達",
  EnergyEMS: "エネルギー/メータリング",
  HRSafety: "人事/安全",
  Sustainability: "サステナビリティ",
  Document: "文書管理",
}

export interface AgentConnection {
  id: string
  connection_name: string
  connection_type: ConnectionType
  status: "online" | "offline" | "error"
  last_heartbeat?: string
  schedule: string
  config: Record<string, any>
  agent_token: string
}

export type ConnectionType =
  | "jdbc"
  | "odbc"
  | "sftp"
  | "filewatch"
  | "mqtt"
  | "opcua"
  | "modbus_tcp"
  | "rest_pull"
  | "scada_socket"
