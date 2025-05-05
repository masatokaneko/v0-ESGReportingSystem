import { NextResponse } from "next/server"
import { getSupabaseServer, isSupabaseServerInitialized } from "@/lib/supabase"

// エラーの分析と解決策を提供するAPI
export async function GET() {
  if (!isSupabaseServerInitialized()) {
    return NextResponse.json({ error: "Database client not initialized" }, { status: 500 })
  }

  try {
    const supabase = getSupabaseServer()

    // エラーログを取得
    const { data: errorLogs, error } = await supabase
      .from("error_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // エラータイプごとの集計
    const errorTypeCounts: Record<string, number> = {}
    const routeErrorCounts: Record<string, number> = {}
    const componentErrorCounts: Record<string, number> = {}

    errorLogs.forEach((log) => {
      // エラータイプの集計
      errorTypeCounts[log.error_type] = (errorTypeCounts[log.error_type] || 0) + 1

      // ルートごとのエラー集計
      if (log.route) {
        routeErrorCounts[log.route] = (routeErrorCounts[log.route] || 0) + 1
      }

      // コンポーネントごとのエラー集計
      if (log.component) {
        componentErrorCounts[log.component] = (componentErrorCounts[log.component] || 0) + 1
      }
    })

    // 最も頻繁に発生しているエラーを特定
    const mostCommonErrorType = Object.entries(errorTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const mostProblematicRoutes = Object.entries(routeErrorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const mostProblematicComponents = Object.entries(componentErrorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // エラータイプごとの解決策を提案
    const solutions: Record<string, string> = {
      TypeError:
        "型チェックを強化し、nullやundefinedの可能性があるオブジェクトにアクセスする前にチェックを行ってください。",
      ReferenceError: "未定義の変数や関数を参照しています。変数名のタイプミスや、インポートの問題を確認してください。",
      SyntaxError: "コード内に構文エラーがあります。括弧、カンマ、セミコロンなどの記号を確認してください。",
      NetworkError: "ネットワーク接続に問題があります。APIエンドポイントのURLや認証情報を確認してください。",
      AuthenticationError: "認証に失敗しています。認証情報やトークンの有効期限を確認してください。",
      PermissionError: "必要な権限がありません。RLSポリシーやユーザー権限を確認してください。",
      GlobalError: "グローバルスコープでエラーが発生しています。イベントハンドラやタイマー関数を確認してください。",
      UnhandledPromiseRejection:
        "Promiseのエラーハンドリングが不足しています。try/catchブロックやcatch()メソッドを追加してください。",
      TestClientError: "これはテスト用のエラーです。実際のアプリケーションでは発生しません。",
    }

    return NextResponse.json({
      summary: {
        totalErrors: errorLogs.length,
        errorTypeCounts,
        mostCommonErrorType,
        mostProblematicRoutes,
        mostProblematicComponents,
      },
      solutions,
      recentErrors: errorLogs.slice(0, 10),
    })
  } catch (error) {
    console.error("Error analyzing error logs:", error)
    return NextResponse.json({ error: "Failed to analyze error logs" }, { status: 500 })
  }
}
