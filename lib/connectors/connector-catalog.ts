export type ConnectorType = {
  name: string
  category: string
  sampleData: string[]
  status?: "connected" | "disconnected"
  syncSchedule?: string
}

export const DEFAULT_CONNECTORS: ConnectorType[] = [
  // Finance / ERP
  {
    name: "SAP S/4HANA Cloud",
    category: "FinanceERP",
    sampleData: ["JournalEntry", "FuelExpense", "Asset"],
  },
  {
    name: "Oracle Fusion ERP",
    category: "FinanceERP",
    sampleData: ["GL", "PO", "Inventory"],
  },
  {
    name: "Microsoft Dynamics 365 Finance",
    category: "FinanceERP",
    sampleData: ["Voucher", "VendorInvoice"],
  },
  {
    name: "NetSuite",
    category: "FinanceERP",
    sampleData: ["Transaction", "ItemFulfillment"],
  },

  // Accounting SaaS
  {
    name: "Freee",
    category: "Accounting",
    sampleData: ["勘定科目", "取引", "請求書"],
  },
  {
    name: "QuickBooks Online",
    category: "Accounting",
    sampleData: ["Journal", "Invoice", "Bill"],
  },
  {
    name: "Xero",
    category: "Accounting",
    sampleData: ["Accounts", "Payments"],
  },

  // CRM / Contract
  {
    name: "Salesforce",
    category: "CRM",
    sampleData: ["Opportunity", "Contract", "UsageQuantity"],
  },
  {
    name: "HubSpot",
    category: "CRM",
    sampleData: ["Deal", "Quote"],
  },
  {
    name: "ServiceNow",
    category: "CRM",
    sampleData: ["Asset", "WorkOrder"],
  },

  // SCM / Procurement
  {
    name: "SAP Ariba",
    category: "SCM",
    sampleData: ["PurchaseOrder", "GR/IR", "Supplier"],
  },
  {
    name: "Coupa",
    category: "SCM",
    sampleData: ["Invoice", "Spend", "Supplier"],
  },
  {
    name: "Ivalua",
    category: "SCM",
    sampleData: ["Commodity", "PO", "Contract"],
  },

  // Energy & Metering
  {
    name: "EnergyCAP",
    category: "EnergyEMS",
    sampleData: ["MeterReading", "Cost", "FuelType"],
  },
  {
    name: "EcoStruxure Resource Advisor",
    category: "EnergyEMS",
    sampleData: ["SiteEnergy", "GHGFactor"],
  },
  {
    name: "EnOS",
    category: "EnergyEMS",
    sampleData: ["PowerGeneration", "FuelMix"],
  },

  // HR / Safety
  {
    name: "Workday",
    category: "HRSafety",
    sampleData: ["Headcount", "SafetyIncident"],
  },
  {
    name: "SAP SuccessFactors",
    category: "HRSafety",
    sampleData: ["Employee", "Accident"],
  },

  // Sustainability Platform
  {
    name: "Watershed",
    category: "Sustainability",
    sampleData: ["GHGInventory", "ReductionPlan"],
  },
  {
    name: "Persefoni",
    category: "Sustainability",
    sampleData: ["EmissionFactor", "AuditLog"],
  },

  // Document Storage
  {
    name: "Box",
    category: "Document",
    sampleData: ["PDF", "CSV"],
  },
  {
    name: "Google Drive",
    category: "Document",
    sampleData: ["PDF", "Spreadsheet"],
  },
]

export const getConnectorsByCategory = (category?: string) => {
  if (!category) return DEFAULT_CONNECTORS
  return DEFAULT_CONNECTORS.filter((connector) => connector.category === category)
}
