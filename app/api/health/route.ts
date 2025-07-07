import { db } from '@/lib/neon'
import { sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = Date.now()
  
  try {
    // データベース接続テスト
    const result = await db.execute(sql`SELECT 1 as test`)
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}