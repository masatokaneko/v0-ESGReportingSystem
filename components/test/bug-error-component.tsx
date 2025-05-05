"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BugErrorComponentProps {
  shouldError: boolean
}

export function BugErrorComponent({ shouldError }: BugErrorComponentProps) {
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (shouldError && !hasError) {
      try {
        // エラーを発生させる代わりに、エラーメッセージを設定
        setErrorMessage("テスト用のコンポーネントエラー")
        setHasError(true)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unknown error")
        setHasError(true)
      }
    }
  }, [shouldError, hasError])

  if (hasError && errorMessage) {
    return (
      <Card>
        <CardContent className="p-4">
          <Alert variant="destructive">
            <AlertTitle>エラーが発生しました</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        {shouldError ? (
          <p>このコンポーネントはエラーを発生させます</p>
        ) : (
          <p>このコンポーネントは正常に動作しています</p>
        )}
      </CardContent>
    </Card>
  )
}
