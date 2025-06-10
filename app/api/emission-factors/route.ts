import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        id,
        activity_type as "activityType",
        category,
        factor,
        unit,
        valid_from as "validFrom",
        valid_to as "validTo",
        created_at as "createdAt"
      FROM emission_factors
      WHERE (valid_to IS NULL OR valid_to >= CURRENT_DATE)
      ORDER BY activity_type, category
    `

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Emission factors fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emission factors' },
      { status: 500 }
    )
  }
}