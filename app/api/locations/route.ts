import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        id,
        name,
        code,
        address,
        type,
        created_at as "createdAt"
      FROM locations
      ORDER BY name
    `

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Locations fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}