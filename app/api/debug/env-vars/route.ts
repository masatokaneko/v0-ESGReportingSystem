import { NextResponse } from "next/server"

export async function GET() {
  // 環境変数の一覧を取得（機密情報は除外）
  const envVars = Object.keys(process.env)
    .filter((key) => key.startsWith("NEON_"))
    .reduce((obj, key) => {
      // 値の最初の数文字だけを表示（セキュリティのため）
      const value = process.env[key] || ""
      const maskedValue = value.length > 10 ? value.substring(0, 5) + "..." + value.substring(value.length - 5) : "***"

      return {
        ...obj,
        [key]: maskedValue,
      }
    }, {})

  return NextResponse.json({
    message: "Available Neon environment variables",
    variables: envVars,
  })
}
