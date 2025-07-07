import { NextResponse } from 'next/server'

interface DatabaseError extends Error {
  code?: string
  detail?: string
  hint?: string
  table?: string
  constraint?: string
}

export function handleDatabaseError(error: unknown, operation: string) {
  console.error(`Database error during ${operation}:`, error)

  if (error instanceof Error) {
    const dbError = error as DatabaseError

    // PostgreSQL error codes
    switch (dbError.code) {
      case '23505': // unique_violation
        return NextResponse.json(
          { 
            error: 'データが既に存在します',
            details: dbError.detail,
            code: dbError.code
          },
          { status: 409 }
        )
      
      case '23503': // foreign_key_violation
        return NextResponse.json(
          { 
            error: '関連するデータが存在しません',
            details: dbError.detail,
            code: dbError.code
          },
          { status: 400 }
        )
      
      case '23502': // not_null_violation
        return NextResponse.json(
          { 
            error: '必須項目が入力されていません',
            details: dbError.detail,
            code: dbError.code
          },
          { status: 400 }
        )
      
      case '22P02': // invalid_text_representation
        return NextResponse.json(
          { 
            error: '入力データの形式が正しくありません',
            details: dbError.detail,
            code: dbError.code
          },
          { status: 400 }
        )
      
      case '42P01': // undefined_table
        return NextResponse.json(
          { 
            error: 'データベーステーブルが見つかりません',
            details: 'データベースの設定を確認してください',
            code: dbError.code
          },
          { status: 500 }
        )
      
      case '08P01': // protocol_violation
      case '08006': // connection_failure
      case '08001': // sqlclient_unable_to_establish_sqlconnection
        return NextResponse.json(
          { 
            error: 'データベース接続エラー',
            details: 'しばらく待ってから再度お試しください',
            code: dbError.code
          },
          { status: 503 }
        )
      
      default:
        if (dbError.message.includes('connect')) {
          return NextResponse.json(
            { 
              error: 'データベースに接続できません',
              details: 'DATABASE_URLが正しく設定されているか確認してください'
            },
            { status: 503 }
          )
        }
        
        return NextResponse.json(
          { 
            error: `${operation}に失敗しました`,
            details: dbError.message,
            code: dbError.code
          },
          { status: 500 }
        )
    }
  }

  // Unknown error
  return NextResponse.json(
    { 
      error: `${operation}中に予期しないエラーが発生しました`,
      details: 'システム管理者にお問い合わせください'
    },
    { status: 500 }
  )
}