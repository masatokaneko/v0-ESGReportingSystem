import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ESGEntrySchema = z.object({
  date: z.string(),
  location: z.string(),
  department: z.string(),
  activityType: z.string(),
  activityAmount: z.number().positive(),
  emissionFactor: z.number().positive(),
  submitter: z.string(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = `
      SELECT 
        id,
        date,
        location,
        department,
        activity_type as "activityType",
        activity_amount as "activityAmount",
        emission_factor as "emissionFactor",
        emission,
        status,
        submitter,
        submitted_at as "submittedAt",
        approved_by as "approvedBy",
        approved_at as "approvedAt",
        notes,
        created_at as "createdAt"
      FROM esg_entries
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (location) {
      query += ` AND location = $${paramIndex}`
      params.push(location)
      paramIndex++
    }

    if (department) {
      query += ` AND department = $${paramIndex}`
      params.push(department)
      paramIndex++
    }

    if (status) {
      query += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (startDate) {
      query += ` AND date >= $${paramIndex}`
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      query += ` AND date <= $${paramIndex}`
      params.push(endDate)
      paramIndex++
    }

    query += ' ORDER BY date DESC, created_at DESC'

    const { rows } = await sql.query(query, params)
    
    return NextResponse.json(rows)
  } catch (error) {
    console.error('ESG entries fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ESG entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = ESGEntrySchema.parse(body)

    const emission = validatedData.activityAmount * validatedData.emissionFactor

    const { rows } = await sql`
      INSERT INTO esg_entries (
        date, location, department, activity_type,
        activity_amount, emission_factor, emission,
        status, submitter, notes
      ) VALUES (
        ${validatedData.date},
        ${validatedData.location},
        ${validatedData.department},
        ${validatedData.activityType},
        ${validatedData.activityAmount},
        ${validatedData.emissionFactor},
        ${emission},
        'pending',
        ${validatedData.submitter},
        ${validatedData.notes || null}
      )
      RETURNING 
        id,
        date,
        location,
        department,
        activity_type as "activityType",
        activity_amount as "activityAmount",
        emission_factor as "emissionFactor",
        emission,
        status,
        submitter,
        submitted_at as "submittedAt",
        notes,
        created_at as "createdAt"
    `

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error('ESG entry creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create ESG entry' },
      { status: 500 }
    )
  }
}