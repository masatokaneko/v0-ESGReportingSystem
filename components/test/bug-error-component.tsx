"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface BugErrorComponentProps {
  shouldError: boolean
}

export function BugErrorComponent({ shouldError }: BugErrorComponentProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (shouldError && !hasError) {
      setHasError(true)
      throw new Error("テスト用のコンポーネントエラー")
    }
  }, [shouldError, hasError])

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
