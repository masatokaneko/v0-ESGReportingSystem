import { db } from '@/lib/neon'
import { emissionFactors } from '@/lib/database.schema'
import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    const data = await db
      .select({
        id: emissionFactors.id,
        category: emissionFactors.category,
        subcategory: emissionFactors.subcategory,
        factor: emissionFactors.factor,
        unit: emissionFactors.unit,
        source: emissionFactors.source,
        year: emissionFactors.year,
        createdAt: emissionFactors.createdAt
      })
      .from(emissionFactors)
      .orderBy(emissionFactors.category, emissionFactors.subcategory)

    // データを期待される形式に変換（既存のAPIとの互換性のため）
    const transformedData = data.map(item => ({
      id: item.id,
      activityType: item.subcategory, // subcategoryをactivityTypeとして使用
      category: item.category,
      factor: Number(item.factor),
      unit: item.unit,
      validFrom: `${item.year}-01-01`, // yearから有効開始日を生成
      validTo: `${item.year}-12-31`, // yearから有効終了日を生成
      createdAt: item.createdAt
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Emission factors fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emission factors' },
      { status: 500 }
    )
  }
}