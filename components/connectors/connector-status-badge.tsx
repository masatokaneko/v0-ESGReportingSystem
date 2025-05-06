import { Badge } from "@/components/ui/badge"
import type { ConnectorStatus } from "@/lib/connectors"

interface ConnectorStatusBadgeProps {
  status: ConnectorStatus
}

export function ConnectorStatusBadge({ status }: ConnectorStatusBadgeProps) {
  switch (status) {
    case "connected":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          接続済み
        </Badge>
      )
    case "disconnected":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          未接続
        </Badge>
      )
    case "error":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          エラー
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          接続中
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          未設定
        </Badge>
      )
  }
}
