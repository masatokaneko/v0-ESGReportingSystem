"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { logClientError } from "@/lib/error-logger"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラーログを記録
    logClientError({
      error_type: error.name,
      message: error.message,
      stack_trace: error.stack,
      component: this.props.componentName || "unknown",
      context: {
        componentStack: errorInfo.componentStack,
      },
    }).catch((err) => {
      console.error("Failed to log error:", err)
    })
  }

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックUIがある場合はそれを表示
      if (this.props.fallback) {
        return this.props.fallback
      }

      // デフォルトのエラーUI
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            エラーが発生しました
          </AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              <p className="mb-2">コンポーネントの読み込み中にエラーが発生しました。</p>
              {this.state.error && (
                <div className="text-sm bg-red-50 p-2 rounded">
                  <p>
                    <strong>エラータイプ:</strong> {this.state.error.name}
                  </p>
                  <p>
                    <strong>メッセージ:</strong> {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details>
                      <summary className="cursor-pointer">スタックトレース</summary>
                      <pre className="text-xs overflow-auto mt-1 p-1 bg-red-100 rounded">{this.state.error.stack}</pre>
                    </details>
                  )}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => this.setState({ hasError: false })}
                className="flex items-center gap-1 mt-2"
              >
                <RefreshCw className="h-4 w-4" />
                再試行
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}
