"use client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface EmissionsOverviewProps {
  data: {
    scope1: number
    scope2: number
    scope3: number
  }
}

export function EmissionsOverview({ data = { scope1: 0, scope2: 0, scope3: 0 } }: EmissionsOverviewProps) {
  // スコープ別データ
  const scopeData = [
    { name: "Scope 1", value: data.scope1 },
    { name: "Scope 2", value: data.scope2 },
    { name: "Scope 3", value: data.scope3 },
  ]

  // カテゴリ別データ（仮のデータ）
  const categoryData = [
    { name: "電力", value: data.scope2 * 0.8 },
    { name: "燃料", value: data.scope1 * 0.7 },
    { name: "輸送", value: data.scope3 * 0.4 },
    { name: "廃棄物", value: data.scope3 * 0.2 },
    { name: "その他", value: data.scope1 * 0.3 + data.scope2 * 0.2 + data.scope3 * 0.4 },
  ]

  // カラーパレット
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="w-full h-[300px]">
        <h3 className="text-sm font-medium mb-2">スコープ別排出量</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={scopeData}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()} kg-CO2e`} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="排出量" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full h-[300px]">
        <h3 className="text-sm font-medium mb-2">カテゴリ別排出量</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()} kg-CO2e`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
