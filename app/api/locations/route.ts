import { db } from '@/lib/neon'
import { locations } from '@/lib/database.schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const data = await db
      .select({
        id: locations.id,
        name: locations.name,
        region: locations.region,
        country: locations.country,
        createdAt: locations.createdAt
      })
      .from(locations)
      .orderBy(locations.name)

    // データを期待される形式に変換（既存のAPIとの互換性のため）
    const transformedData = data.map(item => ({
      id: item.id,
      name: item.name,
      code: `${item.country}-${item.region}`, // regionとcountryからcodeを生成
      address: `${item.region}, ${item.country}`, // regionとcountryからaddressを生成
      type: 'office', // デフォルト値
      createdAt: item.createdAt
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Locations fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}